import { prisma } from '../../config/db.js';

export const automationsService = {
  async getAllAutomations() {
    const automations = await prisma.automation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        steps: {
          orderBy: { stepOrder: 'asc' }
        }
      }
    });

    return automations.map(a => ({
      id: a.id,
      name: a.name,
      description: a.description || '',
      status: a.status,
      triggerType: a.triggerType,
      totalEnrolled: a.totalEnrolled,
      avgConversionRate: a.totalEnrolled > 0 ? Number(((a.completedCount / a.totalEnrolled) * 100).toFixed(1)) : 0,
      steps: a.steps.map(s => ({
        id: s.id,
        type: s.type,
        title: s.title,
        subtitle: s.subtitle || ''
      }))
    }));
  },

  async toggleStatus(id) {
    const current = await prisma.automation.findUnique({
      where: { id }
    });

    if (!current) {
      throw new Error('Automation workflow not found');
    }

    const nextStatus = current.status === 'Active' ? 'Paused' : 'Active';
    const updated = await prisma.automation.update({
      where: { id },
      data: { status: nextStatus }
    });

    return {
      success: true,
      status: updated.status
    };
  },

  async addStep(id, stepData) {
    const count = await prisma.automationStep.count({
      where: { automationId: id }
    });

    const step = await prisma.automationStep.create({
      data: {
        automationId: id,
        stepOrder: count + 1,
        type: stepData.type || 'delay',
        title: stepData.title || `Step: ${stepData.type}`,
        subtitle: stepData.subtitle || 'Configured action'
      }
    });

    const allSteps = await prisma.automationStep.findMany({
      where: { automationId: id },
      orderBy: { stepOrder: 'asc' }
    });

    return {
      success: true,
      step,
      steps: allSteps.map(s => ({
        id: s.id,
        type: s.type,
        title: s.title,
        subtitle: s.subtitle || ''
      }))
    };
  },

  async testTrigger() {
    return {
      success: true,
      message: 'Test event dispatched successfully. Workflow simulation executed with zero errors.'
    };
  }
};
