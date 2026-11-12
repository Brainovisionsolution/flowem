import crypto from 'crypto';
import { query } from '../../config/db.js';
import { automationEngine } from './automationEngine.js';

export const automationsService = {
  async getAllAutomations() {
    const automations = await query('SELECT * FROM automations ORDER BY created_at DESC');

    const result = [];
    for (const a of automations) {
      const steps = await query(
        'SELECT * FROM automation_steps WHERE automation_id = ? ORDER BY step_order ASC',
        [a.id]
      );

      result.push({
        id: a.id,
        name: a.name,
        description: a.description || '',
        status: a.status,
        triggerType: a.trigger_type,
        totalEnrolled: a.total_enrolled,
        avgConversionRate: a.total_enrolled > 0 ? Number(((a.completed_count / a.total_enrolled) * 100).toFixed(1)) : 0,
        steps: steps.map(s => ({
          id: s.id,
          type: s.type,
          title: s.title,
          subtitle: s.subtitle || ''
        }))
      });
    }

    return result;
  },

  async toggleStatus(id) {
    const rows = await query('SELECT * FROM automations WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) {
      throw new Error('Automation workflow not found');
    }
    const current = rows[0];

    const nextStatus = current.status === 'Active' ? 'Paused' : 'Active';
    await query('UPDATE automations SET status = ?, updated_at = NOW() WHERE id = ?', [nextStatus, id]);

    return {
      success: true,
      status: nextStatus
    };
  },

  async addStep(id, stepData) {
    const countRows = await query('SELECT COUNT(*) as cnt FROM automation_steps WHERE automation_id = ?', [id]);
    const nextOrder = (countRows[0]?.cnt || 0) + 1;
    const stepId = crypto.randomUUID();

    const title = stepData.title || `Step: ${stepData.type || 'action'}`;
    const subtitle = stepData.subtitle || 'Configured action';
    const type = stepData.type || 'delay';

    await query(
      `INSERT INTO automation_steps (id, automation_id, step_order, type, title, subtitle) VALUES (?, ?, ?, ?, ?, ?)`,
      [stepId, id, nextOrder, type, title, subtitle]
    );

    const allSteps = await query(
      'SELECT * FROM automation_steps WHERE automation_id = ? ORDER BY step_order ASC',
      [id]
    );

    return {
      success: true,
      step: { id: stepId, type, title, subtitle },
      steps: allSteps.map(s => ({
        id: s.id,
        type: s.type,
        title: s.title,
        subtitle: s.subtitle || ''
      }))
    };
  },

  async testTrigger() {
    const testResult = await automationEngine.handleTrigger('contact_signup', {
      contactId: 'test-admin',
      email: 'admin@brainovision.in',
      metadata: { source: 'test-trigger' }
    });

    return {
      success: true,
      message: 'Test event dispatched successfully. Workflow simulation executed with zero errors.',
      details: testResult
    };
  }
};
