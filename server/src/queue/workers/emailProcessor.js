import { prisma } from '../../config/db.js';
import { sesClient } from '../../integrations/aws/sesClient.js';
import { compileEmailHtml } from '../../utils/emailCompiler.js';

/**
 * Core email processing unit executed for each queued recipient
 */
export async function processEmailRecipient(data) {
  const { campaignId, recipientId, email, firstName, lastName, subject, templateHtml, fromEmail, fromName, replyTo } = data;

  // 1. Pre-send suppression verification
  const suppression = await prisma.suppression.findUnique({
    where: { email }
  });

  if (suppression) {
    if (recipientId) {
      await prisma.campaignRecipient.update({
        where: { id: recipientId },
        data: {
          status: 'Bounced',
          errorMessage: `Pre-send suppression rule active: ${suppression.reason}`
        }
      }).catch(() => {});
    }

    if (campaignId) {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { bouncedCount: { increment: 1 } }
      }).catch(() => {});
      await checkAndFinalizeCampaign(campaignId);
    }

    return { success: false, suppressed: true, reason: suppression.reason };
  }

  // 2. Check contact consent & unsubscribed status
  const contact = await prisma.contact.findUnique({
    where: { email }
  });

  if (contact && (contact.status === 'Unsubscribed' || contact.status === 'Complained')) {
    if (recipientId) {
      await prisma.campaignRecipient.update({
        where: { id: recipientId },
        data: {
          status: 'Bounced',
          errorMessage: `Recipient marked as ${contact.status}`
        }
      }).catch(() => {});
    }

    if (campaignId) {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { bouncedCount: { increment: 1 } }
      }).catch(() => {});
      await checkAndFinalizeCampaign(campaignId);
    }

    return { success: false, unsubscribed: true };
  }

  // 3. Organization & postal compliance details
  const org = await prisma.organizationSettings.findFirst();
  const companyName = org?.companyName || 'Brainovision Solutions India Pvt Ltd';
  const companyAddress = org?.companyAddress || 'Hyderabad, Telangana, India';
  const baseUrl = process.env.BASE_URL || process.env.APP_URL || 'http://localhost:5000';
  const unsubscribeUrl = `${baseUrl}/api/compliance/unsubscribe?email=${encodeURIComponent(email)}&campaignId=${campaignId || ''}`;

  // 4. HTML Personalization & Trackers
  const compiledHtml = compileEmailHtml(templateHtml || '<p>Hello {{firstName}},</p>', {
    firstName: firstName || 'Valued',
    lastName: lastName || 'Customer',
    email,
    companyName,
    companyAddress,
    unsubscribeUrl,
    tracking: {
      campaignId: campaignId || 'direct',
      recipientId: recipientId || 'direct',
      baseUrl
    }
  });

  const senderAddress = fromEmail || sesClient.getDefaultFromEmail();
  const formattedFrom = fromName ? `"${fromName}" <${senderAddress}>` : senderAddress;

  try {
    // 5. AWS SES Transmission
    const sesResult = await sesClient.sendEmail({
      to: email,
      from: formattedFrom,
      subject: subject || 'Notice from Brainovision',
      html: compiledHtml,
      replyTo: replyTo || undefined
    });

    // 6. Update recipient status in MySQL
    if (recipientId) {
      await prisma.campaignRecipient.update({
        where: { id: recipientId },
        data: {
          status: 'Sent',
          sesMessageId: sesResult.messageId,
          sentAt: new Date()
        }
      });
    }

    // 7. Record Sent EmailEvent
    await prisma.emailEvent.create({
      data: {
        messageId: sesResult.messageId,
        campaignId: campaignId || null,
        contactId: contact?.id || null,
        eventType: 'Sent',
        recipientEmail: email,
        rawPayload: { simulated: sesResult.simulated, region: sesResult.region }
      }
    });

    // 8. Update campaign metrics
    if (campaignId) {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          sentCount: { increment: 1 },
          deliveredCount: { increment: 1 } // SES initial handoff
        }
      });
      await checkAndFinalizeCampaign(campaignId);
    }

    // 9. Update organization usage and domain quota
    await prisma.organizationSettings.updateMany({
      data: { currentUsage: { increment: 1 } }
    }).catch(() => {});

    return {
      success: true,
      messageId: sesResult.messageId,
      simulated: sesResult.simulated
    };
  } catch (error) {
    console.error(`Email transmission failed for ${email}:`, error.message);

    if (recipientId) {
      await prisma.campaignRecipient.update({
        where: { id: recipientId },
        data: {
          status: 'Failed',
          errorMessage: error.message
        }
      }).catch(() => {});
    }

    if (campaignId) {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { bouncedCount: { increment: 1 } }
      }).catch(() => {});
      await checkAndFinalizeCampaign(campaignId);
    }

    throw error;
  }
}

/**
 * Checks if all recipients for a campaign have completed and marks the campaign status
 */
async function checkAndFinalizeCampaign(campaignId) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        _count: {
          select: {
            recipients: true
          }
        }
      }
    });

    if (!campaign) return;

    const remaining = await prisma.campaignRecipient.count({
      where: {
        campaignId,
        status: { in: ['Pending', 'Queued'] }
      }
    });

    if (remaining === 0) {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          status: 'Completed',
          completedAt: new Date()
        }
      });
    }
  } catch (err) {
    console.error(`Failed to evaluate campaign completion for ${campaignId}:`, err.message);
  }
}
