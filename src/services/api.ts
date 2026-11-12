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

const BASE_URL = '/api';

// Fetch helper without silent fallback: Backend failures and errors are surfaced directly
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    }
  });

  if (!res.ok) {
    const errText = await res.text();
    let errorMsg = `Server returned status ${res.status}`;
    try {
      const parsed = JSON.parse(errText);
      if (parsed.error) errorMsg = parsed.error;
      else if (parsed.message) errorMsg = parsed.message;
    } catch {}
    throw new Error(errorMsg);
  }

  return await res.json();
}

export const api = {
  // Health
  getHealth: () => request<{ status: string; timestamp: string; service: string; database: string }>('/health'),

  // Contacts
  getContacts: (search?: string) => request<Contact[]>(search ? `/contacts?search=${encodeURIComponent(search)}` : '/contacts'),
  addContact: (data: Partial<Contact>) => request<Contact>('/contacts', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  deleteContact: (id: string) => request<{ success: boolean; message: string }>(`/contacts/${id}`, { method: 'DELETE' }),
  importContacts: (items: any[]) => request<{ success: boolean; imported: number; failed: number; total: number }>('/contacts/import', {
    method: 'POST',
    body: JSON.stringify({ items })
  }),

  // Lists
  getLists: () => request<ContactList[]>('/lists'),
  addList: (data: Partial<ContactList>) => request<ContactList>('/lists', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  cleanList: (id: string) => request<{ success: boolean; removed: number; list: ContactList }>(`/lists/${id}/clean`, {
    method: 'POST'
  }),

  // Campaigns
  getCampaigns: () => request<Campaign[]>('/campaigns'),
  addCampaign: (data: any) => request<Campaign>('/campaigns', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateCampaignStatus: (id: string, status: string) => request<{ success: boolean; campaign: any }>(`/campaigns/${id}/status`, {
    method: 'POST',
    body: JSON.stringify({ status })
  }),

  // Templates
  getTemplates: () => request<EmailTemplate[]>('/templates'),
  addTemplate: (data: Partial<EmailTemplate>) => request<EmailTemplate>('/templates', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Automations
  getAutomations: () => request<AutomationWorkflow[]>('/automations'),
  toggleAutomation: (id: string) => request<{ success: boolean; status: string }>(`/automations/${id}/toggle`, {
    method: 'POST'
  }),
  addAutomationStep: (id: string, step: any) => request<{ success: boolean; steps: AutomationStep[] }>(`/automations/${id}/steps`, {
    method: 'POST',
    body: JSON.stringify(step)
  }),
  testAutomation: () => request<{ success: boolean; message: string }>('/automations/test', {
    method: 'POST'
  }),

  // Domains & Sender
  getDomains: () => request<SenderDomain[]>('/domains'),
  addDomain: (data: { domain: string; subdomain?: string }) => request<SenderDomain>('/domains', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  verifyDomain: (id: string) => request<{ success: boolean; domain: SenderDomain }>(`/domains/${id}/verify`, {
    method: 'POST'
  }),

  // Suppressions
  getSuppressions: () => request<SuppressionRecord[]>('/suppressions'),
  addSuppression: (data: { email: string; reason?: string; notes?: string }) => request<SuppressionRecord>('/suppressions', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  removeSuppression: (id: string) => request<{ success: boolean }>(`/suppressions/${id}`, { method: 'DELETE' }),

  // Organization
  getOrganization: () => request<OrganizationSettings>('/organization'),
  updateOrganization: (data: Partial<OrganizationSettings>) => request<OrganizationSettings>('/organization', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  createApiKey: (name: string) => request<{ id: string; name: string; prefix: string; created: string; lastUsed: string }>('/organization/keys', {
    method: 'POST',
    body: JSON.stringify({ name })
  }),
  revokeApiKey: (id: string) => request<{ success: boolean }>(`/organization/keys/${id}`, { method: 'DELETE' }),
  testWebhook: (url?: string) => request<{ success: boolean; message: string }>('/organization/webhook/test', {
    method: 'POST',
    body: JSON.stringify({ url })
  }),

  // Team
  getTeam: () => request<TeamMember[]>('/team'),
  inviteTeamMember: (data: { name: string; email: string; role: string }) => request<TeamMember>('/team', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  removeTeamMember: (id: string) => request<{ success: boolean }>(`/team/${id}`, { method: 'DELETE' }),

  // Analytics
  getAnalyticsOverview: () => request<{
    totalContacts: number;
    totalCampaigns: number;
    sentCount: number;
    deliveredCount: number;
    openedCount: number;
    clickedCount: number;
    bouncedCount: number;
    suppressionCount: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
    monthlyQuota: number;
    currentUsage: number;
  }>('/analytics/overview')
};
