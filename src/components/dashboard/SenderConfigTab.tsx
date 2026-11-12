import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  RefreshCw, 
  Server, 
  X,
  CheckCircle2
} from 'lucide-react';
import { MorphicBadge } from '../common/MorphicCard';
import { SenderDomain } from '../../types';
import { api } from '../../services/api';

export const SenderConfigTab: React.FC = () => {
  const [domains, setDomains] = useState<SenderDomain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<SenderDomain | null>(null);
  const [isAddDomainOpen, setIsAddDomainOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [newDomainInput, setNewDomainInput] = useState('');
  const [newSubdomainInput, setNewSubdomainInput] = useState('');

  useEffect(() => {
    loadDomains();
  }, []);

  const loadDomains = async () => {
    const data = await api.getDomains();
    setDomains(data);
    if (data.length > 0) setSelectedDomain(data[0]);
  };

  const handleVerifyDns = async (domainId: string) => {
    setIsVerifying(true);
    const res = await api.verifyDomain(domainId);
    setDomains(domains.map(d => d.id === domainId ? res.domain : d));
    if (selectedDomain?.id === domainId) setSelectedDomain(res.domain);
    setIsVerifying(false);
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainInput) return;

    const saved = await api.addDomain({
      domain: newDomainInput,
      subdomain: newSubdomainInput || `mail.${newDomainInput}`
    });

    setDomains([...domains, saved]);
    setSelectedDomain(saved);
    setIsAddDomainOpen(false);
    setNewDomainInput('');
    setNewSubdomainInput('');
  };

  if (!selectedDomain) return null;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Sender & Domain Setup
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Connect your custom domain and verify SPF, DKIM, and DMARC to make sure emails reach the Inbox.
          </p>
        </div>

        <button
          onClick={() => setIsAddDomainOpen(true)}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Domain</span>
        </button>
      </div>

      {/* Domains Table */}
      <div className="glass-panel rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Registered Domains ({domains.length})</h3>
          <span className="text-xs text-slate-500 font-medium">Domain Health: 98% Optimal</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-bold text-[11px]">
              <tr>
                <th className="py-3 px-4">Domain</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">SPF</th>
                <th className="py-3 px-4">DKIM</th>
                <th className="py-3 px-4">DMARC</th>
                <th className="py-3 px-4">Warm-Up Stage</th>
                <th className="py-3 px-4">Reputation</th>
                <th className="py-3 px-4 text-right">Check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {domains.map(dom => (
                <tr
                  key={dom.id}
                  onClick={() => setSelectedDomain(dom)}
                  className={`hover:bg-slate-50 transition cursor-pointer ${
                    selectedDomain.id === dom.id ? 'bg-indigo-50/60' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{dom.subdomain}</div>
                    <div className="text-[11px] text-slate-400 font-mono">Main: {dom.domain}</div>
                  </td>
                  <td className="py-3 px-4">
                    <MorphicBadge
                      label={dom.status}
                      variant={dom.status === 'Verified' ? 'success' : 'warning'}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-mono text-xs font-bold ${dom.spfStatus === 'Valid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {dom.spfStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-mono text-xs font-bold ${dom.dkimStatus === 'Valid' ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {dom.dkimStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-mono text-xs font-bold ${dom.dmarcStatus === 'Valid' ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {dom.dmarcStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-800 font-medium">{dom.warmupStage}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {dom.dailySentCount.toLocaleString()} / {dom.dailyQuotaLimit > 0 ? dom.dailyQuotaLimit.toLocaleString() : 'Unlimited'} sent today
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold font-mono text-emerald-700 text-sm">
                      {dom.reputationScore} / 100
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVerifyDns(dom.id);
                      }}
                      disabled={isVerifying}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-indigo-700 border border-slate-200 disabled:opacity-50 inline-flex items-center gap-1"
                    >
                      <RefreshCw className={`w-3 h-3 ${isVerifying ? 'animate-spin' : ''}`} />
                      <span>Check DNS</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DNS Configuration Records & Warmup Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* DNS Records */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                DNS Records for {selectedDomain.subdomain}
              </h3>
              <p className="text-xs text-slate-500">Copy and paste these 3 lines into your domain settings (GoDaddy, Namecheap, Cloudflare, etc.).</p>
            </div>
            <button
              onClick={() => handleVerifyDns(selectedDomain.id)}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Re-check DNS
            </button>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* SPF Record */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex justify-between items-center text-[11px] font-sans font-bold text-slate-700">
                <span>1. SPF Record (Sender Authorization)</span>
                <span className="text-emerald-700 font-mono">Working</span>
              </div>
              <div className="p-2 rounded bg-white text-slate-800 border border-slate-200 overflow-x-auto">
                Host: <span className="text-indigo-700 font-bold">@</span> | Value: <span className="text-sky-700">v=spf1 include:_spf.flowem.net ~all</span>
              </div>
            </div>

            {/* DKIM Record */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex justify-between items-center text-[11px] font-sans font-bold text-slate-700">
                <span>2. DKIM Key (Domain Key Signature)</span>
                <span className="text-emerald-700 font-mono">Verified</span>
              </div>
              <div className="p-2 rounded bg-white text-slate-800 border border-slate-200 overflow-x-auto">
                Host: <span className="text-indigo-700 font-bold">flw2026._domainkey</span> | Value: <span className="text-sky-700">v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8...</span>
              </div>
            </div>

            {/* DMARC Record */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex justify-between items-center text-[11px] font-sans font-bold text-slate-700">
                <span>3. DMARC Policy (Anti-Spoofing Rule)</span>
                <span className="text-emerald-700 font-mono">Protected</span>
              </div>
              <div className="p-2 rounded bg-white text-slate-800 border border-slate-200 overflow-x-auto">
                Host: <span className="text-indigo-700 font-bold">_dmarc</span> | Value: <span className="text-sky-700">v=DMARC1; p=reject; rua=mailto:dmarc@flowem.net</span>
              </div>
            </div>
          </div>
        </div>

        {/* Safe Warm-Up Ramping */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-4 h-4 text-sky-600" />
            Automatic IP Warm-Up
          </h3>

          <p className="text-xs text-slate-500 leading-relaxed">
            Sending too many emails on a new domain can trigger spam flags. FlowEM automatically raises your daily email limit as your domain gets trusted.
          </p>

          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex justify-between text-xs text-slate-700 font-semibold mb-1">
                <span>Current Daily Limit Used</span>
                <span className="font-mono text-emerald-700 font-bold">92%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-900">Your Dedicated Mail Server IPs:</div>
              <div className="font-mono text-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span>198.51.100.24 (Primary Server)</span>
                  <span className="text-emerald-700 font-bold">Clean & Fast</span>
                </div>
                <div className="flex justify-between">
                  <span>198.51.100.25 (Backup Server)</span>
                  <span className="text-emerald-700 font-bold">Clean & Fast</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Add Custom Domain Modal */}
      {isAddDomainOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Add Sending Domain</h3>
              <button
                onClick={() => setIsAddDomainOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDomain} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Domain *</label>
                <input
                  type="text"
                  required
                  value={newDomainInput}
                  onChange={(e) => setNewDomainInput(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="company.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sending Subdomain</label>
                <input
                  type="text"
                  value={newSubdomainInput}
                  onChange={(e) => setNewSubdomainInput(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="mail.company.com"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Using a subdomain like "mail.company.com" protects your main website email.
                </p>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddDomainOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs"
                >
                  Save Domain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
