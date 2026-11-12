import React, { useState } from 'react';
import { 
  Building, 
  Key, 
  Webhook, 
  ShieldCheck, 
  Copy, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  X, 
  Lock, 
  Globe, 
  Send 
} from 'lucide-react';
import { MorphicCard, MorphicBadge } from '../common/MorphicCard';
import { initialOrganization } from '../../data/mockData';
import { OrganizationSettings } from '../../types';

export const OrganizationSettingsTab: React.FC = () => {
  const [org, setOrg] = useState<OrganizationSettings>(initialOrganization);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [isAddKeyOpen, setIsAddKeyOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [webhookTestStatus, setWebhookTestStatus] = useState<string | null>(null);

  // Form states
  const [companyName, setCompanyName] = useState(org.companyName);
  const [companyAddress, setCompanyAddress] = useState(org.companyAddress);
  const [complianceContact, setComplianceContact] = useState(org.complianceContact);
  const [twoFactor, setTwoFactor] = useState(org.enforceTwoFactor);
  const [webhookUrl, setWebhookUrl] = useState(org.webhookUrl);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleCopyKey = (keyId: string, prefix: string) => {
    navigator.clipboard.writeText(`${prefix}_SECRET_TOKEN_2026`);
    setCopiedKeyId(keyId);
    setTimeout(() => setCopiedKeyId(null), 2500);
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;

    const newKey = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      prefix: `flw_live_${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 5)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never'
    };

    setOrg(prev => ({
      ...prev,
      apiKeys: [...prev.apiKeys, newKey]
    }));

    setIsAddKeyOpen(false);
    setNewKeyName('');
  };

  const handleRevokeKey = (keyId: string) => {
    if (confirm('Revoke this API Key immediately? Systems using this token will fail to authenticate.')) {
      setOrg(prev => ({
        ...prev,
        apiKeys: prev.apiKeys.filter(k => k.id !== keyId)
      }));
    }
  };

  const handleTestWebhook = () => {
    setWebhookTestStatus('Dispatching HMAC-signed ping event...');
    setTimeout(() => {
      setWebhookTestStatus('Webhook delivered successfully: HTTP 200 OK from endpoint.');
      setTimeout(() => setWebhookTestStatus(null), 4000);
    }, 800);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setOrg(prev => ({
      ...prev,
      companyName,
      companyAddress,
      complianceContact,
      enforceTwoFactor: twoFactor,
      webhookUrl
    }));
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const quotaPercent = Math.round((org.currentUsage / org.monthlyQuota) * 100);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Organization & System Settings
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage corporate identity, monthly transmission quotas, API key rotation, and webhook callbacks.
          </p>
        </div>

        {savedNotification && (
          <div className="px-3.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Settings persisted successfully.</span>
          </div>
        )}
      </div>

      {/* Sending Quota Meter Card */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-indigo-400">{org.planName}</span>
              <MorphicBadge label="Active Contract" variant="purple" />
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">Monthly Dispatch Quota Utilization</h3>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-white">
              {org.currentUsage.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-mono"> / {org.monthlyQuota.toLocaleString()} Emails</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${quotaPercent}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>Utilization: {quotaPercent}%</span>
            <span>{(org.monthlyQuota - org.currentUsage).toLocaleString()} Dispatches Remaining</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Corporate & Compliance Profile */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-white/5 space-y-5">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-400" />
            Corporate Entity & Compliance Profile
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Company Registered Legal Name *</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full glass-input rounded-lg px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Physical Headquarters Address (CAN-SPAM Mandatory) *
              </label>
              <textarea
                rows={2}
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                className="w-full glass-input rounded-lg px-3 py-2 text-xs"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                This exact physical address is automatically inserted into outbound email footers to satisfy federal CAN-SPAM mandates.
              </p>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Data Protection Officer / Compliance Contact *</label>
              <input
                type="email"
                value={complianceContact}
                onChange={(e) => setComplianceContact(e.target.value)}
                className="w-full glass-input rounded-lg px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Workspace Timezone</label>
              <input
                type="text"
                disabled
                value={org.timeZone}
                className="w-full glass-input rounded-lg px-3 py-2 text-xs opacity-75 cursor-not-allowed bg-slate-900"
              />
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-200">Mandate Hardware 2FA</div>
                <div className="text-[11px] text-slate-400">Require FIDO2 / TOTP for all team logins</div>
              </div>
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition shadow-glow-indigo"
              >
                Save Organization Profile
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: API Keys & Webhooks */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* API Keys */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                REST API Dispatch Keys
              </h3>
              <button
                onClick={() => setIsAddKeyOpen(true)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Key</span>
              </button>
            </div>

            <div className="space-y-3">
              {org.apiKeys.map(k => (
                <div key={k.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">{k.name}</span>
                    <button
                      onClick={() => handleRevokeKey(k.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Revoke Key"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono bg-black/40 p-2 rounded border border-slate-800">
                    <span className="text-slate-400">{k.prefix}</span>
                    <button
                      onClick={() => handleCopyKey(k.id, k.prefix)}
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px]"
                    >
                      {copiedKeyId === k.id ? (
                        <span className="text-emerald-400 font-sans">Copied!</span>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="font-sans">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Created: {k.created}</span>
                    <span>Last used: {k.lastUsed}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Webhook Configuration */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Webhook className="w-4 h-4 text-purple-400" />
              Event Webhook Endpoint
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Target Endpoint URL</label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs font-mono"
                />
              </div>

              {webhookTestStatus && (
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px]">
                  {webhookTestStatus}
                </div>
              )}

              <button
                type="button"
                onClick={handleTestWebhook}
                className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5 text-cyan-400" />
                <span>Dispatch Test Webhook Ping</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Add API Key Modal */}
      {isAddKeyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-semibold text-white">Generate Dispatch API Token</h3>
              <button
                onClick={() => setIsAddKeyOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateKey} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Token Identifier Name *</label>
                <input
                  type="text"
                  required
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="e.g. Production Backend Worker"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Access Scope</label>
                <select className="w-full glass-input rounded-lg px-3 py-2 text-xs bg-slate-900">
                  <option>Full Transmission & Campaign Authority</option>
                  <option>Transactional Dispatch Only</option>
                  <option>Read-Only Analytics Telemetry</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddKeyOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-glow-indigo"
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
