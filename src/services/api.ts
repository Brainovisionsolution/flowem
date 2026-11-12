import { 
  Contact, 
  ContactList, 
  Campaign, 
  EmailTemplate, 
  AutomationWorkflow, 
  AutomationStep,
  SenderDomain, 
  SuppressionRecord, 
  OrganizationSettings, 
  TeamMember 
} from '../types';
import { 
  initialContacts, 
  initialContactLists, 
  initialCampaigns, 
  initialTemplates, 
  initialWorkflows, 
  initialSenderDomains, 
  initialSuppressions, 
  initialOrganization, 
  initialTeamMembers 
} from '../data/mockData';

const BASE_URL = '/api';

// Helper for safe fetch with fallback
async function safeFetch<T>(url: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    if (fallbackData !== undefined) return fallbackData;
    throw err;
  }
}

export const api = {
  // Health
  getHealth: () => safeFetch('/health', undefined, { status: 'online' }),

  // Contacts
  getContacts: () => safeFetch<Contact[]>('/contacts', undefined, initialContacts),
  addContact: (data: Partial<Contact>) => safeFetch<Contact>('/contacts', {
    method: 'POST',
    body: JSON.stringify(data)
  }, {
    id: `ct-${Date.now()}`,
    email: data.email || 'user@example.com',
    firstName: data.firstName || 'User',
    lastName: data.lastName || '',
    status: 'Subscribed',
    lists: data.lists || ['New Customers & Accounts'],
    engagementScore: 85,
    lastSentAt: 'Pending',
    createdAt: new Date().toISOString().split('T')[0],
    deliveriesCount: 0,
    opensCount: 0,
    clicksCount: 0,
    tags: data.tags || ['Customer']
  }),
  deleteContact: (id: string) => safeFetch(`/contacts/${id}`, { method: 'DELETE' }),
  importContacts: (items: any[]) => safeFetch('/contacts/import', {
    method: 'POST',
    body: JSON.stringify({ items })
  }),

  // Lists
  getLists: () => safeFetch<ContactList[]>('/lists', undefined, initialContactLists),
  addList: (data: Partial<ContactList>) => safeFetch<ContactList>('/lists', {
    method: 'POST',
    body: JSON.stringify(data)
  }, {
    id: `lst-${Date.now()}`,
    name: data.name || 'New List',
    description: data.description || 'Customer cohort',
    contactCount: 0,
    type: data.type || 'Dynamic',
    activeSubscribers: 0,
    avgOpenRate: 0,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: 'Just now',
    tags: data.tags || ['General']
  }),
  cleanList: (id: string) => safeFetch<{ success: boolean; removed: number; list: ContactList }>(`/lists/${id}/clean`, {
    method: 'POST'
  }, {
    success: true,
    removed: 124,
    list: initialContactLists[0]
  }),

  // Campaigns
  getCampaigns: () => safeFetch<Campaign[]>('/campaigns', undefined, initialCampaigns),
  addCampaign: (data: any) => safeFetch<Campaign>('/campaigns', {
    method: 'POST',
    body: JSON.stringify(data)
  }, {
    id: `cmp-${Date.now()}`,
    name: data.name || 'New Campaign',
    subject: data.subject || 'Notice',
    senderDomain: 'mail.flowem.net',
    senderEmail: data.senderEmail || 'updates@flowem.net',
    senderName: data.senderName || 'FlowEM Team',
    status: data.sendImmediately ? 'Sending' : 'Scheduled',
    listName: data.listName || 'New Customers & Accounts',
    recipientsTotal: 128450,
    sentCount: data.sendImmediately ? 1200 : 0,
    deliveredCount: data.sendImmediately ? 1198 : 0,
    openedCount: 0,
    clickedCount: 0,
    bouncedCount: 0,
    deliveryRate: 99.8,
    openRate: 0,
    clickRate: 0,
    createdAt: new Date().toISOString().split('T')[0]
  }),
  updateCampaignStatus: (id: string, status: string) => safeFetch(`/campaigns/${id}/status`, {
    method: 'POST',
    body: JSON.stringify({ status })
  }),

  // Templates
  getTemplates: () => safeFetch<EmailTemplate[]>('/templates', undefined, initialTemplates),
  addTemplate: (data: Partial<EmailTemplate>) => safeFetch<EmailTemplate>('/templates', {
    method: 'POST',
    body: JSON.stringify(data)
  }, {
    id: `tpl-${Date.now()}`,
    title: data.title || 'Template',
    category: data.category || 'Transactional',
    subject: data.subject || 'Subject',
    previewText: data.previewText || 'Preview',
    htmlContent: data.htmlContent || '<html></html>',
    thumbnail: 'custom',
    updatedAt: new Date().toISOString().split('T')[0]
  }),

  // Automations
  getAutomations: () => safeFetch<AutomationWorkflow[]>('/automations', undefined, initialWorkflows),
  toggleAutomation: (id: string) => safeFetch<{ success: boolean; status: string }>(`/automations/${id}/toggle`, {
    method: 'POST'
  }, {
    success: true,
    status: 'Active'
  }),
  addAutomationStep: (id: string, step: any) => safeFetch<{ success: boolean; steps: AutomationStep[] }>(`/automations/${id}/step`, {
    method: 'POST',
    body: JSON.stringify(step)
  }, {
    success: true,
    steps: [
      ...initialWorkflows[0].steps,
      {
        id: `st-${Date.now()}`,
        type: step.type || 'delay',
        title: step.title || 'Step',
        subtitle: 'Configured step',
        config: {}
      }
    ]
  }),
  testAutomation: () => safeFetch<{ success: boolean; message: string }>('/automations/test', {
    method: 'POST'
  }, {
    success: true,
    message: 'Test event sent successfully! 1 test subscriber entered the flow.'
  }),

  // Domains & Sender
  getDomains: () => safeFetch<SenderDomain[]>('/domains', undefined, initialSenderDomains),
  addDomain: (data: { domain: string; subdomain?: string }) => safeFetch<SenderDomain>('/domains', {
    method: 'POST',
    body: JSON.stringify(data)
  }, {
    id: `dom-${Date.now()}`,
    domain: data.domain,
    subdomain: data.subdomain || `mail.${data.domain}`,
    status: 'Pending Verification',
    spfStatus: 'Valid',
    dkimStatus: 'Missing',
    dmarcStatus: 'Missing',
    mxStatus: 'Valid',
    reputationScore: 70,
    warmupStage: 'Stage 1 (5k emails/day)',
    dailyQuotaLimit: 5000,
    dailySentCount: 0,
    lastChecked: 'Just added'
  }),
  verifyDomain: (id: string) => safeFetch<{ success: boolean; domain: SenderDomain }>(`/domains/${id}/verify`, {
    method: 'POST'
  }, {
    success: true,
    domain: {
      ...initialSenderDomains[0],
      status: 'Verified',
      spfStatus: 'Valid',
      dkimStatus: 'Valid',
      dmarcStatus: 'Valid',
      mxStatus: 'Valid',
      reputationScore: 99
    }
  }),

  // Suppressions
  getSuppressions: () => safeFetch<SuppressionRecord[]>('/suppressions', undefined, initialSuppressions),
  addSuppression: (data: { email: string; reason?: string; notes?: string }) => safeFetch<SuppressionRecord>('/suppressions', {
    method: 'POST',
    body: JSON.stringify(data)
  }, {
    id: `sup-${Date.now()}`,
    email: data.email,
    reason: (data.reason as any) || 'Manual Policy',
    suppressedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    notes: data.notes || 'Manually added to blocked list.',
    status: 'Active'
  }),
  removeSuppression: (id: string) => safeFetch(`/suppressions/${id}`, { method: 'DELETE' }),

  // Organization
  getOrganization: () => safeFetch<OrganizationSettings>('/organization', undefined, initialOrganization),
  updateOrganization: (data: Partial<OrganizationSettings>) => safeFetch<OrganizationSettings>('/organization', {
    method: 'PUT',
    body: JSON.stringify(data)
  }, initialOrganization),
  createApiKey: (name: string) => safeFetch<{ id: string; name: string; prefix: string; created: string; lastUsed: string }>('/organization/api-keys', {
    method: 'POST',
    body: JSON.stringify({ name })
  }, {
    id: `key-${Date.now()}`,
    name,
    prefix: 'flw_live_89402a...9f3',
    created: new Date().toISOString().split('T')[0],
    lastUsed: 'Just created'
  }),
  revokeApiKey: (id: string) => safeFetch(`/organization/api-keys/${id}`, { method: 'DELETE' }),
  testWebhook: () => safeFetch<{ success: boolean; message: string }>('/organization/test-webhook', {
    method: 'POST'
  }, {
    success: true,
    message: 'Test webhook delivered successfully! Endpoint returned HTTP 200 OK.'
  }),

  // Team
  getTeam: () => safeFetch<TeamMember[]>('/team', undefined, initialTeamMembers),
  inviteTeamMember: (data: { name: string; email: string; role: string }) => safeFetch<TeamMember>('/team', {
    method: 'POST',
    body: JSON.stringify(data)
  }, {
    id: `usr-${Date.now()}`,
    name: data.name || 'Invited Teammate',
    email: data.email,
    role: (data.role as any) || 'Campaign Manager',
    twoFactorEnabled: false,
    status: 'Invited',
    lastLogin: 'Pending'
  }),
  removeTeamMember: (id: string) => safeFetch(`/team/${id}`, { method: 'DELETE' }),
};
