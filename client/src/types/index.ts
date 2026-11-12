export type NavigationTab = 
  | 'overview'
  | 'contacts'
  | 'contact-lists'
  | 'campaigns'
  | 'templates'
  | 'automation'
  | 'analytics'
  | 'sender-config'
  | 'suppression'
  | 'organization'
  | 'user-management';

export interface Contact {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: 'Subscribed' | 'Unsubscribed' | 'Bounced' | 'Complained';
  lists: string[];
  engagementScore: number; // 0 - 100
  lastSentAt: string;
  createdAt: string;
  deliveriesCount: number;
  opensCount: number;
  clicksCount: number;
  tags: string[];
}

export interface ContactList {
  id: string;
  name: string;
  description: string;
  contactCount: number;
  type: 'Static' | 'Dynamic';
  activeSubscribers: number;
  avgOpenRate: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  senderDomain: string;
  senderEmail: string;
  senderName: string;
  status: 'Draft' | 'Scheduled' | 'Sending' | 'Completed' | 'Paused';
  listName: string;
  recipientsTotal: number;
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  bouncedCount: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  scheduledFor?: string;
  sentAt?: string;
  createdAt: string;
}

export interface EmailTemplate {
  id: string;
  title: string;
  category: 'Transactional' | 'Marketing' | 'Newsletter' | 'System Alerts' | 'Product Launch';
  subject: string;
  previewText: string;
  htmlContent: string;
  thumbnail: string;
  updatedAt: string;
  isPopular?: boolean;
}

export interface AutomationStep {
  id: string;
  type: 'trigger' | 'delay' | 'condition' | 'email' | 'webhook' | 'tag';
  title: string;
  subtitle: string;
  config: Record<string, any>;
  nextStepId?: string;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Draft' | 'Paused';
  triggerType: 'Contact Added' | 'Tag Applied' | 'API Event' | 'Email Clicked';
  totalEnrolled: number;
  completedCount: number;
  avgConversionRate: number;
  updatedAt: string;
  steps: AutomationStep[];
}

export interface SenderDomain {
  id: string;
  domain: string;
  subdomain: string;
  status: 'Verified' | 'Pending Verification' | 'Failed';
  spfStatus: 'Valid' | 'Missing' | 'Invalid';
  dkimStatus: 'Valid' | 'Missing' | 'Invalid';
  dmarcStatus: 'Valid' | 'Missing' | 'Invalid';
  mxStatus: 'Valid' | 'Missing' | 'Invalid';
  reputationScore: number; // 0 - 100
  warmupStage: string;
  dailyQuotaLimit: number;
  dailySentCount: number;
  lastChecked: string;
}

export interface SuppressionRecord {
  id: string;
  email: string;
  reason: 'Hard Bounce' | 'Unsubscribe Request' | 'Spam Complaint' | 'Manual Policy';
  sourceCampaign?: string;
  suppressedAt: string;
  notes: string;
  status: 'Active' | 'Revoked';
}

export interface OrganizationSettings {
  companyName: string;
  companyAddress: string;
  complianceContact: string;
  timeZone: string;
  monthlyQuota: number;
  currentUsage: number;
  planName: string;
  enforceTwoFactor: boolean;
  webhookUrl: string;
  apiKeys: {
    id: string;
    name: string;
    prefix: string;
    created: string;
    lastUsed: string;
  }[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Administrator' | 'Campaign Creator' | 'Deliverability Engineer' | 'Campaign Manager' | 'Analyst' | 'Viewer';
  twoFactorEnabled: boolean;
  status: 'Active' | 'Invited' | 'Suspended';
  lastLogin: string;
}

