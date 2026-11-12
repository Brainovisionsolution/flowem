import { prisma } from '../../config/db.js';

export const suppressionsService = {
  async getAllSuppressions() {
    const records = await prisma.suppression.findMany({
      orderBy: { suppressedAt: 'desc' }
    });

    return records.map(r => ({
      id: r.id,
      email: r.email,
      reason: r.reason,
      sourceCampaign: r.sourceCampaign || 'Manual Entry',
      suppressedAt: r.suppressedAt.toISOString().split('T')[0],
      notes: r.notes || ''
    }));
  },

  async addSuppression(data) {
    const record = await prisma.suppression.upsert({
      where: { email: data.email },
      create: {
        email: data.email,
        reason: data.reason || 'Manual Policy',
        sourceCampaign: data.sourceCampaign || 'Manual Entry',
        notes: data.notes || 'Added via dashboard compliance tool'
      },
      update: {
        reason: data.reason || 'Manual Policy',
        notes: data.notes || 'Updated via dashboard compliance tool'
      }
    });

    return {
      id: record.id,
      email: record.email,
      reason: record.reason,
      sourceCampaign: record.sourceCampaign,
      suppressedAt: record.suppressedAt.toISOString().split('T')[0],
      notes: record.notes
    };
  },

  async removeSuppression(id) {
    await prisma.suppression.delete({
      where: { id }
    });
    return { success: true };
  }
};

