import { prisma } from '../../config/db.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';
import { automationEngine } from '../automations/automationEngine.js';

function isValidEmail(email) {
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return re.test(String(email).trim().toLowerCase());
}

export const contactsService = {
  async getAllContacts(search = '') {
    const where = search ? {
      OR: [
        { email: { contains: search } },
        { firstName: { contains: search } },
        { lastName: { contains: search } }
      ]
    } : {};

    const contacts = await prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        listMembers: {
          include: { list: true }
        },
        tags: {
          include: { tag: true }
        }
      }
    });

    return contacts.map(c => ({
      id: c.id,
      email: c.email,
      firstName: c.firstName || '',
      lastName: c.lastName || '',
      status: c.status === 'Active' ? 'Subscribed' : c.status,
      lists: c.listMembers.map(lm => lm.list.name),
      engagementScore: 85,
      lastSentAt: 'Pending',
      createdAt: c.createdAt.toISOString().split('T')[0],
      deliveriesCount: 0,
      opensCount: 0,
      clicksCount: 0,
      tags: c.tags.map(t => t.tag.name)
    }));
  },

  async createContact(data) {
    if (!data.email || !isValidEmail(data.email)) {
      throw new BadRequestError('A valid email address is required');
    }

    const cleanEmail = data.email.trim().toLowerCase();

    // Check if contact already exists
    const existing = await prisma.contact.findUnique({
      where: { email: cleanEmail },
      include: {
        tags: { include: { tag: true } },
        listMembers: { include: { list: true } }
      }
    });

    if (existing) {
      return {
        id: existing.id,
        email: existing.email,
        firstName: existing.firstName || '',
        lastName: existing.lastName || '',
        status: existing.status === 'Active' ? 'Subscribed' : existing.status,
        lists: existing.listMembers.map(lm => lm.list.name),
        engagementScore: 85,
        lastSentAt: 'Pending',
        createdAt: existing.createdAt.toISOString().split('T')[0],
        deliveriesCount: 0,
        opensCount: 0,
        clicksCount: 0,
        tags: existing.tags.map(t => t.tag.name)
      };
    }

    // Verify suppression status
    const suppressed = await prisma.suppression.findUnique({
      where: { email: cleanEmail }
    });

    const contactStatus = suppressed ? 'Bounced' : (data.status === 'Subscribed' ? 'Active' : (data.status || 'Active'));

    const contact = await prisma.contact.create({
      data: {
        email: cleanEmail,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || null,
        status: contactStatus,
        source: data.source || 'Manual',
        consentGiven: true,
        consentDate: new Date()
      }
    });

    // Handle tag connections
    if (data.tags && Array.isArray(data.tags)) {
      for (const tagName of data.tags) {
        if (!tagName) continue;
        const tag = await prisma.tag.upsert({
          where: { name: tagName.trim() },
          create: { name: tagName.trim() },
          update: {}
        });
        await prisma.contactTag.create({
          data: {
            contactId: contact.id,
            tagId: tag.id
          }
        }).catch(() => {});
      }
    }

    // Trigger active automation workflows
    automationEngine.handleTrigger('contact_signup', {
      contactId: contact.id,
      email: contact.email,
      metadata: { source: data.source || 'Manual' }
    }).catch(err => {
      console.warn(`[Automation Engine] Trigger failure on signup for ${contact.email}:`, err.message);
    });

    return {
      id: contact.id,
      email: contact.email,
      firstName: contact.firstName,
      lastName: contact.lastName,
      status: 'Subscribed',
      lists: data.lists || ['General Audience'],
      engagementScore: 85,
      lastSentAt: 'Pending',
      createdAt: contact.createdAt.toISOString().split('T')[0],
      deliveriesCount: 0,
      opensCount: 0,
      clicksCount: 0,
      tags: data.tags || ['Customer']
    };
  },

  async updateContact(id, data) {
    const existing = await prisma.contact.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Contact not found');

    const updated = await prisma.contact.update({
      where: { id },
      data: {
        firstName: data.firstName !== undefined ? data.firstName : existing.firstName,
        lastName: data.lastName !== undefined ? data.lastName : existing.lastName,
        phone: data.phone !== undefined ? data.phone : existing.phone,
        status: data.status !== undefined ? data.status : existing.status
      }
    });

    return updated;
  },

  async deleteContact(id) {
    return await prisma.contact.delete({
      where: { id }
    });
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

    // Record import job in MySQL
    await prisma.importJob.create({
      data: {
        filename,
        totalRows: items.length,
        importedRows: imported,
        failedRows: failed,
        status: failed === 0 ? 'Completed' : 'Completed with Warnings',
        errorsJson: errors.length > 0 ? { errors: errors.slice(0, 50) } : null
      }
    }).catch(() => {});

    return { imported, failed, total: items.length };
  },

  async exportContactsCsv() {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        tags: { include: { tag: true } }
      }
    });

    const rows = [
      ['Email', 'First Name', 'Last Name', 'Status', 'Tags', 'Created At']
    ];

    for (const c of contacts) {
      rows.push([
        `"${c.email.replace(/"/g, '""')}"`,
        `"${(c.firstName || '').replace(/"/g, '""')}"`,
        `"${(c.lastName || '').replace(/"/g, '""')}"`,
        `"${c.status}"`,
        `"${c.tags.map(t => t.tag.name).join(', ')}"`,
        `"${c.createdAt.toISOString()}"`
      ]);
    }

    return rows.map(r => r.join(',')).join('\n');
  }
};
