import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Key, 
  Webhook, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  X, 
  Copy,
  Send 
} from 'lucide-react';
import { MorphicCard, MorphicBadge } from '../common/MorphicCard';
import { OrganizationSettings } from '../../types';
import { api } from '../../services/api';

export const OrganizationSettingsTab: React.FC = () => {
  const [org, setOrg] = useState<OrganizationSettings | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [isAddKeyOpen, setIsAddKeyOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null);

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [complianceContact, setComplianceContact] = useState('');
  const [twoFactor, setTwoFactor] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [savedNote, setSavedNote] = useState(false);

  useEffect(() => {
    loadOrg();
  }, []);

  const loadOrg = async () => {
    const data = await api.getOrganization();
    setOrg(data);
    setCompanyName(data.companyName);
    setCompanyAddress(data.companyAddress);
    setComplianceContact(data.complianceContact);
    setTwoFactor(data.enforceTwoFactor);
    setWebhookUrl(data.webhookUrl);
  };

  const handleCopyKey = (keyId: string, prefix: string) => {
    navigator.clipboard.writeText(`${prefix}_SECRET_KEY_2026`);
    setCopiedKeyId(keyId);
    setTimeout(() => setCopiedKeyId(null), 2500);
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName || !org) return;

    const newKey = await api.createApiKey(newKeyName);
    setOrg({
      ...org,
      apiKeys: [...org.apiKeys, newKey]
    });
    setIsAddKeyOpen(false);
    setNewKeyName('');
  };

  const handleRevokeKey = async (keyId: string) => {
    if (!org) return;
    if (confirm('Delete this API Key? Any code using it will stop sending.')) {
      await api.revokeApiKey(keyId);
      setOrg({
        ...org,
        apiKeys: org.apiKeys.filter(k => k.id !== keyId)
      });
    }
  };

  const handleTestWebhook = async () => {
    const res = await api.testWebhook();
    setWebhookStatus(res.message);
    setTimeout(() => setWebhookStatus(null), 4000);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;

    const updated = await api.updateOrganization({
      companyName,
      companyAddress,
      complianceContact,
      enforceTwoFactor: twoFactor,
      webhookUrl
    });

    setOrg(updated);
    setSavedNote(true);
    setTimeout(() => setSavedNote(false), 3000);
  };

  if (!org) return null;

  const quotaPercent = Math.round((org.currentUsage / org.monthlyQuota) * 100);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Company & Account Settings
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage your company details, monthly email limit, API keys, and notification webhooks.
          </p>
        </div>

        {savedNote && (
          <div className="px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      {/* Sending Quota Meter */}
      <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-indigo-700">{org.planName}</span>
              <MorphicBadge label="Active Plan" variant="purple" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">Monthly Email Sending Quota</h3>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {org.currentUsage.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-mono"> / {org.monthlyQuota.toLocaleString()} emails used</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${quotaPercent}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-600 font-medium font-mono">
            <span>Used: {quotaPercent}%</span>
            <span>{(org.monthlyQuota - org.currentUsage).toLocaleString()} emails remaining this month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Company Profile */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl bg-white border border-slate-200 space-y-5">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-600" />
            Company Details & Legal Address
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Legal Name *</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full glass-input rounded-lg px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Physical Office Address (Required for legal email footers) *
              </label>
              <textarea
                rows={2}
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                className="w-full glass-input rounded-lg px-3 py-2 text-xs"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                This physical address is automatically placed at the bottom of sent emails to keep them out of spam.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Support & Privacy Email *</label>
              <input
                type="email"
                value={complianceContact}
                onChange={(e) => setComplianceContact(e.target.value)}
                className="w-full glass-input rounded-lg px-3 py-2 text-xs"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Require 2-Factor Authentication</div>
                <div className="text-[11px] text-slate-500">Require a security code when team members log in</div>
              </div>
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 border-slate-300"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: API Keys & Webhooks */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* API Keys */}
          <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-sky-600" />
                API Keys (Send via Code)
              </h3>
              <button
                onClick={() => setIsAddKeyOpen(true)}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Key</span>
              </button>
            </div>

            <div className="space-y-3">
              {org.apiKeys.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200">
                  <Key className="w-6 h-6 mx-auto text-slate-300 stroke-1 mb-1.5" />
                  <p className="text-xs font-semibold text-slate-700">No API keys created</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Click "New Key" above to generate credentials for programmatic email delivery.</p>
                </div>
              ) : (
                org.apiKeys.map(k => (
                  <div key={k.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{k.name}</span>
                      <button
                        onClick={() => handleRevokeKey(k.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Delete Key"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-600">{k.prefix}</span>
                      <button
                        onClick={() => handleCopyKey(k.id, k.prefix)}
                        className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-[11px] font-sans font-semibold"
                      >
                        {copiedKeyId === k.id ? (
                          <span className="text-emerald-700">Copied!</span>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Created: {k.created}</span>
                      <span>Last used: {k.lastUsed}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Webhook Endpoint */}
          <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Webhook className="w-4 h-4 text-purple-600" />
              Webhook Alerts
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Your Website Webhook URL</label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs font-mono"
                />
              </div>

              {webhookStatus && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium">
                  {webhookStatus}
                </div>
              )}

              <button
                type="button"
                onClick={handleTestWebhook}
                className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 border border-slate-200 transition flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5 text-sky-600" />
                <span>Send Test Webhook</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Add API Key Modal */}
      {isAddKeyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Create New API Key</h3>
              <button
                onClick={() => setIsAddKeyOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateKey} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Key Name *</label>
                <input
                  type="text"
                  required
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="e.g. Website Backend Key"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddKeyOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs"
                >
                  Generate Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
