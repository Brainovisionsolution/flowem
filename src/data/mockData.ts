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

export const initialContacts: Contact[] = [];

export const initialContactLists: ContactList[] = [];

export const initialCampaigns: Campaign[] = [];

export const initialTemplates: EmailTemplate[] = [];

export const initialWorkflows: AutomationWorkflow[] = [];

export const initialSenderDomains: SenderDomain[] = [];

export const initialSuppressions: SuppressionRecord[] = [];

export const initialOrganization: OrganizationSettings = {
  companyName: '',
  companyAddress: '',
  complianceContact: '',
  timeZone: 'UTC',
  monthlyQuota: 50000,
  currentUsage: 0,
  planName: 'Starter Plan',
  enforceTwoFactor: false,
  webhookUrl: '',
  apiKeys: []
};

export const initialTeamMembers: TeamMember[] = [];

export const analyticsHourlyData = [
  { time: '00:00', sent: 0, delivered: 0, opens: 0, clicks: 0, bounces: 0 },
  { time: '04:00', sent: 0, delivered: 0, opens: 0, clicks: 0, bounces: 0 },
  { time: '08:00', sent: 0, delivered: 0, opens: 0, clicks: 0, bounces: 0 },
  { time: '12:00', sent: 0, delivered: 0, opens: 0, clicks: 0, bounces: 0 },
  { time: '16:00', sent: 0, delivered: 0, opens: 0, clicks: 0, bounces: 0 },
  { time: '20:00', sent: 0, delivered: 0, opens: 0, clicks: 0, bounces: 0 },
  { time: '23:59', sent: 0, delivered: 0, opens: 0, clicks: 0, bounces: 0 }
];

export const ispDistribution: { isp: string; percentage: number; volume: string; reputation: string }[] = [];
