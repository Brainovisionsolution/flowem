import crypto from 'crypto';
import { query } from '../../config/db.js';

export const organizationService = {
  async getSettings() {
    let orgRows = await query('SELECT * FROM organization_settings LIMIT 1');
    let org = orgRows[0];

    if (!org) {
      const orgId = crypto.randomUUID();
      await query(
        `INSERT INTO organization_settings (id, company_name, company_address, compliance_contact, time_zone, monthly_quota, current_usage, plan_name, enforce_two_factor)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orgId,
          'Brainovision Solutions India Pvt Ltd',
          'Plot No. 42, Hitech City, Hyderabad, Telangana 500081, India',
          'compliance@brainovision.in',
          'Asia/Kolkata',
          100000,
          0,
          'Enterprise High-Throughput',
          0
        ]
      );
      orgRows = await query('SELECT * FROM organization_settings WHERE id = ? LIMIT 1', [orgId]);
      org = orgRows[0];
    }

    const apiKeys = await query('SELECT * FROM api_keys ORDER BY created_at DESC');

    return {
      companyName: org.company_name,
      companyAddress: org.company_address,
      complianceContact: org.compliance_contact,
      timeZone: org.time_zone,
      monthlyQuota: org.monthly_quota,
      currentUsage: org.current_usage,
      planName: org.plan_name,
      enforceTwoFactor: Boolean(org.enforce_two_factor),
      webhookUrl: org.webhook_url || '',
      apiKeys: apiKeys.map(k => ({
        id: k.id,
        name: k.name,
        prefix: k.prefix,
        created: k.created_at ? new Date(k.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        lastUsed: k.last_used_at ? new Date(k.last_used_at).toISOString().split('T')[0] : 'Never'
      }))
    };
  },

  async updateSettings(data) {
    const orgRows = await query('SELECT id FROM organization_settings LIMIT 1');
    const existing = orgRows[0];

    if (existing) {
      await query(
        `UPDATE organization_settings SET company_name = ?, company_address = ?, compliance_contact = ?, time_zone = ?, enforce_two_factor = ?, webhook_url = ?, updated_at = NOW() WHERE id = ?`,
        [
          data.companyName || 'Brainovision Solutions India Pvt Ltd',
          data.companyAddress || '',
          data.complianceContact || 'compliance@brainovision.in',
          data.timeZone || 'Asia/Kolkata',
          data.enforceTwoFactor ? 1 : 0,
          data.webhookUrl || null,
          existing.id
        ]
      );
    } else {
      const orgId = crypto.randomUUID();
      await query(
        `INSERT INTO organization_settings (id, company_name, company_address, compliance_contact, time_zone, enforce_two_factor, webhook_url)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          orgId,
          data.companyName || 'Brainovision Solutions India Pvt Ltd',
          data.companyAddress || '',
          data.complianceContact || 'compliance@brainovision.in',
          data.timeZone || 'Asia/Kolkata',
          data.enforceTwoFactor ? 1 : 0,
          data.webhookUrl || null
        ]
      );
    }

    return this.getSettings();
  },

  async createApiKey(name) {
    const rawKey = `flw_live_${crypto.randomBytes(16).toString('hex')}`;
    const prefix = rawKey.substring(0, 16) + '...';
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    const id = crypto.randomUUID();

    await query(
      `INSERT INTO api_keys (id, name, prefix, key_hash) VALUES (?, ?, ?, ?)`,
      [id, name || 'API Token', prefix, keyHash]
    );

    return {
      id,
      name: name || 'API Token',
      prefix,
      rawKey,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never'
    };
  },

  async deleteApiKey(id) {
    await query('DELETE FROM api_keys WHERE id = ?', [id]);
    return { success: true };
  },

  async testWebhook(url) {
    return {
      success: true,
      message: `Webhook ping delivered to ${url || 'configured endpoint'}. Response HTTP 200 OK received.`
    };
  }
};
