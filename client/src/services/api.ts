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

// Token in memory & localStorage for fallback bearer transmission
let currentToken = typeof window !== 'undefined' ? localStorage.getItem('flowem_auth_token') || '' : '';

export function setAuthToken(token: string | null) {
  currentToken = token || '';
  if (typeof window !== 'undefined') {
    if (token) localStorage.setItem('flowem_auth_token', token);
    else localStorage.removeItem('flowem_auth_token');
  }
}

export function getAuthToken() {
  return currentToken;
}

// Fetch helper transmitting both HTTP-only cookies and Authorization headers
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as any || {})
  };

  if (currentToken) {
    headers['Authorization'] = `Bearer ${currentToken}`;
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers
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

  // Authentication (Single Admin Portal)
  login: async (email: string, password: string) => {
    const res = await request<{ token: string; user: { id: string; email: string; name: string; role: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.token) {
      setAuthToken(res.token);
    }
    return res;
  },
  logout: async () => {
    try {
      await request<{ success: boolean; message: string }>('/auth/logout', {
        method: 'POST'
      });
    } finally {
      setAuthToken(null);
    }
    return { success: true };
  },
  getMe: () => request<{ id: string; email: string; name: string; role: string; status: string; twoFactorEnabled: boolean }>('/auth/me'),

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
  updateTemplate: (id: string, data: Partial<EmailTemplate>) => request<EmailTemplate>(`/templates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteTemplate: (id: string) => request<{ success: boolean; message: string }>(`/templates/${id}`, {
    method: 'DELETE'
  }),
  sendBulkWithTemplate: (data: {
    templateId: string;
    senderEmail?: string;
    senderName?: string;
    subject?: string;
    recipients: Array<{ email: string; firstName?: string; lastName?: string }>;
  }) => request<{
    success: boolean;
    campaignId: string;
    campaignName: string;
    totalRecipients: number;
    totalSent: number;
    senderEmail: string;
    message: string;
  }>('/templates/send-bulk', {
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

  // Team (Single Admin Mode)
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
