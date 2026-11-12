import { prisma } from '../../config/db.js';
import { sesClient } from '../../integrations/aws/sesClient.js';

export const domainsService = {
  async getAllDomains() {
    const domains = await prisma.senderDomain.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return domains.map(d => ({
      id: d.id,
      domain: d.domain,
      subdomain: d.subdomain,
      status: d.status,
      spfStatus: d.spfStatus,
      dkimStatus: d.dkimStatus,
      dmarcStatus: d.dmarcStatus,
      warmupStage: d.warmupStage,
      dailyQuotaLimit: d.dailyQuotaLimit,
      dailySentCount: d.dailySentCount,
      reputationScore: d.reputationScore,
      dnsRecords: [
        { type: 'TXT', host: d.domain, value: 'v=spf1 include:amazonses.com ~all', status: d.spfStatus },
        { type: 'CNAME', host: `ses._domainkey.${d.domain}`, value: `${d.subdomain || d.domain}.dkim.amazonses.com`, status: d.dkimStatus },
        { type: 'TXT', host: `_dmarc.${d.domain}`, value: `v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc-reports@${d.domain}`, status: d.dmarcStatus },
        { type: 'MX', host: d.subdomain || d.domain, value: `10 feedback-smtp.${sesClient.getRegion()}.amazonses.com`, status: 'Valid' }
      ]
    }));
  },

  async createDomain(data) {
    const domainName = (data.domain || 'brainovision.in').trim().toLowerCase();
    const sub = (data.subdomain || `mail.${domainName}`).trim().toLowerCase();

    // Call SES identity registration
    const sesResult = await sesClient.verifyDomain(domainName);

    const domain = await prisma.senderDomain.create({
      data: {
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
        verifiedAt: new Date()
      }
    });

    return {
      id: domain.id,
      domain: domain.domain,
      subdomain: domain.subdomain,
      status: domain.status,
      spfStatus: domain.spfStatus,
      dkimStatus: domain.dkimStatus,
      dmarcStatus: domain.dmarcStatus,
      warmupStage: domain.warmupStage,
      dailyQuotaLimit: domain.dailyQuotaLimit,
      dailySentCount: domain.dailySentCount,
      reputationScore: domain.reputationScore,
      sesDetails: sesResult
    };
  },

  async verifyDomain(id) {
    const existing = await prisma.senderDomain.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Sender domain not found');
    }

    const sesStatus = await sesClient.checkDomainStatus(existing.domain);

    const domain = await prisma.senderDomain.update({
      where: { id },
      data: {
        status: sesStatus.status || 'Verified',
        spfStatus: 'Valid',
        dkimStatus: sesStatus.dkimStatus === 'Failed' ? 'Failed' : 'Valid',
        dmarcStatus: 'Valid',
        verifiedAt: new Date()
      }
    });

    return {
      success: true,
      domain: {
        id: domain.id,
        domain: domain.domain,
        subdomain: domain.subdomain,
        status: domain.status,
        spfStatus: domain.spfStatus,
        dkimStatus: domain.dkimStatus,
        dmarcStatus: domain.dmarcStatus,
        warmupStage: domain.warmupStage,
        dailyQuotaLimit: domain.dailyQuotaLimit,
        dailySentCount: domain.dailySentCount,
        reputationScore: domain.reputationScore
      }
    };
  },

  async getSendQuota() {
    return sesClient.getSendQuota();
  }
};
