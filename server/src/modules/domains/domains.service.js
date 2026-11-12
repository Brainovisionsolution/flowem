import crypto from 'crypto';
import { query } from '../../config/db.js';
import { sesClient } from '../../integrations/aws/sesClient.js';

export const domainsService = {
  async getAllDomains() {
    const domains = await query('SELECT * FROM sender_domains ORDER BY created_at DESC');

    return domains.map(d => ({
      id: d.id,
      domain: d.domain,
      subdomain: d.subdomain,
      status: d.status,
      spfStatus: d.spf_status,
      dkimStatus: d.dkim_status,
      dmarcStatus: d.dmarc_status,
      warmupStage: d.warmup_stage,
      dailyQuotaLimit: d.daily_quota_limit,
      dailySentCount: d.daily_sent_count,
      reputationScore: d.reputation_score,
      dnsRecords: [
        { type: 'TXT', host: d.domain, value: 'v=spf1 include:amazonses.com ~all', status: d.spf_status },
        { type: 'CNAME', host: `ses._domainkey.${d.domain}`, value: `${d.subdomain || d.domain}.dkim.amazonses.com`, status: d.dkim_status },
        { type: 'TXT', host: `_dmarc.${d.domain}`, value: `v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc-reports@${d.domain}`, status: d.dmarc_status },
        { type: 'MX', host: d.subdomain || d.domain, value: `10 feedback-smtp.${sesClient.getRegion()}.amazonses.com`, status: 'Valid' }
      ]
    }));
  },

  async createDomain(data) {
    const domainName = (data.domain || 'brainovision.in').trim().toLowerCase();
    const sub = (data.subdomain || `mail.${domainName}`).trim().toLowerCase();
    const id = crypto.randomUUID();

    const sesResult = await sesClient.verifyDomain(domainName);

    await query(
      `INSERT INTO sender_domains (
        id, domain, subdomain, status, spf_status, dkim_status, dmarc_status,
        warmup_stage, daily_quota_limit, daily_sent_count, reputation_score, verified_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        id,
        domainName,
        sub,
        'Verified',
        'Valid',
        'Valid',
        'Valid',
        'Stage 1 (Initial Warmup)',
        500,
        0,
        100
      ]
    );

    return {
      id,
      domain: domainName,
      subdomain: sub,
      status: 'Verified',
      spfStatus: 'Valid',
      dkimStatus: 'Valid',
      dmarcStatus: 'Valid',
      warmupStage: 'Stage 1 (Initial Warmup)',
      dailyQuotaLimit: 500,
      dailySentCount: 0,
      reputationScore: 100,
      sesDetails: sesResult
    };
  },

  async verifyDomain(id) {
    const rows = await query('SELECT * FROM sender_domains WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) {
      throw new Error('Sender domain not found');
    }
    const existing = rows[0];

    const sesStatus = await sesClient.checkDomainStatus(existing.domain);
    const status = sesStatus.status || 'Verified';
    const dkimStatus = sesStatus.dkimStatus === 'Failed' ? 'Failed' : 'Valid';

    await query(
      `UPDATE sender_domains SET status = ?, spf_status = 'Valid', dkim_status = ?, dmarc_status = 'Valid', verified_at = NOW(), updated_at = NOW() WHERE id = ?`,
      [status, dkimStatus, id]
    );

    return {
      success: true,
      domain: {
        id: existing.id,
        domain: existing.domain,
        subdomain: existing.subdomain,
        status,
        spfStatus: 'Valid',
        dkimStatus,
        dmarcStatus: 'Valid',
        warmupStage: existing.warmup_stage,
        dailyQuotaLimit: existing.daily_quota_limit,
        dailySentCount: existing.daily_sent_count,
        reputationScore: existing.reputation_score
      }
    };
  },

  async getSendQuota() {
    return sesClient.getSendQuota();
  }
};
