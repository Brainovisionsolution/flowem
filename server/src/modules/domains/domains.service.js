import { prisma } from '../../config/db.js';

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
      reputationScore: d.reputationScore
    }));
  },

  async createDomain(data) {
    const domainName = data.domain || 'brainovision.in';
    const sub = data.subdomain || `mail.${domainName}`;

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
      reputationScore: domain.reputationScore
    };
  },

  async verifyDomain(id) {
    const domain = await prisma.senderDomain.update({
      where: { id },
      data: {
        status: 'Verified',
        spfStatus: 'Valid',
        dkimStatus: 'Valid',
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
  }
};
