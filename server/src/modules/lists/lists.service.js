import crypto from 'crypto';
import { query } from '../../config/db.js';

export const listsService = {
  async getAllLists() {
    const lists = await query(`
      SELECT cl.*, COUNT(clm.contact_id) as member_count
      FROM contact_lists cl
      LEFT JOIN contact_list_members clm ON cl.id = clm.list_id
      GROUP BY cl.id
      ORDER BY cl.created_at DESC
    `);

    return lists.map(l => ({
      id: l.id,
      name: l.name,
      description: l.description || '',
      contactCount: Number(l.member_count) || 0,
      type: l.type,
      activeSubscribers: Number(l.member_count) || 0,
      avgOpenRate: 0,
      createdAt: l.created_at ? new Date(l.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      updatedAt: 'Recently',
      tags: ['Audience']
    }));
  },

  async createList(data) {
    const listId = crypto.randomUUID();
    await query(
      `INSERT INTO contact_lists (id, name, description, type) VALUES (?, ?, ?, ?)`,
      [listId, data.name, data.description || '', data.type || 'Static']
    );

    return {
      id: listId,
      name: data.name,
      description: data.description || '',
      contactCount: 0,
      type: data.type || 'Static',
      activeSubscribers: 0,
      avgOpenRate: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: 'Just now',
      tags: data.tags || ['Audience']
    };
  },

  async cleanList(id) {
    // Remove suppressed or bounced contacts from this list in MySQL
    const deleteRes = await query(`
      DELETE clm FROM contact_list_members clm
      INNER JOIN contacts c ON clm.contact_id = c.id
      INNER JOIN suppressions s ON c.email = s.email
      WHERE clm.list_id = ?
    `, [id]);

    const countRows = await query('SELECT COUNT(*) as member_count FROM contact_list_members WHERE list_id = ?', [id]);
    const memberCount = countRows[0]?.member_count || 0;

    const listRows = await query('SELECT * FROM contact_lists WHERE id = ? LIMIT 1', [id]);
    const list = listRows[0];

    return {
      success: true,
      removed: deleteRes.affectedRows || 0,
      list: list ? {
        id: list.id,
        name: list.name,
        description: list.description || '',
        contactCount: Number(memberCount),
        type: list.type,
        activeSubscribers: Number(memberCount),
        avgOpenRate: 0,
        createdAt: new Date(list.created_at).toISOString().split('T')[0],
        updatedAt: 'Just now',
        tags: ['Audience']
      } : null
    };
  }
};
