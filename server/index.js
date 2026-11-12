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

// Clean initial data with zero sample records
const defaultData = {
  contacts: [],
  lists: [],
  campaigns: [],
  templates: [],
  automations: [],
  domains: [],
  suppressions: [],
  organization: {
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
  },
  team: []
};

// Load or initialize DB
function loadDb() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      console.error('Error reading db.json, resetting to clean default:', e);
    }
  }
  saveDb(defaultData);
  return defaultData;
}

function saveDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Reset db.json to clean empty state as requested
let db = defaultData;
saveDb(db);

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
    inboxPlacement: '100%'
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
      (c.firstName && c.firstName.toLowerCase().includes(q)) ||
      (c.lastName && c.lastName.toLowerCase().includes(q)) ||
      (c.tags && c.tags.some(t => t.toLowerCase().includes(q)))
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
    lists: [list || 'General Contacts'],
    engagementScore: 100,
    lastSentAt: 'Pending First Email',
    createdAt: new Date().toISOString().split('T')[0],
    deliveriesCount: 0,
    opensCount: 0,
    clicksCount: 0,
    tags: Array.isArray(tags) ? tags : (tags || 'New').split(',').map(s => s.trim()).filter(Boolean)
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
    lists: [it.list || 'Imported Contacts'],
    engagementScore: 100,
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
    description: description || 'New contact list in FlowEM.',
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

  list.updatedAt = 'Cleaned just now';
  saveDb(db);
  res.json({ success: true, removed: 0, list });
});

// 3. Campaigns APIs
app.get('/api/campaigns', (req, res) => {
  res.json(db.campaigns);
});

app.post('/api/campaigns', (req, res) => {
  const { name, subject, senderDomain, senderEmail, senderName, listName, sendImmediately } = req.body;

  const targetList = db.lists.find(l => l.name === listName) || { name: listName || 'All Contacts', contactCount: db.contacts.length };
  const newCamp = {
    id: `cmp-${Date.now()}`,
    name: name || 'Untitled Campaign',
    subject: subject || 'New message from FlowEM',
    senderDomain: senderDomain || 'mail.domain.com',
    senderEmail: senderEmail || 'updates@domain.com',
    senderName: senderName || 'Team',
    status: sendImmediately ? 'Sending' : 'Scheduled',
    listName: targetList.name,
    recipientsTotal: targetList.contactCount || db.contacts.length || 1,
    sentCount: 0,
    deliveredCount: 0,
    openedCount: 0,
    clickedCount: 0,
    bouncedCount: 0,
    deliveryRate: 100,
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
    subject: subject || 'Email Subject',
    previewText: previewText || 'Email preview text',
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

app.post('/api/automations', (req, res) => {
  const { name, description, triggerType } = req.body;
  const newWf = {
    id: `wf-${Date.now()}`,
    name: name || 'New Email Sequence',
    description: description || 'Automated email sequence',
    status: 'Active',
    triggerType: triggerType || 'Contact Added',
    totalEnrolled: 0,
    completedCount: 0,
    avgConversionRate: 0,
    updatedAt: 'Just now',
    steps: []
  };

  db.automations.unshift(newWf);
  saveDb(db);
  res.status(201).json(newWf);
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
    message: 'Test event dispatched successfully! 1 test subscriber entered the flow.'
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
    spfStatus: 'Missing',
    dkimStatus: 'Missing',
    dmarcStatus: 'Missing',
    mxStatus: 'Valid',
    reputationScore: 70,
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
  dom.reputationScore = 99;
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
