import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Server, 
  Key, 
  Globe, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { MorphicCard, MorphicBadge } from '../common/MorphicCard';
import { initialSenderDomains } from '../../data/mockData';
import { SenderDomain } from '../../types';

export const SenderConfigTab: React.FC = () => {
  const [domains, setDomains] = useState<SenderDomain[]>(initialSenderDomains);
  const [selectedDomain, setSelectedDomain] = useState<SenderDomain>(initialSenderDomains[0]);
  const [isAddDomainOpen, setIsAddDomainOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [newDomainInput, setNewDomainInput] = useState('');
  const [newSubdomainInput, setNewSubdomainInput] = useState('');

  const handleVerifyDns = (domainId: string) => {
    setIsVerifying(true);
    setTimeout(() => {
      setDomains(prev => prev.map(d => {
        if (d.id === domainId) {
          return {
            ...d,
            status: 'Verified',
            spfStatus: 'Valid',
            dkimStatus: 'Valid',
            dmarcStatus: 'Valid',
            mxStatus: 'Valid',
            reputationScore: 97,
            lastChecked: 'Just now'
          };
        }
        return d;
      }));
      setIsVerifying(false);
    }, 700);
  };

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainInput) return;

    const newDom: SenderDomain = {
      id: `dom-${Date.now()}`,
      domain: newDomainInput,
      subdomain: newSubdomainInput || `mail.${newDomainInput}`,
      status: 'Pending Verification',
      spfStatus: 'Missing',
      dkimStatus: 'Missing',
      dmarcStatus: 'Missing',
      mxStatus: 'Valid',
      reputationScore: 70,
      warmupStage: 'Stage 1 Warmup (5k/day)',
      dailyQuotaLimit: 5000,
      dailySentCount: 0,
      lastChecked: 'Just added'
    };

    setDomains([...domains, newDom]);
    setSelectedDomain(newDom);
    setIsAddDomainOpen(false);
    setNewDomainInput('');
    setNewSubdomainInput('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Sender Authentication & Domain Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure RFC-compliant SPF, DKIM 2048-bit, DMARC records, and dedicated IP warm-up ramps.
          </p>
        </div>

        <button
          onClick={() => setIsAddDomainOpen(true)}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition shadow-glow-indigo flex items-center gap-2 border border-indigo-400/40"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Domain</span>
        </button>
      </div>

      {/* Domains Table */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Registered Sender Domains ({domains.length})</h3>
          <span className="text-xs text-slate-400">Target Deliverability Score: &gt; 95</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Domain / Subdomain</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">SPF</th>
                <th className="py-3.5 px-4">DKIM</th>
                <th className="py-3.5 px-4">DMARC</th>
                <th className="py-3.5 px-4">Warm-Up Stage</th>
                <th className="py-3.5 px-4">Reputation</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {domains.map(dom => (
                <tr
                  key={dom.id}
                  onClick={() => setSelectedDomain(dom)}
                  className={`hover:bg-slate-800/40 transition cursor-pointer ${
                    selectedDomain.id === dom.id ? 'bg-indigo-600/10' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{dom.subdomain}</div>
                    <div className="text-[11px] text-slate-400 font-mono">Apex: {dom.domain}</div>
                  </td>
                  <td className="py-3 px-4">
                    <MorphicBadge
                      label={dom.status}
                      variant={dom.status === 'Verified' ? 'success' : 'warning'}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-mono text-xs ${dom.spfStatus === 'Valid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {dom.spfStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-mono text-xs ${dom.dkimStatus === 'Valid' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {dom.dkimStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-mono text-xs ${dom.dmarcStatus === 'Valid' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {dom.dmarcStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-200">{dom.warmupStage}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {dom.dailySentCount.toLocaleString()} / {dom.dailyQuotaLimit > 0 ? dom.dailyQuotaLimit.toLocaleString() : 'Uncapped'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold font-mono text-emerald-400 text-sm">
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
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-indigo-300 border border-slate-700 disabled:opacity-50 inline-flex items-center gap-1"
                    >
                      <RefreshCw className={`w-3 h-3 ${isVerifying ? 'animate-spin' : ''}`} />
                      <span>Verify</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Domain DNS Configuration Records & Warmup Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* DNS Records Inspector */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-base font-semibold text-white">
                DNS Authentication Records for {selectedDomain.subdomain}
              </h3>
              <p className="text-xs text-slate-400">Publish these entries at your domain DNS registrar.</p>
            </div>
            <button
              onClick={() => handleVerifyDns(selectedDomain.id)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Re-scan DNS
            </button>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* SPF Record */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center text-[11px] text-slate-400">
                <span className="font-semibold text-slate-200">TXT (SPF - Sender Policy Framework)</span>
                <span className="text-emerald-400">Record Active</span>
              </div>
              <div className="p-2 rounded bg-black/40 text-slate-300 overflow-x-auto">
                Host: <span className="text-indigo-300">@</span> | Value: <span className="text-cyan-300">v=spf1 include:_spf.flowem.net ~all</span>
              </div>
            </div>

            {/* DKIM Record */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center text-[11px] text-slate-400">
                <span className="font-semibold text-slate-200">TXT (DKIM 2048-Bit Public Key)</span>
                <span className="text-emerald-400">Aligned</span>
              </div>
              <div className="p-2 rounded bg-black/40 text-slate-300 overflow-x-auto">
                Host: <span className="text-indigo-300">flw2026._domainkey</span> | Value: <span className="text-cyan-300">v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAx4...</span>
              </div>
            </div>

            {/* DMARC Record */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center text-[11px] text-slate-400">
                <span className="font-semibold text-slate-200">TXT (DMARC Policy)</span>
                <span className="text-emerald-400">Policy: Reject</span>
              </div>
              <div className="p-2 rounded bg-black/40 text-slate-300 overflow-x-auto">
                Host: <span className="text-indigo-300">_dmarc</span> | Value: <span className="text-cyan-300">v=DMARC1; p=reject; rua=mailto:dmarc-reports@flowem.net; pct=100</span>
              </div>
            </div>

            {/* MX Record */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center text-[11px] text-slate-400">
                <span className="font-semibold text-slate-200">MX (Feedback & Bounce Return-Path)</span>
                <span className="text-emerald-400">Priority 10</span>
              </div>
              <div className="p-2 rounded bg-black/40 text-slate-300 overflow-x-auto">
                Host: <span className="text-indigo-300">dispatch</span> | Value: <span className="text-cyan-300">feedback-mta.flowem.net (Priority 10)</span>
              </div>
            </div>
          </div>
        </div>

        {/* IP Warm-Up Protocol Ramping */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            Dedicated IP Warm-Up Schedule
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            FlowEM dynamically throttles volume to comply with automated ISP spam filter thresholds.
          </p>

          <div className="space-y-3 pt-1">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Current Stage Progression</span>
                <span className="font-mono text-emerald-400">92% of Stage Limit</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
              <div className="font-semibold text-white">Assigned Dedicated IP Addresses:</div>
              <div className="font-mono text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span>198.51.100.24 (US-East Cluster)</span>
                  <span className="text-emerald-400">Clean (0 Blacklists)</span>
                </div>
                <div className="flex justify-between">
                  <span>198.51.100.25 (EU-Central Cluster)</span>
                  <span className="text-emerald-400">Clean (0 Blacklists)</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-800/30 text-xs text-indigo-300">
              Automated feedback loops active for Yahoo CFL, Microsoft SNDS, and Spamhaus DBL.
            </div>
          </div>
        </div>

      </div>

      {/* Add Custom Domain Modal */}
      {isAddDomainOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-semibold text-white">Add Sending Domain</h3>
              <button
                onClick={() => setIsAddDomainOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDomain} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Apex Domain *</label>
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
                <label className="block text-xs font-medium text-slate-300 mb-1">Sending Subdomain</label>
                <input
                  type="text"
                  value={newSubdomainInput}
                  onChange={(e) => setNewSubdomainInput(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="dispatch.company.com"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Using a dedicated subdomain protects your main corporate apex domain reputation.
                </p>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddDomainOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-glow-indigo"
                >
                  Register Domain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
