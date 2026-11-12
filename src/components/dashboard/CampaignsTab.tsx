import React, { useState } from 'react';
import { 
  Send, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  Pause, 
  Play, 
  Copy, 
  ArrowRight, 
  X, 
  Calendar, 
  Mail, 
  Layers, 
  ShieldCheck, 
  Sliders
} from 'lucide-react';
import { MorphicCard, MorphicBadge } from '../common/MorphicCard';
import { initialCampaigns, initialContactLists, initialTemplates, initialSenderDomains } from '../../data/mockData';
import { Campaign } from '../../types';

interface CampaignsTabProps {
  isWizardOpen?: boolean;
  onCloseWizard?: () => void;
}

export const CampaignsTab: React.FC<CampaignsTabProps> = ({
  isWizardOpen = false,
  onCloseWizard,
}) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showWizard, setShowWizard] = useState(isWizardOpen);

  // Multi-step Wizard State
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [cName, setCName] = useState('');
  const [cSubject, setCSubject] = useState('');
  const [cSenderDomain, setCSenderDomain] = useState('dispatch.flowem-enterprise.net');
  const [cSenderEmail, setCSenderEmail] = useState('updates@flowem-enterprise.net');
  const [cSenderName, setCSenderName] = useState('FlowEM Enterprise Dispatch');
  const [cList, setCList] = useState(initialContactLists[0].name);
  const [cTemplateId, setCTemplateId] = useState(initialTemplates[0].id);
  const [cSendTiming, setCSendTiming] = useState<'immediate' | 'scheduled'>('immediate');
  const [cThrottleRate, setCThrottleRate] = useState('50,000 / hour');

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleLaunchCampaign = () => {
    const targetList = initialContactLists.find(l => l.name === cList) || initialContactLists[0];
    const newCamp: Campaign = {
      id: `cmp-${Date.now()}`,
      name: cName || 'Untitled Broadcast Campaign',
      subject: cSubject || 'Important Operational Update',
      senderDomain: cSenderDomain,
      senderEmail: cSenderEmail,
      senderName: cSenderName,
      status: cSendTiming === 'immediate' ? 'Sending' : 'Scheduled',
      listName: cList,
      recipientsTotal: targetList.contactCount || 50000,
      sentCount: cSendTiming === 'immediate' ? 2400 : 0,
      deliveredCount: cSendTiming === 'immediate' ? 2392 : 0,
      openedCount: 0,
      clickedCount: 0,
      bouncedCount: 0,
      deliveryRate: cSendTiming === 'immediate' ? 99.8 : 0,
      openRate: 0,
      clickRate: 0,
      scheduledFor: cSendTiming === 'scheduled' ? 'Tomorrow at 09:00 UTC' : undefined,
      sentAt: cSendTiming === 'immediate' ? 'Just now' : undefined,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCampaigns([newCamp, ...campaigns]);
    setShowWizard(false);
    if (onCloseWizard) onCloseWizard();
    setWizardStep(1);
    setCName('');
    setCSubject('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Mass Campaign Orchestrator
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure multi-recipient broadcasts with automated IP warm-up throttling and live telemetry.
          </p>
        </div>

        <button
          onClick={() => setShowWizard(true)}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition shadow-glow-indigo flex items-center gap-2 border border-indigo-400/40"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Campaign</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns, subject lines..."
            className="w-full glass-input rounded-lg pl-9 pr-3 py-2 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['All', 'Sending', 'Scheduled', 'Completed', 'Draft'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Campaign Name & Subject</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Audience</th>
                <th className="py-3.5 px-4">Dispatched / Total</th>
                <th className="py-3.5 px-4">Delivery</th>
                <th className="py-3.5 px-4">Opens / Clicks</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredCampaigns.map(camp => (
                <tr key={camp.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{camp.name}</div>
                    <div className="text-[11px] text-slate-400 italic">"{camp.subject}"</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      From: {camp.senderEmail}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <MorphicBadge
                      label={camp.status}
                      variant={
                        camp.status === 'Completed'
                          ? 'success'
                          : camp.status === 'Sending'
                          ? 'purple'
                          : camp.status === 'Scheduled'
                          ? 'info'
                          : 'neutral'
                      }
                    />
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-200">{camp.listName}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <div>{camp.sentCount.toLocaleString()} / {camp.recipientsTotal.toLocaleString()}</div>
                    {camp.status === 'Sending' && (
                      <div className="w-24 bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full"
                          style={{ width: `${(camp.sentCount / camp.recipientsTotal) * 100}%` }}
                        ></div>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className="text-emerald-400 font-semibold">{camp.deliveryRate}%</span>
                    <div className="text-[10px] text-slate-500">{camp.bouncedCount} bounces</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <div>
                      Opens: <span className="text-emerald-400 font-semibold">{camp.openRate}%</span>
                    </div>
                    <div>
                      Clicks: <span className="text-cyan-400 font-semibold">{camp.clickRate}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {camp.status === 'Sending' ? (
                        <button
                          title="Pause Dispatch"
                          onClick={() => {
                            setCampaigns(prev => prev.map(c => c.id === camp.id ? { ...c, status: 'Paused' } : c));
                          }}
                          className="p-1.5 rounded bg-slate-800 text-amber-300 hover:bg-slate-700"
                        >
                          <Pause className="w-3.5 h-3.5" />
                        </button>
                      ) : camp.status === 'Paused' ? (
                        <button
                          title="Resume Dispatch"
                          onClick={() => {
                            setCampaigns(prev => prev.map(c => c.id === camp.id ? { ...c, status: 'Sending' } : c));
                          }}
                          className="p-1.5 rounded bg-slate-800 text-emerald-300 hover:bg-slate-700"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-Step Campaign Builder Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-2xl glass-panel p-6 border border-white/10 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">Campaign Creation Wizard</h3>
                <p className="text-xs text-slate-400">Step {wizardStep} of 4: Configuration & Delivery Settings</p>
              </div>
              <button
                onClick={() => {
                  setShowWizard(false);
                  if (onCloseWizard) onCloseWizard();
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Header */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {[
                { step: 1, label: 'Setup' },
                { step: 2, label: 'Audience' },
                { step: 3, label: 'Template' },
                { step: 4, label: 'Schedule' }
              ].map(s => (
                <div
                  key={s.step}
                  className={`p-2 rounded-lg border transition ${
                    wizardStep === s.step
                      ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                      : wizardStep > s.step
                      ? 'bg-slate-900 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  Step {s.step}: {s.label}
                </div>
              ))}
            </div>

            {/* Step 1: Campaign Setup */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Campaign Internal Name *</label>
                  <input
                    type="text"
                    required
                    value={cName}
                    onChange={(e) => setCName(e.target.value)}
                    className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                    placeholder="e.g. Q4 Global Infrastructure Advisory"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Subject Line *</label>
                  <input
                    type="text"
                    required
                    value={cSubject}
                    onChange={(e) => setCSubject(e.target.value)}
                    className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                    placeholder="e.g. Important Notice: Network optimization and security upgrades"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Sender Domain</label>
                    <select
                      value={cSenderDomain}
                      onChange={(e) => setCSenderDomain(e.target.value)}
                      className="w-full glass-input rounded-lg px-3 py-2 text-xs bg-slate-900"
                    >
                      {initialSenderDomains.map(d => (
                        <option key={d.id} value={d.subdomain}>{d.subdomain}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Sender Email</label>
                    <input
                      type="email"
                      value={cSenderEmail}
                      onChange={(e) => setCSenderEmail(e.target.value)}
                      className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                      placeholder="dispatch@domain.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Friendly From Name</label>
                  <input
                    type="text"
                    value={cSenderName}
                    onChange={(e) => setCSenderName(e.target.value)}
                    className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                    placeholder="FlowEM Enterprise Dispatch"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Audience Selection */}
            {wizardStep === 2 && (
              <div className="space-y-4">
                <label className="block text-xs font-medium text-slate-300">Choose Recipient Audience List</label>
                <div className="space-y-2">
                  {initialContactLists.map(list => (
                    <div
                      key={list.id}
                      onClick={() => setCList(list.name)}
                      className={`p-3 rounded-xl border cursor-pointer transition ${
                        cList === list.name
                          ? 'bg-indigo-600/20 border-indigo-500 shadow-glow-indigo'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-white text-xs">{list.name}</div>
                        <span className="font-mono text-xs text-indigo-300">
                          {list.contactCount.toLocaleString()} subscribers
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{list.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Template Selection */}
            {wizardStep === 3 && (
              <div className="space-y-4">
                <label className="block text-xs font-medium text-slate-300">Select Production Email Template</label>
                <div className="grid grid-cols-2 gap-3">
                  {initialTemplates.map(tpl => (
                    <div
                      key={tpl.id}
                      onClick={() => setCTemplateId(tpl.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition ${
                        cTemplateId === tpl.id
                          ? 'bg-indigo-600/20 border-indigo-500 shadow-glow-indigo'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-indigo-400 uppercase tracking-wider">{tpl.category}</span>
                        {tpl.isPopular && <MorphicBadge label="Popular" variant="purple" />}
                      </div>
                      <div className="font-semibold text-white text-xs">{tpl.title}</div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{tpl.previewText}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Schedule & Throttling */}
            {wizardStep === 4 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">Transmission Timing</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCSendTiming('immediate')}
                      className={`p-3 rounded-xl border text-left transition ${
                        cSendTiming === 'immediate'
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">Immediate Dispatch</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Ingest into MTA cluster now</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCSendTiming('scheduled')}
                      className={`p-3 rounded-xl border text-left transition ${
                        cSendTiming === 'scheduled'
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">Scheduled Window</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Deliver at optimal recipient hour</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">MTA Hourly Throttle Ceiling</label>
                  <select
                    value={cThrottleRate}
                    onChange={(e) => setCThrottleRate(e.target.value)}
                    className="w-full glass-input rounded-lg px-3 py-2 text-xs bg-slate-900"
                  >
                    <option value="10,000 / hour">10,000 dispatches / hour (Gradual Warm-Up)</option>
                    <option value="50,000 / hour">50,000 dispatches / hour (Standard Balanced)</option>
                    <option value="150,000 / hour">150,000 dispatches / hour (High Throughput)</option>
                    <option value="Uncapped">Uncapped (Max MTA Cluster Velocity)</option>
                  </select>
                </div>

                <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-800/30 text-xs text-indigo-300 space-y-1">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Automatic Compliance Injection</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    RFC-8058 List-Unsubscribe header, physical CAN-SPAM address, and DKIM 2048-bit key will be automatically attached to each message.
                  </p>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                disabled={wizardStep === 1}
                onClick={() => setWizardStep((prev) => Math.max(1, prev - 1) as any)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 disabled:opacity-40"
              >
                Back
              </button>

              {wizardStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep((prev) => Math.min(4, prev + 1) as any)}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition shadow-glow-indigo flex items-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleLaunchCampaign}
                  className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-lg flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Launch Campaign</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
