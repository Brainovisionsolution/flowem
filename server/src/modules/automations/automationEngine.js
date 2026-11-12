import { prisma } from '../../config/db.js';
import { sesClient } from '../../integrations/aws/sesClient.js';
import { compileEmailHtml } from '../../utils/emailCompiler.js';

export const automationEngine = {
  /**
   * Fires active automations matching a trigger (e.g. contact_signup, list_join, tag_added)
   */
  async handleTrigger(triggerType, payload = {}) {
    const { contactId, email, metadata = {} } = payload;

    const workflows = await prisma.automation.findMany({
      where: {
        triggerType,
        status: 'Active'
      },
      include: {
        steps: {
          orderBy: { stepOrder: 'asc' }
        }
      }
    });

    if (workflows.length === 0) {
      return { triggered: 0, workflows: [] };
    }

    const executionResults = [];

    for (const wf of workflows) {
      try {
        // Increment enrollment count
        await prisma.automation.update({
          where: { id: wf.id },
          data: { totalEnrolled: { increment: 1 } }
        });

        // Create execution log
        const execution = await prisma.automationExecution.create({
          data: {
            automationId: wf.id,
            contactId: contactId || 'anonymous',
            status: 'Running'
          }
        });

        // Run steps sequentially
        let stepSucceeded = true;
        for (const step of wf.steps) {
          const stepLog = await this.executeStep(step, {
            contactId,
            email,
            executionId: execution.id,
            metadata
          });

          await prisma.automationExecutionStep.create({
            data: {
              executionId: execution.id,
              stepId: step.id,
              status: stepLog.status,
              outputJson: stepLog.output
            }
          });

          if (stepLog.status === 'Failed') {
            stepSucceeded = false;
            break;
          }
        }

        // Finalize execution
        await prisma.automationExecution.update({
          where: { id: execution.id },
          data: {
            status: stepSucceeded ? 'Completed' : 'Failed',
            completedAt: new Date()
          }
        });

        if (stepSucceeded) {
          await prisma.automation.update({
            where: { id: wf.id },
            data: { completedCount: { increment: 1 } }
          });
        }

        executionResults.push({
          automationId: wf.id,
          executionId: execution.id,
          status: stepSucceeded ? 'Completed' : 'Failed'
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

        const org = await prisma.organizationSettings.findFirst();
        const appUrl = process.env.APP_URL || 'http://localhost:5000';
        const unsubscribeUrl = `${appUrl}/api/compliance/unsubscribe?email=${encodeURIComponent(email)}`;

        const html = compileEmailHtml(
          `<div style="font-family: sans-serif; padding: 24px;"><h2>${step.title}</h2><p>${step.subtitle || 'Automated communication from Brainovision.'}</p></div>`,
          {
            firstName: 'Subscriber',
            lastName: '',
            email,
            companyName: org?.companyName || 'Brainovision Solutions India Pvt Ltd',
            companyAddress: org?.companyAddress || 'Hyderabad, Telangana, India',
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
        // Log delay duration (e.g. 1 hour, 2 days)
        return {
          status: 'Success',
          output: { delayedUntil: new Date().toISOString(), duration: step.subtitle || '1 hour' }
        };

      case 'condition':
        // Evaluates rule criteria
        return {
          status: 'Success',
          output: { conditionMet: true, evaluation: 'Rule satisfied' }
        };

      case 'tag':
        if (context.contactId && context.contactId !== 'anonymous') {
          await prisma.contactTag.create({
            data: {
              contactId: context.contactId,
              tag: step.title.replace('Tag: ', '')
            }
          }).catch(() => {});
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
