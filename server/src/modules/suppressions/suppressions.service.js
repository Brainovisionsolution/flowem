import crypto from 'crypto';
import { query } from '../../config/db.js';

export const suppressionsService = {
  async getAllSuppressions() {
    const records = await query('SELECT * FROM suppressions ORDER BY suppressed_at DESC');

    return records.map(r => ({
      id: r.id,
      email: r.email,
      reason: r.reason,
      sourceCampaign: r.source_campaign || 'Manual Entry',
      suppressedAt: r.suppressed_at ? new Date(r.suppressed_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      notes: r.notes || ''
    }));
  },

  async addSuppression(data) {
    const email = (data.email || '').trim().toLowerCase();
    const reason = data.reason || 'Manual Policy';
    const sourceCampaign = data.sourceCampaign || 'Manual Entry';
    const notes = data.notes || 'Added via dashboard compliance tool';
    const id = crypto.randomUUID();

    await query(
      `INSERT INTO suppressions (id, email, reason, source_campaign, notes)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE reason = VALUES(reason), notes = VALUES(notes), suppressed_at = NOW()`,
      [id, email, reason, sourceCampaign, notes]
    );

    const rows = await query('SELECT * FROM suppressions WHERE email = ? LIMIT 1', [email]);
    const record = rows[0];

    return {
      id: record.id,
      email: record.email,
      reason: record.reason,
      sourceCampaign: record.source_campaign,
      suppressedAt: new Date(record.suppressed_at).toISOString().split('T')[0],
      notes: record.notes
    };
  },

  async removeSuppression(id) {
    await query('DELETE FROM suppressions WHERE id = ?', [id]);
    return { success: true };
  }
};
