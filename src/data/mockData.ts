import { 
  Contact, 
  ContactList, 
  Campaign, 
  EmailTemplate, 
  AutomationWorkflow, 
  SenderDomain, 
  SuppressionRecord, 
  OrganizationSettings, 
  TeamMember 
} from '../types';

export const initialContacts: Contact[] = [
  {
    id: 'ct-101',
    email: 'sarah.jenkins@acme-corp.com',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    status: 'Subscribed',
    lists: ['Enterprise Leads', 'Product Updates'],
    engagementScore: 94,
    lastSentAt: '2026-11-10 14:22',
    createdAt: '2026-08-14',
    deliveriesCount: 42,
    opensCount: 39,
    clicksCount: 18,
    tags: ['B2B', 'Decision Maker', 'High LTV']
  },
  {
    id: 'ct-102',
    email: 'marcus.vance@solaris-cloud.io',
    firstName: 'Marcus',
    lastName: 'Vance',
    status: 'Subscribed',
    lists: ['Enterprise Leads', 'Tech Briefing'],
    engagementScore: 88,
    lastSentAt: '2026-11-11 09:15',
    createdAt: '2026-07-20',
    deliveriesCount: 35,
    opensCount: 31,
    clicksCount: 12,
    tags: ['Cloud Eng', 'Verified Opt-In']
  },
  {
    id: 'ct-103',
    email: 'elena.rostova@fintech-prime.eu',
    firstName: 'Elena',
    lastName: 'Rostova',
    status: 'Subscribed',
    lists: ['Compliance Digest', 'Enterprise Leads'],
    engagementScore: 96,
    lastSentAt: '2026-11-12 08:30',
    createdAt: '2026-05-11',
    deliveriesCount: 58,
    opensCount: 56,
    clicksCount: 29,
    tags: ['Fintech', 'CFO Office', 'GDPR-EU']
  },
  {
    id: 'ct-104',
    email: 'david.kim@nexus-robotics.org',
    firstName: 'David',
    lastName: 'Kim',
    status: 'Subscribed',
    lists: ['Product Updates'],
    engagementScore: 72,
    lastSentAt: '2026-11-09 11:40',
    createdAt: '2026-09-02',
    deliveriesCount: 22,
    opensCount: 16,
    clicksCount: 5,
    tags: ['Robotics', 'Tier 2']
  },
  {
    id: 'ct-105',
    email: 'amara.okafor@pan-african-ventures.co',
    firstName: 'Amara',
    lastName: 'Okafor',
    status: 'Subscribed',
    lists: ['Global Investors', 'Enterprise Leads'],
    engagementScore: 91,
    lastSentAt: '2026-11-10 16:50',
    createdAt: '2026-04-19',
    deliveriesCount: 64,
    opensCount: 59,
    clicksCount: 24,
    tags: ['Venture Capital', 'Strategic Partner']
  },
  {
    id: 'ct-106',
    email: 'richard.b@old-domain-invalid.net',
    firstName: 'Richard',
    lastName: 'Benson',
    status: 'Bounced',
    lists: ['Legacy Imported 2025'],
    engagementScore: 8,
    lastSentAt: '2026-11-01 10:11',
    createdAt: '2026-01-10',
    deliveriesCount: 3,
    opensCount: 0,
    clicksCount: 0,
    tags: ['Hard Bounce', 'DNS Failure']
  },
  {
    id: 'ct-107',
    email: 'claire.morin@nordic-telecom.se',
    firstName: 'Claire',
    lastName: 'Morin',
    status: 'Subscribed',
    lists: ['Tech Briefing', 'Product Updates'],
    engagementScore: 82,
    lastSentAt: '2026-11-11 18:02',
    createdAt: '2026-06-30',
    deliveriesCount: 39,
    opensCount: 32,
    clicksCount: 14,
    tags: ['Telecom', 'EMEA']
  },
  {
    id: 'ct-108',
    email: 'khalid.al-mansoor@gulf-logistics.ae',
    firstName: 'Khalid',
    lastName: 'Al-Mansoor',
    status: 'Subscribed',
    lists: ['Enterprise Leads'],
    engagementScore: 85,
    lastSentAt: '2026-11-08 14:10',
    createdAt: '2026-08-01',
    deliveriesCount: 28,
    opensCount: 24,
    clicksCount: 9,
    tags: ['Supply Chain', 'MENA']
  },
  {
    id: 'ct-109',
    email: 'optout.user@compliance-test.com',
    firstName: 'Thomas',
    lastName: 'Wright',
    status: 'Unsubscribed',
    lists: ['Product Updates'],
    engagementScore: 15,
    lastSentAt: '2026-10-25 09:00',
    createdAt: '2026-03-14',
    deliveriesCount: 12,
    opensCount: 2,
    clicksCount: 1,
    tags: ['One-Click Unsub', 'CASL-OptOut']
  },
  {
    id: 'ct-110',
    email: 'beatrice.lang@swiss-biotech.ch',
    firstName: 'Beatrice',
    lastName: 'Lang',
    status: 'Subscribed',
    lists: ['Tech Briefing', 'Enterprise Leads'],
    engagementScore: 98,
    lastSentAt: '2026-11-12 11:20',
    createdAt: '2026-02-18',
    deliveriesCount: 84,
    opensCount: 82,
    clicksCount: 47,
    tags: ['Biotech', 'Enterprise Lead', 'High Affinity']
  }
];

export const initialContactLists: ContactList[] = [
  {
    id: 'lst-01',
    name: 'Enterprise Leads & Accounts',
    description: 'B2B enterprise decision makers with verified corporate domains and double opt-in verification.',
    contactCount: 128450,
    type: 'Dynamic',
    activeSubscribers: 127110,
    avgOpenRate: 41.2,
    createdAt: '2026-01-15',
    updatedAt: '2026-11-12 04:30',
    tags: ['B2B', 'Verified', 'Automated Filter']
  },
  {
    id: 'lst-02',
    name: 'Product Infrastructure Updates',
    description: 'Subscribers registered for technical platform releases, API versioning notifications, and status announcements.',
    contactCount: 94230,
    type: 'Static',
    activeSubscribers: 93800,
    avgOpenRate: 48.7,
    createdAt: '2026-02-01',
    updatedAt: '2026-11-11 19:40',
    tags: ['Developers', 'Technical']
  },
  {
    id: 'lst-03',
    name: 'Global Investors & Partners',
    description: 'Accredited institutional investors, fund managers, and venture advisory boards.',
    contactCount: 14200,
    type: 'Static',
    activeSubscribers: 14160,
    avgOpenRate: 64.8,
    createdAt: '2026-03-10',
    updatedAt: '2026-11-09 10:15',
    tags: ['C-Level', 'High Priority']
  },
  {
    id: 'lst-04',
    name: 'EMEA Compliance & Legal Digest',
    description: 'European data privacy officers, legal counsels, and regulatory compliance observers under GDPR guidelines.',
    contactCount: 38600,
    type: 'Dynamic',
    activeSubscribers: 38240,
    avgOpenRate: 37.5,
    createdAt: '2026-04-12',
    updatedAt: '2026-11-12 01:10',
    tags: ['GDPR', 'Compliance', 'EU Region']
  },
  {
    id: 'lst-05',
    name: 'Weekly Engineering Briefing',
    description: 'Active software engineers receiving architectural digests, benchmarks, and performance teardowns.',
    contactCount: 215400,
    type: 'Dynamic',
    activeSubscribers: 212950,
    avgOpenRate: 33.4,
    createdAt: '2026-01-20',
    updatedAt: '2026-11-12 08:00',
    tags: ['Newsletter', 'High Volume']
  }
];

export const initialCampaigns: Campaign[] = [
  {
    id: 'cmp-901',
    name: 'Q4 Global Infrastructure Migration Protocol',
    subject: 'Critical Update: Network latency optimization and new MTA endpoints',
    senderDomain: 'dispatch.flowem-enterprise.net',
    senderEmail: 'infrastructure@flowem-enterprise.net',
    senderName: 'FlowEM Engineering Dispatch',
    status: 'Completed',
    listName: 'Product Infrastructure Updates',
    recipientsTotal: 94230,
    sentCount: 94230,
    deliveredCount: 94050,
    openedCount: 46830,
    clickedCount: 18240,
    bouncedCount: 180,
    deliveryRate: 99.81,
    openRate: 49.79,
    clickRate: 19.39,
    sentAt: '2026-11-11 10:00',
    createdAt: '2026-11-10 15:20'
  },
  {
    id: 'cmp-902',
    name: 'Enterprise Security Architecture Whitepaper',
    subject: 'Technical Brief: Zero-Trust Deliverability and DKIM Key Rotation',
    senderDomain: 'security.flowem-enterprise.net',
    senderEmail: 'security-brief@flowem-enterprise.net',
    senderName: 'FlowEM Security Council',
    status: 'Sending',
    listName: 'Enterprise Leads & Accounts',
    recipientsTotal: 128450,
    sentCount: 88400,
    deliveredCount: 88280,
    openedCount: 31200,
    clickedCount: 8400,
    bouncedCount: 120,
    deliveryRate: 99.86,
    openRate: 35.34,
    clickRate: 9.51,
    sentAt: '2026-11-12 11:30',
    createdAt: '2026-11-11 18:00'
  },
  {
    id: 'cmp-903',
    name: 'Annual Regulatory Compliance Audit Certification',
    subject: 'Formal Notification: SOC 2 Type II and ISO 27001 Re-certification',
    senderDomain: 'compliance.flowem-enterprise.net',
    senderEmail: 'governance@flowem-enterprise.net',
    senderName: 'FlowEM Legal & Compliance',
    status: 'Scheduled',
    listName: 'EMEA Compliance & Legal Digest',
    recipientsTotal: 38600,
    sentCount: 0,
    deliveredCount: 0,
    openedCount: 0,
    clickedCount: 0,
    bouncedCount: 0,
    deliveryRate: 0,
    openRate: 0,
    clickRate: 0,
    scheduledFor: '2026-11-14 09:00',
    createdAt: '2026-11-12 09:40'
  },
  {
    id: 'cmp-904',
    name: 'High-Volume API V3 Deprecation Schedule',
    subject: 'Notice of deprecation for Legacy REST v1 endpoints by Dec 2026',
    senderDomain: 'dispatch.flowem-enterprise.net',
    senderEmail: 'api-support@flowem-enterprise.net',
    senderName: 'FlowEM Platform API',
    status: 'Draft',
    listName: 'Weekly Engineering Briefing',
    recipientsTotal: 215400,
    sentCount: 0,
    deliveredCount: 0,
    openedCount: 0,
    clickedCount: 0,
    bouncedCount: 0,
    deliveryRate: 0,
    openRate: 0,
    clickRate: 0,
    createdAt: '2026-11-12 12:10'
  }
];

export const initialTemplates: EmailTemplate[] = [
  {
    id: 'tpl-201',
    title: 'Enterprise Technical Advisory',
    category: 'System Alerts',
    subject: 'Security Advisory: Immediate DKIM alignment and SPF enforcement',
    previewText: 'Summary of recommended authentication adjustments for your sending domain.',
    thumbnail: 'security',
    updatedAt: '2026-11-08',
    isPopular: true,
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Security Advisory</title>
</head>
<body style="background-color: #0c1222; font-family: 'Cambria Math', Cambria, Georgia, serif; color: #e2e8f0; padding: 40px 20px;">
  <table width="600" align="center" style="background-color: #151d30; border: 1px solid #334155; border-radius: 8px; padding: 32px;">
    <tr>
      <td>
        <h2 style="color: #6366f1; margin-top: 0; font-size: 22px;">FlowEM Technical Advisory Notice</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">Dear {{firstName}},</p>
        <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">This is a formal communication from the FlowEM deliverability monitoring network regarding your domain security parameters.</p>
        <div style="background-color: #0b1120; border-left: 4px solid #6366f1; padding: 16px; margin: 24px 0;">
          <p style="margin: 0; font-size: 14px; color: #94a3b8;">Status: <strong style="color: #38bdf8;">Optimal Alignment Detected</strong></p>
          <p style="margin: 6px 0 0; font-size: 13px; color: #64748b;">MTA routing clusters active: US-EAST-1, EU-CENTRAL-1</p>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #94a3b8;">No immediate manual intervention is required. Review your sender telemetry in the FlowEM command console.</p>
        <p style="font-size: 12px; color: #475569; margin-top: 32px; border-top: 1px solid #1e293b; padding-top: 16px;">FlowEM Inc. 100 Montgomery St, Suite 2400, San Francisco, CA. You are receiving this advisory as an authorized technical account contact.</p>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  {
    id: 'tpl-202',
    title: 'Executive Quarterly Digest',
    category: 'Newsletter',
    subject: 'Quarterly Infrastructure Telemetry and Performance Benchmarks',
    previewText: 'Review our 99.84% delivery milestone and platform latency reductions.',
    thumbnail: 'newsletter',
    updatedAt: '2026-11-04',
    isPopular: true,
    htmlContent: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Quarterly Digest</title></head>
<body style="background-color: #0c1222; font-family: 'Cambria Math', Cambria, Georgia, serif; color: #e2e8f0; padding: 40px 20px;">
  <table width="600" align="center" style="background-color: #151d30; border: 1px solid #334155; border-radius: 8px; padding: 32px;">
    <tr>
      <td>
        <span style="font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #38bdf8;">Quarterly Performance Report</span>
        <h2 style="color: #ffffff; margin: 12px 0 20px; font-size: 24px;">FlowEM Global Dispatch Telemetry</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">During the preceding operational quarter, the FlowEM distributed network processed 14.8 billion transactions with zero unscheduled downtime.</p>
        <table width="100%" style="margin: 24px 0; border-collapse: collapse;">
          <tr>
            <td style="background-color: #0b1120; padding: 16px; border: 1px solid #1e293b; border-radius: 4px; text-align: center;">
              <div style="font-size: 28px; font-weight: bold; color: #6366f1;">99.84%</div>
              <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Inbox Placement</div>
            </td>
            <td width="16"></td>
            <td style="background-color: #0b1120; padding: 16px; border: 1px solid #1e293b; border-radius: 4px; text-align: center;">
              <div style="font-size: 28px; font-weight: bold; color: #10b981;">42ms</div>
              <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Average MTA Latency</div>
            </td>
          </tr>
        </table>
        <p style="font-size: 14px; line-height: 1.6; color: #94a3b8;">Detailed breakdown logs and domain warm-up telemetry can be exported directly through the Analytics interface.</p>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  {
    id: 'tpl-203',
    title: 'High-Volume Transactional Receipt',
    category: 'Transactional',
    subject: 'Receipt of Transaction: Order #FLW-884920',
    previewText: 'Your subscription settlement has been confirmed and archived.',
    thumbnail: 'transactional',
    updatedAt: '2026-10-28',
    isPopular: false,
    htmlContent: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Transaction Receipt</title></head>
<body style="background-color: #0c1222; font-family: 'Cambria Math', Cambria, Georgia, serif; color: #e2e8f0; padding: 40px 20px;">
  <table width="600" align="center" style="background-color: #151d30; border: 1px solid #334155; border-radius: 8px; padding: 32px;">
    <tr>
      <td>
        <h3 style="color: #ffffff; margin-top: 0;">Official Payment Confirmation</h3>
        <p style="color: #94a3b8; font-size: 14px;">Transaction Reference: FLW-884920-XQ</p>
        <hr style="border: none; border-top: 1px solid #1e293b; margin: 20px 0;">
        <table width="100%" style="font-size: 14px; color: #cbd5e1;">
          <tr>
            <td style="padding: 8px 0;">Tier Allocation: Enterprise Tier (5M Monthly)</td>
            <td align="right" style="padding: 8px 0; font-weight: bold;">$1,850.00 USD</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">Dedicated IP Allocation (x4 Blocks)</td>
            <td align="right" style="padding: 8px 0; font-weight: bold;">$240.00 USD</td>
          </tr>
          <tr style="border-top: 1px solid #334155;">
            <td style="padding: 12px 0; font-weight: bold; color: #ffffff;">Total Settled</td>
            <td align="right" style="padding: 12px 0; font-weight: bold; color: #10b981; font-size: 16px;">$2,090.00 USD</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  {
    id: 'tpl-204',
    title: 'Product Capability Launch Brief',
    category: 'Product Launch',
    subject: 'Announcing FlowEM Adaptive Warm-Up Engine v3.0',
    previewText: 'Autonomous volume escalation algorithm with real-time feedback loop.',
    thumbnail: 'product',
    updatedAt: '2026-11-01',
    isPopular: false,
    htmlContent: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Product Launch</title></head>
<body style="background-color: #0c1222; font-family: 'Cambria Math', Cambria, Georgia, serif; color: #e2e8f0; padding: 40px 20px;">
  <table width="600" align="center" style="background-color: #151d30; border: 1px solid #334155; border-radius: 8px; padding: 32px;">
    <tr>
      <td>
        <span style="font-size: 12px; color: #a855f7; font-weight: bold;">NEW ARCHITECTURE</span>
        <h2 style="color: #ffffff; margin: 10px 0;">Autonomous Warm-Up Engine v3.0</h2>
        <p style="font-size: 15px; color: #cbd5e1; line-height: 1.6;">We have deployed our third-generation automated IP warm-up system. The system dynamically gauges recipient ISP throttling signals and scales hourly volume without human oversight.</p>
      </td>
    </tr>
  </table>
</body>
</html>`
  }
];

export const initialWorkflows: AutomationWorkflow[] = [
  {
    id: 'wf-401',
    name: 'Enterprise Client Onboarding Protocol',
    description: 'Sequenced onboarding stream with verification checkpoints and automated welcome payloads.',
    status: 'Active',
    triggerType: 'Contact Added',
    totalEnrolled: 8420,
    completedCount: 7890,
    avgConversionRate: 46.2,
    updatedAt: '2026-11-10 14:00',
    steps: [
      {
        id: 'st-1',
        type: 'trigger',
        title: 'Trigger: Contact Added to Enterprise List',
        subtitle: 'Fired instantly upon contact creation or tag assignment',
        config: { listId: 'lst-01' }
      },
      {
        id: 'st-2',
        type: 'delay',
        title: 'Delay: Wait 15 Minutes',
        subtitle: 'Buffer window to ensure data synchronization across nodes',
        config: { durationMinutes: 15 }
      },
      {
        id: 'st-3',
        type: 'email',
        title: 'Action: Send Technical Advisory Welcome',
        subtitle: 'Template: Enterprise Technical Advisory (tpl-201)',
        config: { templateId: 'tpl-201', senderDomain: 'dispatch.flowem-enterprise.net' }
      },
      {
        id: 'st-4',
        type: 'condition',
        title: 'Condition: Opened Email Within 48 Hours',
        subtitle: 'Evaluate recipient engagement telemetry',
        config: { event: 'open', windowHours: 48 }
      },
      {
        id: 'st-5',
        type: 'tag',
        title: 'Action: Apply Tag "Engaged Prospect"',
        subtitle: 'Route to high-priority sales pipeline',
        config: { tag: 'Engaged Prospect' }
      }
    ]
  },
  {
    id: 'wf-402',
    name: 'High-Volume Inactive Contact Winback',
    description: 'Three-tiered automated reactivation pipeline with engagement threshold filters.',
    status: 'Active',
    triggerType: 'Tag Applied',
    totalEnrolled: 19430,
    completedCount: 16200,
    avgConversionRate: 18.4,
    updatedAt: '2026-11-09 11:20',
    steps: [
      {
        id: 'st-11',
        type: 'trigger',
        title: 'Trigger: Contact Marked Inactive 90 Days',
        subtitle: 'Targeted retention cohort',
        config: { tag: 'Inactive-90' }
      },
      {
        id: 'st-12',
        type: 'email',
        title: 'Action: Dispatch Re-verification Query',
        subtitle: 'Confirm opt-in preference under compliance guidelines',
        config: { templateId: 'tpl-202' }
      },
      {
        id: 'st-13',
        type: 'delay',
        title: 'Delay: 7 Business Days',
        subtitle: 'Awaiting engagement confirmation',
        config: { days: 7 }
      },
      {
        id: 'st-14',
        type: 'condition',
        title: 'Condition: No Interaction Detected',
        subtitle: 'Check if open count is zero',
        config: { condition: 'opens == 0' }
      },
      {
        id: 'st-15',
        type: 'webhook',
        title: 'Action: Webhook Suppression Sync',
        subtitle: 'Send event to external data warehouse for suppression',
        config: { endpoint: 'https://api.internal.corp/compliance/suppress' }
      }
    ]
  },
  {
    id: 'wf-403',
    name: 'Real-Time Transactional Security Check',
    description: 'Instant event-driven notification triggered via REST API webhook dispatch.',
    status: 'Paused',
    triggerType: 'API Event',
    totalEnrolled: 41200,
    completedCount: 41200,
    avgConversionRate: 98.9,
    updatedAt: '2026-11-01 09:00',
    steps: [
      {
        id: 'st-21',
        type: 'trigger',
        title: 'Trigger: Webhook Event "security.alert"',
        subtitle: 'Inbound authenticated POST payload',
        config: { topic: 'security.alert' }
      },
      {
        id: 'st-22',
        type: 'email',
        title: 'Action: Immediate Priority Dispatch',
        subtitle: 'Direct queue bypass for critical alert',
        config: { priority: 'high', templateId: 'tpl-201' }
      }
    ]
  }
];

export const initialSenderDomains: SenderDomain[] = [
  {
    id: 'dom-01',
    domain: 'flowem-enterprise.net',
    subdomain: 'dispatch.flowem-enterprise.net',
    status: 'Verified',
    spfStatus: 'Valid',
    dkimStatus: 'Valid',
    dmarcStatus: 'Valid',
    mxStatus: 'Valid',
    reputationScore: 99,
    warmupStage: 'Fully Warmed (Tier 4 / Unlimited)',
    dailyQuotaLimit: 1000000,
    dailySentCount: 342190,
    lastChecked: '2026-11-12 12:45'
  },
  {
    id: 'dom-02',
    domain: 'flowem-enterprise.net',
    subdomain: 'security.flowem-enterprise.net',
    status: 'Verified',
    spfStatus: 'Valid',
    dkimStatus: 'Valid',
    dmarcStatus: 'Valid',
    mxStatus: 'Valid',
    reputationScore: 98,
    warmupStage: 'Fully Warmed (Tier 4)',
    dailyQuotaLimit: 500000,
    dailySentCount: 88400,
    lastChecked: '2026-11-12 12:45'
  },
  {
    id: 'dom-03',
    domain: 'cloud-relay-hub.com',
    subdomain: 'mta-pool1.cloud-relay-hub.com',
    status: 'Verified',
    spfStatus: 'Valid',
    dkimStatus: 'Valid',
    dmarcStatus: 'Valid',
    mxStatus: 'Valid',
    reputationScore: 94,
    warmupStage: 'Active Warmup (Stage 3: 50k/day)',
    dailyQuotaLimit: 50000,
    dailySentCount: 28450,
    lastChecked: '2026-11-12 10:15'
  },
  {
    id: 'dom-04',
    domain: 'newclient-outbound.org',
    subdomain: 'mail.newclient-outbound.org',
    status: 'Pending Verification',
    spfStatus: 'Valid',
    dkimStatus: 'Missing',
    dmarcStatus: 'Invalid',
    mxStatus: 'Valid',
    reputationScore: 68,
    warmupStage: 'Initial DNS Calibration (0/day)',
    dailyQuotaLimit: 0,
    dailySentCount: 0,
    lastChecked: '2026-11-12 11:00'
  }
];

export const initialSuppressions: SuppressionRecord[] = [
  {
    id: 'sup-501',
    email: 'richard.b@old-domain-invalid.net',
    reason: 'Hard Bounce',
    sourceCampaign: 'Q4 Global Infrastructure Migration Protocol',
    suppressedAt: '2026-11-11 10:04',
    notes: '550 5.1.1 Recipient address rejected: User unknown in virtual mailbox table',
    status: 'Active'
  },
  {
    id: 'sup-502',
    email: 'optout.user@compliance-test.com',
    reason: 'Unsubscribe Request',
    sourceCampaign: 'Enterprise Security Architecture Whitepaper',
    suppressedAt: '2026-11-11 14:22',
    notes: 'RFC-8058 One-Click List-Unsubscribe header action verified',
    status: 'Active'
  },
  {
    id: 'sup-503',
    email: 'complaint.flag@corporate-audit.org',
    reason: 'Spam Complaint',
    sourceCampaign: 'Q3 Product Announcement',
    suppressedAt: '2026-10-19 16:30',
    notes: 'ISP Feedback Loop (FBL) complaint registered from Yahoo Mail MTA',
    status: 'Active'
  },
  {
    id: 'sup-504',
    email: 'no-contact@legalfirm-ny.com',
    reason: 'Manual Policy',
    suppressedAt: '2026-09-12 11:00',
    notes: 'Explicit exclusion requested via compliance legal notice',
    status: 'Active'
  },
  {
    id: 'sup-505',
    email: 'dead-mailbox-99@telecom-corp.de',
    reason: 'Hard Bounce',
    sourceCampaign: 'Q4 Global Infrastructure Migration Protocol',
    suppressedAt: '2026-11-11 10:05',
    notes: '554 5.7.1 Host resolution failed: authoritative name server returned NXDOMAIN',
    status: 'Active'
  }
];

export const initialOrganization: OrganizationSettings = {
  companyName: 'FlowEM Global Systems Inc.',
  companyAddress: '100 Montgomery Street, Suite 2400, San Francisco, CA 94104',
  complianceContact: 'dpo@flowem-systems.com',
  timeZone: 'UTC (Coordinated Universal Time)',
  monthlyQuota: 2500000,
  currentUsage: 1940210,
  planName: 'Enterprise Dedicated Tier',
  enforceTwoFactor: true,
  webhookUrl: 'https://api.flowem-enterprise.net/v2/events/telemetry',
  apiKeys: [
    {
      id: 'key-01',
      name: 'Production Dispatch Primary',
      prefix: 'flw_live_89402a...9f3',
      created: '2026-01-15',
      lastUsed: '2 minutes ago'
    },
    {
      id: 'key-02',
      name: 'Staging Integration Key',
      prefix: 'flw_test_41289b...3c1',
      created: '2026-06-20',
      lastUsed: '1 hour ago'
    },
    {
      id: 'key-03',
      name: 'Automated CI/CD Verification',
      prefix: 'flw_live_10928e...7d8',
      created: '2026-09-05',
      lastUsed: 'Yesterday'
    }
  ]
};

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'usr-01',
    name: 'Alexander Wright',
    email: 'a.wright@flowem-systems.com',
    role: 'Owner',
    twoFactorEnabled: true,
    status: 'Active',
    lastLogin: '2026-11-12 12:40'
  },
  {
    id: 'usr-02',
    name: 'Elena Rostova',
    email: 'e.rostova@flowem-systems.com',
    role: 'Administrator',
    twoFactorEnabled: true,
    status: 'Active',
    lastLogin: '2026-11-12 11:15'
  },
  {
    id: 'usr-03',
    name: 'Liam Chen',
    email: 'l.chen@flowem-systems.com',
    role: 'Deliverability Engineer',
    twoFactorEnabled: true,
    status: 'Active',
    lastLogin: '2026-11-12 12:05'
  },
  {
    id: 'usr-04',
    name: 'Sophia Patel',
    email: 's.patel@flowem-systems.com',
    role: 'Campaign Manager',
    twoFactorEnabled: true,
    status: 'Active',
    lastLogin: '2026-11-11 17:50'
  },
  {
    id: 'usr-05',
    name: 'Viktor Lindqvist',
    email: 'v.lindqvist@flowem-systems.com',
    role: 'Analyst',
    twoFactorEnabled: false,
    status: 'Invited',
    lastLogin: 'Never'
  }
];

export const analyticsHourlyData = [
  { time: '00:00', sent: 42000, delivered: 41920, opens: 18400, clicks: 5200, bounces: 80 },
  { time: '02:00', sent: 28000, delivered: 27950, opens: 9800, clicks: 2800, bounces: 50 },
  { time: '04:00', sent: 19000, delivered: 18970, opens: 6400, clicks: 1900, bounces: 30 },
  { time: '06:00', sent: 68000, delivered: 67880, opens: 28900, clicks: 9400, bounces: 120 },
  { time: '08:00', sent: 145000, delivered: 144780, opens: 72100, clicks: 28400, bounces: 220 },
  { time: '10:00', sent: 184000, delivered: 183690, opens: 96400, clicks: 38200, bounces: 310 },
  { time: '12:00', sent: 162000, delivered: 161740, opens: 78500, clicks: 31100, bounces: 260 },
  { time: '14:00', sent: 139000, delivered: 138790, opens: 64200, clicks: 24900, bounces: 210 },
  { time: '16:00', sent: 112000, delivered: 111840, opens: 52300, clicks: 19400, bounces: 160 },
  { time: '18:00', sent: 94000, delivered: 93880, opens: 41200, clicks: 14200, bounces: 120 },
  { time: '20:00', sent: 76000, delivered: 75910, opens: 33100, clicks: 10800, bounces: 90 },
  { time: '22:00', sent: 54000, delivered: 53930, opens: 22400, clicks: 7100, bounces: 70 }
];

export const ispDistribution = [
  { isp: 'Google Workspace / Gmail', percentage: 48.4, volume: '939,060', reputation: 'High (0.02% Spam)' },
  { isp: 'Microsoft 365 / Outlook', percentage: 32.1, volume: '622,800', reputation: 'Optimal (SNDS Green)' },
  { isp: 'Yahoo Mail / AOL', percentage: 11.2, volume: '217,300', reputation: 'Verified (CFL Compliant)' },
  { isp: 'Apple iCloud Private Relay', percentage: 5.6, volume: '108,650', reputation: 'Valid Key' },
  { isp: 'Corporate Custom MTAs', percentage: 2.7, volume: '52,400', reputation: 'Direct Handshake' }
];

