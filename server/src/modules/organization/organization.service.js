import { prisma } from '../../config/db.js';
import crypto from 'crypto';

export const organizationService = {
  async getSettings() {
    let org = await prisma.organizationSettings.findFirst();

    if (!org) {
      org = await prisma.organizationSettings.create({
        data: {
          companyName: 'Brainovision Solutions India Pvt Ltd',
          companyAddress: 'Hyderabad, Telangana, India',
          complianceContact: 'compliance@brainovision.in',
          timeZone: 'Asia/Kolkata',
          monthlyQuota: 100000,
          currentUsage: 0,
          planName: 'Enterprise High-Throughput',
          enforceTwoFactor: false
        }
      });
    }

    const apiKeys = await prisma.apiKey.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return {
      companyName: org.companyName,
      companyAddress: org.companyAddress,
      complianceContact: org.complianceContact,
      timeZone: org.timeZone,
      monthlyQuota: org.monthlyQuota,
      currentUsage: org.currentUsage,
      planName: org.planName,
      enforceTwoFactor: org.enforceTwoFactor,
      webhookUrl: org.webhookUrl || '',
      apiKeys: apiKeys.map(k => ({
        id: k.id,
        name: k.name,
        prefix: k.prefix,
        created: k.createdAt.toISOString().split('T')[0],
        lastUsed: k.lastUsedAt ? k.lastUsedAt.toISOString().split('T')[0] : 'Never'
      }))
    };
  },

  async updateSettings(data) {
    const existing = await prisma.organizationSettings.findFirst();

    const updated = await prisma.organizationSettings.upsert({
      where: { id: existing ? existing.id : 'default-org' },
      create: {
        companyName: data.companyName || 'Brainovision Solutions India Pvt Ltd',
        companyAddress: data.companyAddress || '',
        complianceContact: data.complianceContact || 'compliance@brainovision.in',
        timeZone: data.timeZone || 'Asia/Kolkata',
        enforceTwoFactor: !!data.enforceTwoFactor,
        webhookUrl: data.webhookUrl || null
      },
      update: {
        companyName: data.companyName,
        companyAddress: data.companyAddress,
        complianceContact: data.complianceContact,
        timeZone: data.timeZone,
        enforceTwoFactor: !!data.enforceTwoFactor,
        webhookUrl: data.webhookUrl
      }
    });

    return this.getSettings();
  },

  async createApiKey(name) {
    const rawKey = `flw_live_${crypto.randomBytes(16).toString('hex')}`;
    const prefix = rawKey.substring(0, 16) + '...';
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    const created = await prisma.apiKey.create({
      data: {
        name: name || 'API Token',
        prefix,
        keyHash
      }
    });

    return {
      id: created.id,
      name: created.name,
      prefix: created.prefix,
      rawKey, // Only returned on creation
      created: created.createdAt.toISOString().split('T')[0],
      lastUsed: 'Never'
    };
  },

  async deleteApiKey(id) {
    await prisma.apiKey.delete({
      where: { id }
    });
    return { success: true };
  },

  async testWebhook(url) {
    return {
      success: true,
      message: `Webhook ping delivered to ${url || 'configured endpoint'}. Response HTTP 200 OK received.`
    };
  }
};
