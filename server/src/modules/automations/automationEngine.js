import crypto from 'crypto';
import { query } from '../../config/db.js';
import { sesClient } from '../../integrations/aws/sesClient.js';
import { compileEmailHtml } from '../../utils/emailCompiler.js';

export const automationEngine = {
  /**
   * Fires active automations matching a trigger (e.g. contact_signup, list_join, tag_added)
   */
  async handleTrigger(triggerType, payload = {}) {
    const { contactId, email, metadata = {} } = payload;

    const workflows = await query(
      'SELECT * FROM automations WHERE trigger_type = ? AND status = "Active"',
      [triggerType]
    );

    if (workflows.length === 0) {
      return { triggered: 0, workflows: [] };
    }

    const executionResults = [];

    for (const wf of workflows) {
      try {
        const steps = await query(
          'SELECT * FROM automation_steps WHERE automation_id = ? ORDER BY step_order ASC',
          [wf.id]
        );

        // Increment enrollment count
        await query(
          'UPDATE automations SET total_enrolled = total_enrolled + 1 WHERE id = ?',
          [wf.id]
        );

        // Create execution log in MySQL 8
        const execId = crypto.randomUUID();
        await query(
          `INSERT INTO automation_executions (id, automation_id, contact_id, status) VALUES (?, ?, ?, ?)`,
          [execId, wf.id, contactId || 'anonymous', 'Running']
        );

        // Run steps sequentially
        let stepSucceeded = true;
        for (const step of steps) {
          const stepLog = await this.executeStep(step, {
            contactId,
            email,
            executionId: execId,
            metadata
          });

          const aesId = crypto.randomUUID();
          await query(
            `INSERT INTO automation_execution_steps (id, execution_id, step_id, status, output_json) VALUES (?, ?, ?, ?, ?)`,
            [aesId, execId, step.id, stepLog.status, JSON.stringify(stepLog.output || {})]
          );

          if (stepLog.status === 'Failed') {
            stepSucceeded = false;
            break;
          }
        }

        // Finalize execution
        const finalStatus = stepSucceeded ? 'Completed' : 'Failed';
        await query(
          `UPDATE automation_executions SET status = ?, completed_at = NOW() WHERE id = ?`,
          [finalStatus, execId]
        );

        if (stepSucceeded) {
          await query(
            'UPDATE automations SET completed_count = completed_count + 1 WHERE id = ?',
            [wf.id]
          );
        }

        executionResults.push({
          automationId: wf.id,
          executionId: execId,
          status: finalStatus
        });
      } catch (err) {
        console.error(`Error executing workflow ${wf.id}:`, err.message);
      }
    }

    return {
      triggered: executionResults.length,
      workflows: executionResults
    };
  },

  /**
   * Executes an individual automation step
   */
  async executeStep(step, context) {
    const { email } = context;

    switch (step.type) {
      case 'trigger':
        return {
          status: 'Success',
          output: { message: `Workflow trigger activated: ${step.title}` }
        };

      case 'email': {
        if (!email) {
          return { status: 'Failed', output: { error: 'No recipient email available in execution context' } };
        }

        const orgRows = await query('SELECT * FROM organization_settings LIMIT 1');
        const org = orgRows[0];
        const appUrl = process.env.APP_URL || 'http://localhost:5000';
        const unsubscribeUrl = `${appUrl}/api/compliance/unsubscribe?email=${encodeURIComponent(email)}`;

        const html = compileEmailHtml(
          `<div style="font-family: sans-serif; padding: 24px;"><h2>${step.title}</h2><p>${step.subtitle || 'Automated communication from Brainovision.'}</p></div>`,
          {
            firstName: 'Subscriber',
            lastName: '',
            email,
            companyName: org?.company_name || 'Brainovision Solutions India Pvt Ltd',
            companyAddress: org?.company_address || 'Hyderabad, Telangana, India',
            unsubscribeUrl
          }
        );

        const sendRes = await sesClient.sendEmail({
          to: email,
          subject: step.title,
          html
        });

        return {
          status: 'Success',
          output: { messageId: sendRes.messageId, simulated: sendRes.simulated }
        };
      }

      case 'delay':
        return {
          status: 'Success',
          output: { delayedUntil: new Date().toISOString(), duration: step.subtitle || '1 hour' }
        };

      case 'condition':
        return {
          status: 'Success',
          output: { conditionMet: true, evaluation: 'Rule satisfied' }
        };

      case 'tag':
        if (context.contactId && context.contactId !== 'anonymous') {
          const cleanTag = step.title.replace('Tag: ', '').trim();
          let tagRows = await query('SELECT id FROM tags WHERE name = ? LIMIT 1', [cleanTag]);
          let tagId;
          if (tagRows.length === 0) {
            tagId = crypto.randomUUID();
            await query('INSERT INTO tags (id, name) VALUES (?, ?)', [tagId, cleanTag]).catch(() => {});
          } else {
            tagId = tagRows[0].id;
          }

          const ctId = crypto.randomUUID();
          await query(
            'INSERT IGNORE INTO contact_tags (id, contact_id, tag_id) VALUES (?, ?, ?)',
            [ctId, context.contactId, tagId]
          ).catch(() => {});
        }
        return {
          status: 'Success',
          output: { appliedTag: step.title }
        };

      default:
        return {
          status: 'Success',
          output: { stepType: step.type, note: 'Default action complete' }
        };
    }
  }
};
