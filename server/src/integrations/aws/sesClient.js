import {
  SESClient,
  SendEmailCommand,
  VerifyDomainIdentityCommand,
  VerifyDomainDkimCommand,
  GetIdentityVerificationAttributesCommand,
  GetIdentityDkimAttributesCommand,
  GetSendQuotaCommand
} from '@aws-sdk/client-ses';
import crypto from 'crypto';

const region = process.env.AWS_REGION || 'ap-south-1';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const defaultFromEmail = process.env.SES_DEFAULT_FROM_EMAIL || 'notifications@mail.brainovision.in';

const hasAwsCredentials = Boolean(
  accessKeyId &&
  secretAccessKey &&
  !accessKeyId.includes('placeholder') &&
  !accessKeyId.includes('YOUR_') &&
  accessKeyId !== 'mock'
);

let client = null;
if (hasAwsCredentials) {
  try {
    client = new SESClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    });
  } catch (err) {
    console.error('Failed to initialize AWS SES Client:', err.message);
  }
}

export const sesClient = {
  isConfigured() {
    return Boolean(client);
  },

  getRegion() {
    return region;
  },

  getDefaultFromEmail() {
    return defaultFromEmail;
  },

  /**
   * Transmits an email via Amazon SES SendEmailCommand or safe simulator fallback
   */
  async sendEmail({ to, from = defaultFromEmail, subject, html, text, replyTo, headers = {} }) {
    const toAddresses = Array.isArray(to) ? to : [to];

    if (!client) {
      // Development / sandbox simulation mode when AWS SES credentials are not yet configured
      const simulatedMessageId = `sim-${Date.now()}-${crypto.randomBytes(4).toString('hex')}@ses.brainovision.in`;
      return {
        success: true,
        messageId: simulatedMessageId,
        simulated: true,
        region,
        timestamp: new Date().toISOString()
      };
    }

    const command = new SendEmailCommand({
      Source: from,
      Destination: {
        ToAddresses: toAddresses
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8'
        },
        Body: {
          Html: {
            Data: html,
            Charset: 'UTF-8'
          },
          ...(text ? { Text: { Data: text, Charset: 'UTF-8' } } : {})
        }
      },
      ...(replyTo ? { ReplyToAddresses: Array.isArray(replyTo) ? replyTo : [replyTo] } : {})
    });

    try {
      const response = await client.send(command);
      return {
        success: true,
        messageId: response.MessageId,
        simulated: false,
        region,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Amazon SES Send Error for ${toAddresses.join(', ')}:`, error.message);
      throw error;
    }
  },

  /**
   * Fetches the current AWS SES account send quota
   */
  async getSendQuota() {
    if (!client) {
      return {
        max24HourSend: 50000,
        sentLast24Hours: 0,
        maxSendRate: 14,
        simulated: true
      };
    }

    try {
      const command = new GetSendQuotaCommand({});
      const res = await client.send(command);
      return {
        max24HourSend: res.Max24HourSend || 50000,
        sentLast24Hours: res.SentLast24Hours || 0,
        maxSendRate: res.MaxSendRate || 14,
        simulated: false
      };
    } catch (err) {
      console.error('Failed to fetch SES quota:', err.message);
      return {
        max24HourSend: 50000,
        sentLast24Hours: 0,
        maxSendRate: 14,
        simulated: true,
        error: err.message
      };
    }
  },

  /**
   * Requests DKIM tokens and domain verification attributes from AWS SES
   */
  async verifyDomain(domain) {
    if (!client) {
      return {
        success: true,
        domain,
        verificationToken: `v_token_${crypto.randomBytes(8).toString('hex')}`,
        dkimTokens: [
          `dkim1._domainkey.${domain}`,
          `dkim2._domainkey.${domain}`,
          `dkim3._domainkey.${domain}`
        ],
        simulated: true
      };
    }

    try {
      const verifyCmd = new VerifyDomainIdentityCommand({ Domain: domain });
      const verifyRes = await client.send(verifyCmd);

      const dkimCmd = new VerifyDomainDkimCommand({ Domain: domain });
      const dkimRes = await client.send(dkimCmd);

      return {
        success: true,
        domain,
        verificationToken: verifyRes.VerificationToken,
        dkimTokens: dkimRes.DkimTokens || [],
        simulated: false
      };
    } catch (err) {
      console.error(`AWS SES Domain Verification Error for ${domain}:`, err.message);
      throw err;
    }
  },

  /**
   * Checks current verification status of domain
   */
  async checkDomainStatus(domain) {
    if (!client) {
      return {
        domain,
        status: 'Verified',
        dkimStatus: 'Success',
        simulated: true
      };
    }

    try {
      const verifyAttrCmd = new GetIdentityVerificationAttributesCommand({ Identities: [domain] });
      const dkimAttrCmd = new GetIdentityDkimAttributesCommand({ Identities: [domain] });

      const [verifyRes, dkimRes] = await Promise.all([
        client.send(verifyAttrCmd),
        client.send(dkimAttrCmd)
      ]);

      const verifyStatus = verifyRes.VerificationAttributes?.[domain]?.VerificationStatus || 'Pending';
      const dkimStatus = dkimRes.DkimAttributes?.[domain]?.DkimVerificationStatus || 'Pending';

      return {
        domain,
        status: verifyStatus === 'Success' ? 'Verified' : verifyStatus,
        dkimStatus,
        simulated: false
      };
    } catch (err) {
      console.error(`AWS SES Check Domain Status Error for ${domain}:`, err.message);
      return {
        domain,
        status: 'Pending',
        dkimStatus: 'Pending',
        error: err.message
      };
    }
  }
};
