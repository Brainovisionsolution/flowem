import React, { useState, useEffect } from 'react';
import { 
  Send, 
  CheckCircle2, 
  Mail, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowUpRight, 
  Plus, 
  Users, 
  Activity,
  ChevronRight
} from 'lucide-react';
import { MorphicCard, MorphicBadge } from '../common/MorphicCard';
import { ThroughputChart } from '../common/VisualChart';
import { analyticsHourlyData, ispDistribution } from '../../data/mockData';
import { Campaign, NavigationTab } from '../../types';
import { api } from '../../services/api';

interface OverviewTabProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenNewCampaign: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  onNavigate,
  onOpenNewCampaign,
}) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    api.getCampaigns().then(setCampaigns);
  }, []);

  const totalSent = campaigns.reduce((acc, c) => acc + (c.sentCount || 0), 0);
  const avgDelivery = campaigns.length > 0 
    ? (campaigns.reduce((acc, c) => acc + (c.deliveryRate || 0), 0) / campaigns.length).toFixed(1) 
    : '100';
  const avgOpens = campaigns.length > 0 
    ? (campaigns.reduce((acc, c) => acc + (c.openRate || 0), 0) / campaigns.length).toFixed(1) 
    : '0';

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track your email delivery, live campaigns, and sending speeds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('sender-config')}
            className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 border border-slate-200 shadow-xs transition flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Domain Health: Ready</span>
          </button>

          <button
            onClick={onOpenNewCampaign}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Send New Campaign</span>
          </button>
        </div>
      </div>

      {/* KPI Morphic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <MorphicCard className="p-4 space-y-1 bg-white">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="uppercase font-semibold text-[10px]">Emails Sent (This Month)</span>
            <Send className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{totalSent.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span>Ready to send</span>
          </div>
        </MorphicCard>

        <MorphicCard className="p-4 space-y-1 bg-white">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="uppercase font-semibold text-[10px]">Inbox Delivery Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 font-mono">{avgDelivery}%</div>
          <div className="text-[11px] text-slate-500">
            <span>Optimal domain reputation</span>
          </div>
        </MorphicCard>

        <MorphicCard className="p-4 space-y-1 bg-white">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="uppercase font-semibold text-[10px]">Average Open Rate</span>
            <Mail className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{avgOpens}%</div>
          <div className="text-[11px] text-slate-500">
            <span>Live reader stats</span>
          </div>
        </MorphicCard>

        <MorphicCard className="p-4 space-y-1 bg-white">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="uppercase font-semibold text-[10px]">Link Click Rate</span>
            <ArrowUpRight className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">0%</div>
          <div className="text-[11px] text-slate-500">
            <span>0 total clicks</span>
          </div>
        </MorphicCard>

        <MorphicCard className="p-4 space-y-1 bg-white">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="uppercase font-semibold text-[10px]">Bounced Emails</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">0%</div>
          <div className="text-[11px] text-emerald-600 font-medium">
            <span>Clean list</span>
          </div>
        </MorphicCard>

      </div>

      {/* Main Charts & Campaigns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Chart */}
          <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  Hourly Email Activity
                </h3>
                <p className="text-xs text-slate-500">
                  Live hourly sending activity across your email servers.
                </p>
              </div>
              <button
                onClick={() => onNavigate('analytics')}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
              >
                <span>View Full Reports</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <ThroughputChart data={analyticsHourlyData} height={220} />
          </div>

          {/* Active Campaigns */}
          <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-600" />
                Recent Campaigns
              </h3>
              <button
                onClick={() => onNavigate('campaigns')}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
              >
                <span>All Campaigns</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {campaigns.length === 0 ? (
              <div className="text-center py-8 text-slate-500 space-y-2">
                <p className="text-xs">No email campaigns created yet.</p>
                <button
                  onClick={onOpenNewCampaign}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-xs transition"
                >
                  Create Your First Campaign
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {campaigns.slice(0, 3).map((camp) => (
                  <div
                    key={camp.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-bold text-slate-900">{camp.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Subject: <span className="text-slate-700 font-serif italic">"{camp.subject}"</span>
                        </div>
                      </div>
                      <div>
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
                      </div>
                    </div>

                    {camp.status === 'Sending' && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-xs text-slate-600">
                          <span>Progress: {camp.sentCount.toLocaleString()} / {camp.recipientsTotal.toLocaleString()} sent</span>
                          <span className="font-mono text-indigo-700 font-bold">
                            {Math.round((camp.sentCount / (camp.recipientsTotal || 1)) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${(camp.sentCount / (camp.recipientsTotal || 1)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {camp.status === 'Completed' && (
                      <div className="grid grid-cols-4 gap-2 pt-1 text-xs text-slate-600 border-t border-slate-200">
                        <div>Delivered: <strong className="text-slate-900 font-mono">{camp.deliveryRate}%</strong></div>
                        <div>Opened: <strong className="text-emerald-700 font-mono">{camp.openRate}%</strong></div>
                        <div>Clicked: <strong className="text-sky-700 font-mono">{camp.clickRate}%</strong></div>
                        <div>Bounced: <strong className="text-slate-700 font-mono">{camp.bouncedCount}</strong></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Email Provider Results */}
          <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Delivery by Email Provider
            </h3>

            {ispDistribution.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 text-slate-500 text-xs text-center">
                Provider statistics will populate automatically after your first email campaign is sent.
              </div>
            ) : (
              <div className="space-y-3">
                {ispDistribution.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-800 font-semibold">{item.isp}</span>
                      <span className="font-mono text-emerald-700 font-bold">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full"
                        style={{ width: `${item.percentage * 1.8}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>Sent: {item.volume}</span>
                      <span className="text-slate-600">{item.reputation}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Menu */}
          <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Quick Shortcuts</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onNavigate('contacts')}
                className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition"
              >
                <Users className="w-4 h-4 text-indigo-600 mb-1" />
                <div className="font-bold text-slate-900">Contacts</div>
                <div className="text-[10px] text-slate-500">Manage list</div>
              </button>

              <button
                onClick={() => onNavigate('templates')}
                className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition"
              >
                <Mail className="w-4 h-4 text-emerald-600 mb-1" />
                <div className="font-bold text-slate-900">Templates</div>
                <div className="text-[10px] text-slate-500">Email designs</div>
              </button>

              <button
                onClick={() => onNavigate('automation')}
                className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition"
              >
                <Activity className="w-4 h-4 text-sky-600 mb-1" />
                <div className="font-bold text-slate-900">Automation</div>
                <div className="text-[10px] text-slate-500">Follow-up flows</div>
              </button>

              <button
                onClick={() => onNavigate('sender-config')}
                className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600 mb-1" />
                <div className="font-bold text-slate-900">Domain Setup</div>
                <div className="text-[10px] text-slate-500">SPF & DKIM</div>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
