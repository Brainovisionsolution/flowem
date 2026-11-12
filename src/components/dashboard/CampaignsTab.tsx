import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Plus, 
  Search, 
  Clock, 
  Pause, 
  Play, 
  ArrowRight, 
  X, 
  ShieldCheck,
  Mail
} from 'lucide-react';
import { MorphicCard, MorphicBadge } from '../common/MorphicCard';
import { Campaign, ContactList, EmailTemplate } from '../../types';
import { api } from '../../services/api';

interface CampaignsTabProps {
  isWizardOpen?: boolean;
  onCloseWizard?: () => void;
}

export const CampaignsTab: React.FC<CampaignsTabProps> = ({
  isWizardOpen = false,
  onCloseWizard,
}) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [lists, setLists] = useState<ContactList[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showWizard, setShowWizard] = useState(isWizardOpen);

  // Wizard state
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [cName, setCName] = useState('');
  const [cSubject, setCSubject] = useState('');
  const [cSenderEmail, setCSenderEmail] = useState('updates@flowem.net');
  const [cSenderName, setCSenderName] = useState('FlowEM Team');
  const [cList, setCList] = useState('');
  const [cTemplateId, setCTemplateId] = useState('');
  const [cSendTiming, setCSendTiming] = useState<'immediate' | 'scheduled'>('immediate');
  const [cThrottleRate, setCThrottleRate] = useState('50,000 / hour');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [cData, lData, tData] = await Promise.all([
      api.getCampaigns(),
      api.getLists(),
      api.getTemplates()
    ]);
    setCampaigns(cData);
    setLists(lData);
    setTemplates(tData);
    if (lData.length > 0) setCList(lData[0].name);
    if (tData.length > 0) setCTemplateId(tData[0].id);
  };

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleLaunchCampaign = async () => {
    const newCamp = await api.addCampaign({
      name: cName || 'New Email Campaign',
      subject: cSubject || 'Important update from our team',
      senderEmail: cSenderEmail,
      senderName: cSenderName,
      listName: cList,
      sendImmediately: cSendTiming === 'immediate'
    });

    setCampaigns([newCamp, ...campaigns]);
    setShowWizard(false);
    if (onCloseWizard) onCloseWizard();
    setWizardStep(1);
    setCName('');
    setCSubject('');
  };

  const toggleCampaignStatus = async (camp: Campaign) => {
    const nextStatus = camp.status === 'Sending' ? 'Paused' : 'Sending';
    await api.updateCampaignStatus(camp.id, nextStatus);
    setCampaigns(campaigns.map(c => c.id === camp.id ? { ...c, status: nextStatus as any } : c));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Email Campaigns
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Send mass newsletters, product updates, and special announcements ({campaigns.length} total campaigns).
          </p>
        </div>

        <button
          onClick={() => setShowWizard(true)}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns, subjects..."
            className="w-full glass-input rounded-lg pl-9 pr-3 py-2 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['All', 'Sending', 'Scheduled', 'Completed', 'Draft'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="glass-panel rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-bold text-[11px]">
              <tr>
                <th className="py-3 px-4">Campaign & Subject</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Recipient List</th>
                <th className="py-3 px-4">Sent / Total</th>
                <th className="py-3 px-4">Delivered</th>
                <th className="py-3 px-4">Opens / Clicks</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Mail className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-1" />
                    <p className="font-semibold text-slate-700">No campaigns found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Click "New Campaign" to create, design, and schedule your first bulk email blast.</p>
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map(camp => (
                  <tr key={camp.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{camp.name}</div>
                    <div className="text-[11px] text-slate-500 font-serif italic">"{camp.subject}"</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
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
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {camp.listName}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <div>{camp.sentCount.toLocaleString()} / {camp.recipientsTotal.toLocaleString()}</div>
                    {camp.status === 'Sending' && (
                      <div className="w-24 bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${(camp.sentCount / camp.recipientsTotal) * 100}%` }}
                        ></div>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className="text-emerald-700 font-bold">{camp.deliveryRate}%</span>
                    <div className="text-[10px] text-slate-400">{camp.bouncedCount} bounced</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <div>Opens: <span className="text-emerald-700 font-bold">{camp.openRate}%</span></div>
                    <div>Clicks: <span className="text-sky-700 font-bold">{camp.clickRate}%</span></div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {camp.status === 'Sending' ? (
                      <button
                        title="Pause Sending"
                        onClick={() => toggleCampaignStatus(camp)}
                        className="p-1.5 rounded bg-amber-50 text-amber-700 hover:bg-amber-100 font-semibold text-xs border border-amber-200 inline-flex items-center gap-1"
                      >
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pause</span>
                      </button>
                    ) : camp.status === 'Paused' ? (
                      <button
                        title="Resume Sending"
                        onClick={() => toggleCampaignStatus(camp)}
                        className="p-1.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs border border-emerald-200 inline-flex items-center gap-1"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Resume</span>
                      </button>
                    ) : null}
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-Step Campaign Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 border border-slate-200 shadow-xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Send New Campaign</h3>
                <p className="text-xs text-slate-500">Step {wizardStep} of 4: Simple setup and scheduling</p>
              </div>
              <button
                onClick={() => {
                  setShowWizard(false);
                  if (onCloseWizard) onCloseWizard();
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Header */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {[
                { step: 1, label: 'Details' },
                { step: 2, label: 'Recipients' },
                { step: 3, label: 'Email Design' },
                { step: 4, label: 'Send Time' }
              ].map(s => (
                <div
                  key={s.step}
                  className={`p-2 rounded-lg border font-semibold transition ${
                    wizardStep === s.step
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : wizardStep > s.step
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  Step {s.step}: {s.label}
                </div>
              ))}
            </div>

            {/* Step 1: Details */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Campaign Name *</label>
                  <input
                    type="text"
                    required
                    value={cName}
                    onChange={(e) => setCName(e.target.value)}
                    className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                    placeholder="e.g. November Product News"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Subject Line *</label>
                  <input
                    type="text"
                    required
                    value={cSubject}
                    onChange={(e) => setCSubject(e.target.value)}
                    className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                    placeholder="e.g. New features and improvements are live"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Sender From Name</label>
                    <input
                      type="text"
                      value={cSenderName}
                      onChange={(e) => setCSenderName(e.target.value)}
                      className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                      placeholder="FlowEM Team"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Sender Email</label>
                    <input
                      type="email"
                      value={cSenderEmail}
                      onChange={(e) => setCSenderEmail(e.target.value)}
                      className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                      placeholder="updates@flowem.net"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Recipients */}
            {wizardStep === 2 && (
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-slate-700">Select Who Receives This Email</label>
                <div className="space-y-2">
                  {lists.map(list => (
                    <div
                      key={list.id}
                      onClick={() => setCList(list.name)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition ${
                        cList === list.name
                          ? 'bg-indigo-50 border-indigo-300 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-slate-900 text-xs">{list.name}</div>
                        <span className="font-mono text-xs font-bold text-indigo-700">
                          {list.contactCount.toLocaleString()} subscribers
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{list.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Template */}
            {wizardStep === 3 && (
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-slate-700">Select Email Design</label>
                <div className="grid grid-cols-2 gap-3">
                  {templates.map(tpl => (
                    <div
                      key={tpl.id}
                      onClick={() => setCTemplateId(tpl.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition ${
                        cTemplateId === tpl.id
                          ? 'bg-indigo-50 border-indigo-300 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-indigo-600 font-bold uppercase">{tpl.category}</span>
                        {tpl.isPopular && <MorphicBadge label="Popular" variant="purple" />}
                      </div>
                      <div className="font-bold text-slate-900 text-xs">{tpl.title}</div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{tpl.previewText}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Schedule */}
            {wizardStep === 4 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">When Should This Send?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCSendTiming('immediate')}
                      className={`p-3.5 rounded-xl border text-left transition ${
                        cSendTiming === 'immediate'
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">Send Right Now</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Start sending immediately</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCSendTiming('scheduled')}
                      className={`p-3.5 rounded-xl border text-left transition ${
                        cSendTiming === 'scheduled'
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">Schedule for Later</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Send tomorrow at 09:00 AM</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sending Speed Cap</label>
                  <select
                    value={cThrottleRate}
                    onChange={(e) => setCThrottleRate(e.target.value)}
                    className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  >
                    <option value="10,000 / hour">10,000 emails / hour (Gradual Warm-Up)</option>
                    <option value="50,000 / hour">50,000 emails / hour (Recommended Standard)</option>
                    <option value="150,000 / hour">150,000 emails / hour (High Speed)</option>
                    <option value="Uncapped">Maximum Server Speed</option>
                  </select>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Safe Delivery Guarantee</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    A 1-click unsubscribe button and your company address will be added automatically to keep emails out of spam.
                  </p>
                </div>
              </div>
            )}

            {/* Stepper Footer Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                disabled={wizardStep === 1}
                onClick={() => setWizardStep((prev) => Math.max(1, prev - 1) as any)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-40"
              >
                Back
              </button>

              {wizardStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep((prev) => Math.min(4, prev + 1) as any)}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-xs flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleLaunchCampaign}
                  className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Campaign Now</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
