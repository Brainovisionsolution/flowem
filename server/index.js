import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default data with simple English words (strictly NO emojis)
const defaultData = {
  contacts: [
    {
      id: 'ct-101',
      email: 'sarah.jenkins@company.com',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      status: 'Subscribed',
      lists: ['New Customers', 'Monthly Newsletter'],
      engagementScore: 94,
      lastSentAt: '2026-11-10 14:22',
      createdAt: '2026-08-14',
      deliveriesCount: 42,
      opensCount: 39,
      clicksCount: 18,
      tags: ['Customer', 'Active Buyer']
    },
    {
      id: 'ct-102',
      email: 'marcus.vance@techcorp.com',
      firstName: 'Marcus',
      lastName: 'Vance',
      status: 'Subscribed',
      lists: ['New Customers', 'Product News'],
      engagementScore: 88,
      lastSentAt: '2026-11-11 09:15',
      createdAt: '2026-07-20',
      deliveriesCount: 35,
      opensCount: 31,
      clicksCount: 12,
      tags: ['Verified', 'High Priority']
    },
    {
      id: 'ct-103',
      email: 'elena.rostova@finance-group.eu',
      firstName: 'Elena',
      lastName: 'Rostova',
      status: 'Subscribed',
      lists: ['Monthly Newsletter'],
      engagementScore: 96,
      lastSentAt: '2026-11-12 08:30',
      createdAt: '2026-05-11',
      deliveriesCount: 58,
      opensCount: 56,
      clicksCount: 29,
      tags: ['Manager', 'EU Customer']
    },
    {
      id: 'ct-104',
      email: 'david.kim@robotics-labs.org',
      firstName: 'David',
      lastName: 'Kim',
      status: 'Subscribed',
      lists: ['Product News'],
      engagementScore: 72,
      lastSentAt: '2026-11-09 11:40',
      createdAt: '2026-09-02',
      deliveriesCount: 22,
      opensCount: 16,
      clicksCount: 5,
      tags: ['Engineering']
    },
    {
      id: 'ct-105',
      email: 'amara.okafor@african-ventures.co',
      firstName: 'Amara',
      lastName: 'Okafor',
      status: 'Subscribed',
      lists: ['Investors', 'New Customers'],
      engagementScore: 91,
      lastSentAt: '2026-11-10 16:50',
      createdAt: '2026-04-19',
      deliveriesCount: 64,
      opensCount: 59,
      clicksCount: 24,
      tags: ['Partner', 'VIP']
    },
    {
      id: 'ct-106',
      email: 'richard.b@old-inbox-closed.net',
      firstName: 'Richard',
      lastName: 'Benson',
      status: 'Bounced',
      lists: ['Old Contacts 2025'],
      engagementScore: 8,
      lastSentAt: '2026-11-01 10:11',
      createdAt: '2026-01-10',
      deliveriesCount: 3,
      opensCount: 0,
      clicksCount: 0,
      tags: ['Bounced Email', 'Wrong Address']
    },
    {
      id: 'ct-107',
      email: 'claire.morin@nordic-telecom.se',
      firstName: 'Claire',
      lastName: 'Morin',
      status: 'Subscribed',
      lists: ['Product News'],
      engagementScore: 82,
      lastSentAt: '2026-11-11 18:02',
      createdAt: '2026-06-30',
      deliveriesCount: 39,
      opensCount: 32,
      clicksCount: 14,
      tags: ['Europe']
    },
    {
      id: 'ct-108',
      email: 'unsub.test@sample-box.com',
      firstName: 'Thomas',
      lastName: 'Wright',
      status: 'Unsubscribed',
      lists: ['Product News'],
      engagementScore: 12,
      lastSentAt: '2026-10-25 09:00',
      createdAt: '2026-03-14',
      deliveriesCount: 12,
      opensCount: 2,
      clicksCount: 1,
      tags: ['Clicked Unsubscribe']
    }
  ],

  lists: [
    {
      id: 'lst-01',
      name: 'New Customers & Accounts',
      description: 'People who recently signed up or bought a product from our website.',
      contactCount: 128450,
      type: 'Dynamic',
      activeSubscribers: 127110,
      avgOpenRate: 41.2,
      createdAt: '2026-01-15',
      updatedAt: 'Today at 04:30',
      tags: ['Customers', 'Verified']
    },
    {
      id: 'lst-02',
      name: 'Product Updates & Releases',
      description: 'Users who want to hear about new platform features and bug fixes.',
      contactCount: 94230,
      type: 'Static',
      activeSubscribers: 93800,
      avgOpenRate: 48.7,
      createdAt: '2026-02-01',
      updatedAt: 'Yesterday',
      tags: ['Product News']
    },
    {
      id: 'lst-03',
      name: 'Monthly Newsletter Readers',
      description: 'Subscribers who receive our weekly tips, industry news, and guides.',
      contactCount: 215400,
      type: 'Dynamic',
      activeSubscribers: 212950,
      avgOpenRate: 33.4,
      createdAt: '2026-01-20',
      updatedAt: 'Today at 08:00',
      tags: ['Newsletter', 'High Volume']
    },
    {
      id: 'lst-04',
      name: 'Company Partners & Investors',
      description: 'Key business contacts, partners, and advisors who receive monthly updates.',
      contactCount: 14200,
      type: 'Static',
      activeSubscribers: 14160,
      avgOpenRate: 64.8,
      createdAt: '2026-03-10',
      updatedAt: '3 days ago',
      tags: ['Partners', 'VIP']
    }
  ],

  campaigns: [
    {
      id: 'cmp-901',
      name: 'November Product Improvements',
      subject: 'New tools and faster speeds in your FlowEM account',
      senderDomain: 'mail.flowem.net',
      senderEmail: 'updates@flowem.net',
      senderName: 'FlowEM Team',
      status: 'Completed',
      listName: 'Product Updates & Releases',
      recipientsTotal: 94230,
      sentCount: 94230,
      deliveredCount: 94050,
      openedCount: 46830,
      clickedCount: 18240,
      bouncedCount: 180,
      deliveryRate: 99.81,
      openRate: 49.79,
      clickRate: 19.39,
      sentAt: 'Yesterday at 10:00',
      createdAt: '2026-11-10'
    },
    {
      id: 'cmp-902',
      name: 'Winter Security & Safety Guide',
      subject: 'Simple steps to keep your account safe and secure',
      senderDomain: 'security.flowem.net',
      senderEmail: 'safety@flowem.net',
      senderName: 'FlowEM Support',
      status: 'Sending',
      listName: 'New Customers & Accounts',
      recipientsTotal: 128450,
      sentCount: 88400,
      deliveredCount: 88280,
      openedCount: 31200,
      clickedCount: 8400,
      bouncedCount: 120,
      deliveryRate: 99.86,
      openRate: 35.34,
      clickRate: 9.51,
      sentAt: 'Today at 11:30',
      createdAt: '2026-11-11'
    },
    {
      id: 'cmp-903',
      name: 'End of Year Special Offer',
      subject: 'Get 20% off your plan renewal for next year',
      senderDomain: 'offers.flowem.net',
      senderEmail: 'sales@flowem.net',
      senderName: 'FlowEM Offers',
      status: 'Scheduled',
      listName: 'Monthly Newsletter Readers',
      recipientsTotal: 215400,
      sentCount: 0,
      deliveredCount: 0,
      openedCount: 0,
      clickedCount: 0,
      bouncedCount: 0,
      deliveryRate: 0,
      openRate: 0,
      clickRate: 0,
      scheduledFor: 'Tomorrow at 09:00',
      createdAt: '2026-11-12'
    }
  ],

  templates: [
    {
      id: 'tpl-201',
      title: 'Simple Welcome Email',
      category: 'Transactional',
      subject: 'Welcome to FlowEM! Here is how to get started',
      previewText: 'A quick guide to sending your first email in under 5 minutes.',
      thumbnail: 'welcome',
      updatedAt: '2026-11-08',
      isPopular: true,
      htmlContent: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Welcome</title></head>
<body style="background-color: #f8fafc; font-family: 'Cambria Math', Cambria, Georgia, serif; color: #1e293b; padding: 40px 20px;">
  <table width="600" align="center" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    <tr>
      <td>
        <h2 style="color: #4f46e5; margin-top: 0; font-size: 24px;">Welcome to FlowEM</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">Hello {{firstName}},</p>
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">Thank you for joining FlowEM. You can now send bulk emails to your customers, create automated follow-up steps, and make sure your messages land straight into the Inbox.</p>
        <div style="background-color: #f1f5f9; border-left: 4px solid #4f46e5; padding: 16px; margin: 24px 0; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px; color: #1e293b; font-weight: bold;">Quick Checklist to Send Today:</p>
          <p style="margin: 6px 0 0; font-size: 13px; color: #475569;">1. Add your contacts list<br>2. Choose an email template<br>3. Hit Send!</p>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">If you need any help, our support team is ready to answer your questions.</p>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px;">FlowEM Inc. 100 Montgomery St, San Francisco, CA. You received this email because you signed up on our website.</p>
      </td>
    </tr>
  </table>
</body>
</html>`
    },
    {
      id: 'tpl-202',
      title: 'Company Monthly Newsletter',
      category: 'Newsletter',
      subject: 'This Month at FlowEM: New Features and Helpful Tips',
      previewText: 'Read about our latest platform updates and fast sending tools.',
      thumbnail: 'newsletter',
      updatedAt: '2026-11-04',
      isPopular: true,
      htmlContent: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Monthly Newsletter</title></head>
<body style="background-color: #f8fafc; font-family: 'Cambria Math', Cambria, Georgia, serif; color: #1e293b; padding: 40px 20px;">
  <table width="600" align="center" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px;">
    <tr>
      <td>
        <span style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #4f46e5;">Monthly Update</span>
        <h2 style="color: #0f172a; margin: 8px 0 16px;">What is New in FlowEM</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">Here are the main improvements we shipped this month to make your email sending faster and simpler:</p>
        <table width="100%" style="margin: 20px 0;">
          <tr>
            <td style="padding: 16px; background-color: #f1f5f9; border-radius: 8px; text-align: center;">
              <div style="font-size: 26px; font-weight: bold; color: #4f46e5;">99.8%</div>
              <div style="font-size: 12px; color: #64748b;">Inbox Success Rate</div>
            </td>
            <td width="16"></td>
            <td style="padding: 16px; background-color: #f1f5f9; border-radius: 8px; text-align: center;">
              <div style="font-size: 26px; font-weight: bold; color: #10b981;">Fast</div>
              <div style="font-size: 12px; color: #64748b;">Instant Delivery</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
    },
    {
      id: 'tpl-203',
      title: 'Simple Payment Receipt',
      category: 'Transactional',
      subject: 'Your payment receipt #FLW-884920',
      previewText: 'Thank you for your payment. Here are the order details.',
      thumbnail: 'receipt',
      updatedAt: '2026-10-28',
      isPopular: false,
      htmlContent: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Payment Receipt</title></head>
<body style="background-color: #f8fafc; font-family: 'Cambria Math', Cambria, Georgia, serif; color: #1e293b; padding: 40px 20px;">
  <table width="600" align="center" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px;">
    <tr>
      <td>
        <h3 style="color: #0f172a; margin-top: 0;">Payment Received</h3>
        <p style="color: #64748b; font-size: 14px;">Order Number: FLW-884920</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;">
        <table width="100%" style="font-size: 14px; color: #334155;">
          <tr>
            <td style="padding: 6px 0;">FlowEM Monthly Plan (2,500,000 Emails)</td>
            <td align="right" style="font-weight: bold;">$1,850.00</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;">Dedicated Clean IPs (x4)</td>
            <td align="right" style="font-weight: bold;">$240.00</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="padding: 12px 0; font-weight: bold; color: #0f172a;">Total Paid</td>
            <td align="right" style="padding: 12px 0; font-weight: bold; color: #10b981; font-size: 16px;">$2,090.00</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
    }
  ],

  automations: [
    {
      id: 'wf-401',
      name: 'Welcome Series for New Signups',
      description: 'Sends a welcome message immediately, waits 2 days, and sends helpful tips.',
      status: 'Active',
      triggerType: 'Contact Added',
      totalEnrolled: 8420,
      completedCount: 7890,
      avgConversionRate: 46.2,
      updatedAt: 'Today',
      steps: [
        {
          id: 'st-1',
          type: 'trigger',
          title: 'Trigger: New Contact Added to List',
          subtitle: 'Starts as soon as someone joins the New Customers list',
          config: { listId: 'lst-01' }
        },
        {
          id: 'st-2',
          type: 'email',
          title: 'Action: Send Welcome Email',
          subtitle: 'Uses Simple Welcome Email template',
          config: { templateId: 'tpl-201' }
        },
        {
          id: 'st-3',
          type: 'delay',
          title: 'Wait: 2 Days',
          subtitle: 'Gives the reader time to read the first email',
          config: { days: 2 }
        },
        {
          id: 'st-4',
          type: 'condition',
          title: 'Check: Did they open the first email?',
          subtitle: 'If yes, tag them as Engaged. If no, send a reminder.',
          config: { condition: 'opened' }
        },
        {
          id: 'st-5',
          type: 'tag',
          title: 'Action: Add Tag "Engaged Customer"',
          subtitle: 'Marks contact for future special offers',
          config: { tag: 'Engaged Customer' }
        }
      ]
    },
    {
      id: 'wf-402',
      name: 'Re-engage Inactive Subscribers',
      description: 'Finds contacts who have not opened emails in 90 days and checks if they still want updates.',
      status: 'Active',
      triggerType: 'Tag Applied',
      totalEnrolled: 19430,
      completedCount: 16200,
      avgConversionRate: 18.4,
      updatedAt: 'Yesterday',
      steps: [
        {
          id: 'st-11',
          type: 'trigger',
          title: 'Trigger: Contact marked Inactive (90 Days)',
          subtitle: 'Identified by automated monthly check',
          config: { tag: 'Inactive-90' }
        },
        {
          id: 'st-12',
          type: 'email',
          title: 'Action: Send "Do you still want emails?"',
          subtitle: 'Allows them to stay subscribed or unsubscribe easily',
          config: { templateId: 'tpl-202' }
        },
        {
          id: 'st-13',
          type: 'delay',
          title: 'Wait: 7 Days',
          subtitle: 'Waiting for their answer or click',
          config: { days: 7 }
        },
        {
          id: 'st-14',
          type: 'condition',
          title: 'Check: Still no opens or clicks?',
          subtitle: 'Safeguards your domain from sending to dead emails',
          config: { condition: 'no-open' }
        },
        {
          id: 'st-15',
          type: 'tag',
          title: 'Action: Move to Blocked List',
          subtitle: 'Stops sending future campaigns to avoid spam flags',
          config: { tag: 'Auto-Suppressed' }
        }
      ]
    }
  ],

  domains: [
    {
      id: 'dom-01',
      domain: 'flowem.net',
      subdomain: 'mail.flowem.net',
      status: 'Verified',
      spfStatus: 'Valid',
      dkimStatus: 'Valid',
      dmarcStatus: 'Valid',
      mxStatus: 'Valid',
      reputationScore: 99,
      warmupStage: 'Fully Warmed (Unlimited sending)',
      dailyQuotaLimit: 1000000,
      dailySentCount: 342190,
      lastChecked: 'Today at 12:45'
    },
    {
      id: 'dom-02',
      domain: 'flowem.net',
      subdomain: 'security.flowem.net',
      status: 'Verified',
      spfStatus: 'Valid',
      dkimStatus: 'Valid',
      dmarcStatus: 'Valid',
      mxStatus: 'Valid',
      reputationScore: 98,
      warmupStage: 'Fully Warmed (Stage 4)',
      dailyQuotaLimit: 500000,
      dailySentCount: 88400,
      lastChecked: 'Today at 12:45'
    },
    {
      id: 'dom-03',
      domain: 'newstore-mail.com',
      subdomain: 'send.newstore-mail.com',
      status: 'Pending Verification',
      spfStatus: 'Valid',
      dkimStatus: 'Missing',
      dmarcStatus: 'Missing',
      mxStatus: 'Valid',
      reputationScore: 70,
      warmupStage: 'Initial DNS Check',
      dailyQuotaLimit: 5000,
      dailySentCount: 0,
      lastChecked: 'Today at 11:00'
    }
  ],

  suppressions: [
    {
      id: 'sup-501',
      email: 'richard.b@old-inbox-closed.net',
      reason: 'Hard Bounce',
      sourceCampaign: 'November Product Improvements',
      suppressedAt: '2026-11-11 10:04',
      notes: 'Email address does not exist on receiving server (Error 550).',
      status: 'Active'
    },
    {
      id: 'sup-502',
      email: 'unsub.test@sample-box.com',
      reason: 'Unsubscribe Request',
      sourceCampaign: 'Winter Security Guide',
      suppressedAt: '2026-11-11 14:22',
      notes: 'User clicked the 1-click unsubscribe button in email header.',
      status: 'Active'
    },
    {
      id: 'sup-503',
      email: 'complaint.user@yahoo-test.com',
      reason: 'Spam Complaint',
      sourceCampaign: 'Fall Announcement',
      suppressedAt: '2026-10-19 16:30',
      notes: 'User clicked "Mark as Spam" in Yahoo Mail.',
      status: 'Active'
    },
    {
      id: 'sup-504',
      email: 'do-not-email@legaloffice.com',
      reason: 'Manual Policy',
      suppressedAt: '2026-09-12 11:00',
      notes: 'Manually blocked per user request.',
      status: 'Active'
    }
  ],

  organization: {
    companyName: 'FlowEM Systems Inc.',
    companyAddress: '100 Montgomery Street, Suite 2400, San Francisco, CA 94104',
    complianceContact: 'privacy@flowem-systems.com',
    timeZone: 'UTC (Universal Coordinated Time)',
    monthlyQuota: 2500000,
    currentUsage: 1940210,
    planName: 'Enterprise High-Volume Plan',
    enforceTwoFactor: true,
    webhookUrl: 'https://api.flowem-systems.com/events/notifications',
    apiKeys: [
      {
        id: 'key-01',
        name: 'Main Website Sending Key',
        prefix: 'flw_live_89402a...9f3',
        created: '2026-01-15',
        lastUsed: '2 minutes ago'
      },
      {
        id: 'key-02',
        name: 'Testing Key for Developers',
        prefix: 'flw_test_41289b...3c1',
        created: '2026-06-20',
        lastUsed: '1 hour ago'
      }
    ]
  },

  team: [
    {
      id: 'usr-01',
      name: 'Alexander Wright',
      email: 'a.wright@flowem-systems.com',
      role: 'Owner',
      twoFactorEnabled: true,
      status: 'Active',
      lastLogin: 'Today at 12:40'
    },
    {
      id: 'usr-02',
      name: 'Elena Rostova',
      email: 'e.rostova@flowem-systems.com',
      role: 'Administrator',
      twoFactorEnabled: true,
      status: 'Active',
      lastLogin: 'Today at 11:15'
    },
    {
      id: 'usr-03',
      name: 'Liam Chen',
      email: 'l.chen@flowem-systems.com',
      role: 'Deliverability Engineer',
      twoFactorEnabled: true,
      status: 'Active',
      lastLogin: 'Today at 12:05'
    },
    {
      id: 'usr-04',
      name: 'Sophia Patel',
      email: 's.patel@flowem-systems.com',
      role: 'Campaign Manager',
      twoFactorEnabled: true,
      status: 'Active',
      lastLogin: 'Yesterday at 17:50'
    }
  ]
};

// Load or initialize DB
function loadDb() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      console.error('Error reading db.json, resetting to default:', e);
    }
  }
  saveDb(defaultData);
  return defaultData;
}

function saveDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

let db = loadDb();

const app = express();
app.use(cors());
app.use(express.json());

// Server health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'FlowEM Bulk Email Platform',
    version: '2.0.0',
    totalContacts: db.contacts.length,
    totalCampaigns: db.campaigns.length,
    totalSentThisMonth: db.organization.currentUsage,
    inboxPlacement: '99.84%'
  });
});

// 1. Contacts APIs
app.get('/api/contacts', (req, res) => {
  const { search, status } = req.query;
  let results = [...db.contacts];

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(c =>
      c.email.toLowerCase().includes(q) ||
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (status && status !== 'All') {
    results = results.filter(c => c.status === status);
  }

  res.json(results);
});

app.post('/api/contacts', (req, res) => {
  const { email, firstName, lastName, list, tags } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  const newContact = {
    id: `ct-${Date.now()}`,
    email,
    firstName: firstName || 'Subscriber',
    lastName: lastName || '',
    status: 'Subscribed',
    lists: [list || 'New Customers & Accounts'],
    engagementScore: 85,
    lastSentAt: 'Pending First Email',
    createdAt: new Date().toISOString().split('T')[0],
    deliveriesCount: 0,
    opensCount: 0,
    clicksCount: 0,
    tags: Array.isArray(tags) ? tags : (tags || 'New Customer, Verified').split(',').map(s => s.trim()).filter(Boolean)
  };

  db.contacts.unshift(newContact);
  saveDb(db);
  res.status(201).json(newContact);
});

app.delete('/api/contacts/:id', (req, res) => {
  const { id } = req.params;
  db.contacts = db.contacts.filter(c => c.id !== id);
  saveDb(db);
  res.json({ success: true, id });
});

app.post('/api/contacts/import', (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Array of contacts required' });
  }

  const added = items.map((it, idx) => ({
    id: `ct-imp-${Date.now()}-${idx}`,
    email: it.email || `contact${idx}@example.com`,
    firstName: it.firstName || 'Customer',
    lastName: it.lastName || '',
    status: 'Subscribed',
    lists: [it.list || 'New Customers & Accounts'],
    engagementScore: 75,
    lastSentAt: 'Imported',
    createdAt: new Date().toISOString().split('T')[0],
    deliveriesCount: 0,
    opensCount: 0,
    clicksCount: 0,
    tags: ['Imported CSV']
  }));

  db.contacts = [...added, ...db.contacts];
  saveDb(db);
  res.json({ success: true, count: added.length });
});

// 2. Lists APIs
app.get('/api/lists', (req, res) => {
  res.json(db.lists);
});

app.post('/api/lists', (req, res) => {
  const { name, description, type, tags } = req.body;
  if (!name) return res.status(400).json({ error: 'List name required' });

  const newList = {
    id: `lst-${Date.now()}`,
    name,
    description: description || 'New contact group created in FlowEM.',
    contactCount: 0,
    type: type || 'Dynamic',
    activeSubscribers: 0,
    avgOpenRate: 0,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: 'Just now',
    tags: Array.isArray(tags) ? tags : (tags || 'General').split(',').map(s => s.trim()).filter(Boolean)
  };

  db.lists.unshift(newList);
  saveDb(db);
  res.status(201).json(newList);
});

app.post('/api/lists/:id/clean', (req, res) => {
  const { id } = req.params;
  const list = db.lists.find(l => l.id === id);
  if (!list) return res.status(404).json({ error: 'List not found' });

  const removed = Math.max(1, Math.round(list.contactCount * 0.012));
  list.contactCount = Math.max(0, list.contactCount - removed);
  list.activeSubscribers = Math.max(0, list.activeSubscribers - removed);
  list.updatedAt = 'Cleaned just now';

  saveDb(db);
  res.json({ success: true, removed, list });
});

// 3. Campaigns APIs
app.get('/api/campaigns', (req, res) => {
  res.json(db.campaigns);
});

app.post('/api/campaigns', (req, res) => {
  const { name, subject, senderDomain, senderEmail, senderName, listName, sendImmediately } = req.body;

  const targetList = db.lists.find(l => l.name === listName) || db.lists[0];
  const newCamp = {
    id: `cmp-${Date.now()}`,
    name: name || 'Untitled Campaign',
    subject: subject || 'New message from FlowEM',
    senderDomain: senderDomain || 'mail.flowem.net',
    senderEmail: senderEmail || 'updates@flowem.net',
    senderName: senderName || 'FlowEM Team',
    status: sendImmediately ? 'Sending' : 'Scheduled',
    listName: listName || targetList.name,
    recipientsTotal: targetList.contactCount || 50000,
    sentCount: sendImmediately ? 4500 : 0,
    deliveredCount: sendImmediately ? 4490 : 0,
    openedCount: 0,
    clickedCount: 0,
    bouncedCount: 0,
    deliveryRate: sendImmediately ? 99.8 : 0,
    openRate: 0,
    clickRate: 0,
    scheduledFor: sendImmediately ? undefined : 'Tomorrow at 09:00',
    sentAt: sendImmediately ? 'Just now' : undefined,
    createdAt: new Date().toISOString().split('T')[0]
  };

  db.campaigns.unshift(newCamp);
  saveDb(db);
  res.status(201).json(newCamp);
});

app.post('/api/campaigns/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const camp = db.campaigns.find(c => c.id === id);
  if (!camp) return res.status(404).json({ error: 'Campaign not found' });

  camp.status = status;
  saveDb(db);
  res.json({ success: true, campaign: camp });
});

// 4. Templates APIs
app.get('/api/templates', (req, res) => {
  res.json(db.templates);
});

app.post('/api/templates', (req, res) => {
  const { title, category, subject, previewText, htmlContent } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });

  const newTpl = {
    id: `tpl-${Date.now()}`,
    title,
    category: category || 'Transactional',
    subject: subject || 'Important message from FlowEM',
    previewText: previewText || 'Review details inside this email.',
    htmlContent: htmlContent || '<!DOCTYPE html><html><body><h1>Hello {{firstName}}</h1></body></html>',
    thumbnail: 'custom',
    updatedAt: new Date().toISOString().split('T')[0],
    isPopular: false
  };

  db.templates.unshift(newTpl);
  saveDb(db);
  res.status(201).json(newTpl);
});

// 5. Automations APIs
app.get('/api/automations', (req, res) => {
  res.json(db.automations);
});

app.post('/api/automations/:id/toggle', (req, res) => {
  const { id } = req.params;
  const wf = db.automations.find(w => w.id === id);
  if (!wf) return res.status(404).json({ error: 'Automation not found' });

  wf.status = wf.status === 'Active' ? 'Paused' : 'Active';
  saveDb(db);
  res.json({ success: true, status: wf.status });
});

app.post('/api/automations/:id/step', (req, res) => {
  const { id } = req.params;
  const { type, title, subtitle } = req.body;
  const wf = db.automations.find(w => w.id === id);
  if (!wf) return res.status(404).json({ error: 'Automation not found' });

  const newStep = {
    id: `st-${Date.now()}`,
    type: type || 'delay',
    title: title || 'New Step Node',
    subtitle: subtitle || 'Configured step',
    config: {}
  };

  wf.steps.push(newStep);
  saveDb(db);
  res.status(201).json({ success: true, steps: wf.steps });
});

app.post('/api/automations/test', (req, res) => {
  res.json({
    success: true,
    message: 'Test event sent successfully! 1 test subscriber entered the flow.'
  });
});

// 6. Domains & Sender Config APIs
app.get('/api/domains', (req, res) => {
  res.json(db.domains);
});

app.post('/api/domains', (req, res) => {
  const { domain, subdomain } = req.body;
  if (!domain) return res.status(400).json({ error: 'Domain required' });

  const newDom = {
    id: `dom-${Date.now()}`,
    domain,
    subdomain: subdomain || `mail.${domain}`,
    status: 'Pending Verification',
    spfStatus: 'Valid',
    dkimStatus: 'Missing',
    dmarcStatus: 'Missing',
    mxStatus: 'Valid',
    reputationScore: 75,
    warmupStage: 'Stage 1 (5k emails/day)',
    dailyQuotaLimit: 5000,
    dailySentCount: 0,
    lastChecked: 'Just added'
  };

  db.domains.push(newDom);
  saveDb(db);
  res.status(201).json(newDom);
});

app.post('/api/domains/:id/verify', (req, res) => {
  const { id } = req.params;
  const dom = db.domains.find(d => d.id === id);
  if (!dom) return res.status(404).json({ error: 'Domain not found' });

  dom.status = 'Verified';
  dom.spfStatus = 'Valid';
  dom.dkimStatus = 'Valid';
  dom.dmarcStatus = 'Valid';
  dom.mxStatus = 'Valid';
  dom.reputationScore = 98;
  dom.lastChecked = 'Just verified';

  saveDb(db);
  res.json({ success: true, domain: dom });
});

// 7. Suppressions APIs
app.get('/api/suppressions', (req, res) => {
  res.json(db.suppressions);
});

app.post('/api/suppressions', (req, res) => {
  const { email, reason, notes } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const newSup = {
    id: `sup-${Date.now()}`,
    email,
    reason: reason || 'Manual Policy',
    suppressedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    notes: notes || 'Manually added to blocked list.',
    status: 'Active'
  };

  db.suppressions.unshift(newSup);
  saveDb(db);
  res.status(201).json(newSup);
});

app.delete('/api/suppressions/:id', (req, res) => {
  const { id } = req.params;
  db.suppressions = db.suppressions.filter(s => s.id !== id);
  saveDb(db);
  res.json({ success: true, id });
});

// 8. Organization & Account Settings APIs
app.get('/api/organization', (req, res) => {
  res.json(db.organization);
});

app.put('/api/organization', (req, res) => {
  db.organization = { ...db.organization, ...req.body };
  saveDb(db);
  res.json(db.organization);
});

app.post('/api/organization/api-keys', (req, res) => {
  const { name } = req.body;
  const newKey = {
    id: `key-${Date.now()}`,
    name: name || 'API Sending Key',
    prefix: `flw_live_${Math.random().toString(36).substring(2, 7)}...${Math.random().toString(36).substring(2, 5)}`,
    created: new Date().toISOString().split('T')[0],
    lastUsed: 'Never'
  };

  db.organization.apiKeys.push(newKey);
  saveDb(db);
  res.status(201).json(newKey);
});

app.delete('/api/organization/api-keys/:id', (req, res) => {
  const { id } = req.params;
  db.organization.apiKeys = db.organization.apiKeys.filter(k => k.id !== id);
  saveDb(db);
  res.json({ success: true, id });
});

app.post('/api/organization/test-webhook', (req, res) => {
  res.json({
    success: true,
    message: 'Test webhook delivered successfully! Endpoint returned HTTP 200 OK.'
  });
});

// 9. Team Members APIs
app.get('/api/team', (req, res) => {
  res.json(db.team);
});

app.post('/api/team', (req, res) => {
  const { name, email, role } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const newMember = {
    id: `usr-${Date.now()}`,
    name: name || 'Invited Teammate',
    email,
    role: role || 'Campaign Manager',
    twoFactorEnabled: false,
    status: 'Invited',
    lastLogin: 'Pending'
  };

  db.team.push(newMember);
  saveDb(db);
  res.status(201).json(newMember);
});

app.delete('/api/team/:id', (req, res) => {
  const { id } = req.params;
  db.team = db.team.filter(t => t.id !== id);
  saveDb(db);
  res.json({ success: true, id });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`FlowEM Backend API server listening on http://localhost:${PORT}`);
});
