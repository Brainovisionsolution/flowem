import crypto from 'crypto';
import { query } from '../../config/db.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';
import { automationEngine } from '../automations/automationEngine.js';

function isValidEmail(email) {
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return re.test(String(email).trim().toLowerCase());
}

export const contactsService = {
  async getAllContacts(search = '') {
    let sql = `
      SELECT c.*,
             GROUP_CONCAT(DISTINCT t.name SEPARATOR ',') as tag_names,
             GROUP_CONCAT(DISTINCT cl.name SEPARATOR ',') as list_names
      FROM contacts c
      LEFT JOIN contact_tags ct ON c.id = ct.contact_id
      LEFT JOIN tags t ON ct.tag_id = t.id
      LEFT JOIN contact_list_members clm ON c.id = clm.contact_id
      LEFT JOIN contact_lists cl ON clm.list_id = cl.id
    `;
    const params = [];

    if (search && search.trim()) {
      sql += ` WHERE c.email LIKE ? OR c.first_name LIKE ? OR c.last_name LIKE ? `;
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    sql += ` GROUP BY c.id ORDER BY c.created_at DESC`;

    const contacts = await query(sql, params);

    return contacts.map(c => ({
      id: c.id,
      email: c.email,
      firstName: c.first_name || '',
      lastName: c.last_name || '',
      status: c.status === 'Active' ? 'Subscribed' : c.status,
      lists: c.list_names ? c.list_names.split(',') : ['General Audience'],
      engagementScore: 85,
      lastSentAt: 'Pending',
      createdAt: c.created_at ? new Date(c.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      deliveriesCount: 0,
      opensCount: 0,
      clicksCount: 0,
      tags: c.tag_names ? c.tag_names.split(',') : ['Customer']
    }));
  },

  async createContact(data) {
    if (!data.email || !isValidEmail(data.email)) {
      throw new BadRequestError('A valid email address is required');
    }

    const cleanEmail = data.email.trim().toLowerCase();

    // Check if contact already exists
    const existingRows = await query('SELECT * FROM contacts WHERE email = ? LIMIT 1', [cleanEmail]);
    if (existingRows.length > 0) {
      const existing = existingRows[0];
      return {
        id: existing.id,
        email: existing.email,
        firstName: existing.first_name || '',
        lastName: existing.last_name || '',
        status: existing.status === 'Active' ? 'Subscribed' : existing.status,
        lists: ['General Audience'],
        engagementScore: 85,
        lastSentAt: 'Pending',
        createdAt: new Date(existing.created_at).toISOString().split('T')[0],
        deliveriesCount: 0,
        opensCount: 0,
        clicksCount: 0,
        tags: ['Customer']
      };
    }

    // Verify suppression status
    const suppressedRows = await query('SELECT id FROM suppressions WHERE email = ? LIMIT 1', [cleanEmail]);
    const contactStatus = suppressedRows.length > 0 ? 'Bounced' : (data.status === 'Subscribed' ? 'Active' : (data.status || 'Active'));

    const contactId = crypto.randomUUID();
    await query(
      `INSERT INTO contacts (id, email, first_name, last_name, phone, status, source, consent_given, consent_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        contactId,
        cleanEmail,
        data.firstName || '',
        data.lastName || '',
        data.phone || null,
        contactStatus,
        data.source || 'Manual',
        1
      ]
    );

    // Handle tag connections
    if (data.tags && Array.isArray(data.tags)) {
      for (const tagName of data.tags) {
        if (!tagName) continue;
        const cleanTag = tagName.trim();
        let tagRows = await query('SELECT id FROM tags WHERE name = ? LIMIT 1', [cleanTag]);
        let tagId;
        if (tagRows.length === 0) {
          tagId = crypto.randomUUID();
          await query('INSERT INTO tags (id, name) VALUES (?, ?)', [tagId, cleanTag]).catch(() => {});
        } else {
          tagId = tagRows[0].id;
        }

        const ctId = crypto.randomUUID();
        await query(
          'INSERT IGNORE INTO contact_tags (id, contact_id, tag_id) VALUES (?, ?, ?)',
          [ctId, contactId, tagId]
        ).catch(() => {});
      }
    }

    // Trigger active automation workflows
    automationEngine.handleTrigger('contact_signup', {
      contactId,
      email: cleanEmail,
      metadata: { source: data.source || 'Manual' }
    }).catch(err => {
      console.warn(`[Automation Engine] Trigger failure on signup for ${cleanEmail}:`, err.message);
    });

    return {
      id: contactId,
      email: cleanEmail,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      status: 'Subscribed',
      lists: data.lists || ['General Audience'],
      engagementScore: 85,
      lastSentAt: 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
      deliveriesCount: 0,
      opensCount: 0,
      clicksCount: 0,
      tags: data.tags || ['Customer']
    };
  },

  async updateContact(id, data) {
    const rows = await query('SELECT * FROM contacts WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) throw new NotFoundError('Contact not found');
    const existing = rows[0];

    const firstName = data.firstName !== undefined ? data.firstName : existing.first_name;
    const lastName = data.lastName !== undefined ? data.lastName : existing.last_name;
    const phone = data.phone !== undefined ? data.phone : existing.phone;
    const status = data.status !== undefined ? (data.status === 'Subscribed' ? 'Active' : data.status) : existing.status;

    await query(
      `UPDATE contacts SET first_name = ?, last_name = ?, phone = ?, status = ?, updated_at = NOW() WHERE id = ?`,
      [firstName, lastName, phone, status, id]
    );

    return {
      id,
      email: existing.email,
      firstName,
      lastName,
      phone,
      status
    };
  },

  async deleteContact(id) {
    await query('DELETE FROM contact_list_members WHERE contact_id = ?', [id]).catch(() => {});
    await query('DELETE FROM contact_tags WHERE contact_id = ?', [id]).catch(() => {});
    await query('DELETE FROM contacts WHERE id = ?', [id]);
    return { success: true };
  },

  async importBatch(items, filename = 'spreadsheet.csv') {
    let imported = 0;
    let failed = 0;
    const errors = [];

    for (const item of items) {
      try {
        if (!item.email || !isValidEmail(item.email)) {
          failed++;
          errors.push(`Invalid email: ${item.email}`);
          continue;
        }

        await this.createContact({
          email: item.email.trim(),
          firstName: item.firstName || item.first_name || '',
          lastName: item.lastName || item.last_name || '',
          status: 'Active',
          source: 'CSV Import',
          tags: item.tags ? (Array.isArray(item.tags) ? item.tags : [item.tags]) : ['CSV Import']
        });
        imported++;
      } catch (err) {
        failed++;
        errors.push(`Error on ${item.email}: ${err.message}`);
      }
    }

    return { imported, failed, total: items.length };
  },

  async exportContactsCsv() {
    const contacts = await query(`
      SELECT c.*, GROUP_CONCAT(DISTINCT t.name SEPARATOR ', ') as tag_names
      FROM contacts c
      LEFT JOIN contact_tags ct ON c.id = ct.contact_id
      LEFT JOIN tags t ON ct.tag_id = t.id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    const rows = [
      ['Email', 'First Name', 'Last Name', 'Status', 'Tags', 'Created At']
    ];

    for (const c of contacts) {
      rows.push([
        `"${c.email.replace(/"/g, '""')}"`,
        `"${(c.first_name || '').replace(/"/g, '""')}"`,
        `"${(c.last_name || '').replace(/"/g, '""')}"`,
        `"${c.status}"`,
        `"${(c.tag_names || '').replace(/"/g, '""')}"`,
        `"${new Date(c.created_at).toISOString()}"`
      ]);
    }

    return rows.map(r => r.join(',')).join('\n');
  }
};
