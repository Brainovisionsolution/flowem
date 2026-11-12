import React from 'react';
import { 
  Send, 
  CheckCircle2, 
  Mail, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight, 
  Plus, 
  Users, 
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import { MorphicCard, MorphicBadge } from '../common/MorphicCard';
import { ThroughputChart } from '../common/VisualChart';
import { analyticsHourlyData, initialCampaigns, ispDistribution } from '../../data/mockData';
import { Campaign, NavigationTab } from '../../types';

interface OverviewTabProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenNewCampaign: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  onNavigate,
  onOpenNewCampaign,
}) => {
  const activeCampaigns = initialCampaigns.filter(c => c.status === 'Sending' || c.status === 'Scheduled');

  return (
    <div className="space-y-8">
      
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Infrastructure Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time bulk dispatch monitoring, MTA cluster queue telemetry, and deliverability status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('sender-config')}
            className="px-3.5 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-xs text-slate-300 border border-slate-700/80 transition flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Domain Health: 99.8%</span>
          </button>

          <button
            onClick={onOpenNewCampaign}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition shadow-glow-indigo flex items-center gap-2 border border-indigo-400/40"
          >
            <Plus className="w-4 h-4" />
            <span>Launch Campaign</span>
          </button>
        </div>
      </div>

      {/* KPI Morphic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <MorphicCard glow="indigo" className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase tracking-wider">Total Sent (MTD)</span>
            <Send className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">1,940,210</div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% vs prior month</span>
          </div>
        </MorphicCard>

        <MorphicCard glow="emerald" className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase tracking-wider">Inbox Placement</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">99.84%</div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>Target SLA: &gt; 99.0%</span>
          </div>
        </MorphicCard>

        <MorphicCard glow="cyan" className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase tracking-wider">Average Open Rate</span>
            <Mail className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">44.82%</div>
          <div className="flex items-center gap-1.5 text-[11px] text-cyan-400">
            <span>+2.8% above benchmark</span>
          </div>
        </MorphicCard>

        <MorphicCard glow="none" className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase tracking-wider">Click-Through</span>
            <ArrowUpRight className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">14.18%</div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>275,120 unique clicks</span>
          </div>
        </MorphicCard>

        <MorphicCard glow="none" className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase tracking-wider">Hard Bounce Rate</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">0.16%</div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <span>Within safe thresholds</span>
          </div>
        </MorphicCard>

      </div>

      {/* Main Charts & Live Transmissions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 24h Velocity Chart */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  Hourly Transmission Velocity & Engagement Telemetry
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time throughput metrics dispatched across clustered MTA worker pools.
                </p>
              </div>
              <button
                onClick={() => onNavigate('analytics')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <span>Full Telemetry</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <ThroughputChart data={analyticsHourlyData} height={240} />
          </div>

          {/* Active Campaigns In Progress */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400" />
                Active & Scheduled Broadcasts
              </h3>
              <button
                onClick={() => onNavigate('campaigns')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <span>View All Campaigns</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {initialCampaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-white">{camp.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Subject: <span className="text-slate-300 font-serif italic">"{camp.subject}"</span>
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
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Dispatch Progress: {camp.sentCount.toLocaleString()} / {camp.recipientsTotal.toLocaleString()}</span>
                        <span className="font-mono text-indigo-300">
                          {Math.round((camp.sentCount / camp.recipientsTotal) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${(camp.sentCount / camp.recipientsTotal) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {camp.status === 'Completed' && (
                    <div className="grid grid-cols-4 gap-2 pt-1 text-xs text-slate-400 border-t border-slate-800/60">
                      <div>Delivered: <strong className="text-slate-200">{camp.deliveryRate}%</strong></div>
                      <div>Opens: <strong className="text-emerald-400">{camp.openRate}%</strong></div>
                      <div>Clicks: <strong className="text-cyan-400">{camp.clickRate}%</strong></div>
                      <div>Bounces: <strong className="text-slate-200">{camp.bouncedCount}</strong></div>
                    </div>
                  )}

                  {camp.status === 'Scheduled' && (
                    <div className="text-xs text-slate-400 pt-1 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Scheduled for transmission at {camp.scheduledFor}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: ISP Placement & Quick Navigation */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Recipient Mailbox Telemetry */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ISP Inbox Placement Telemetry
            </h3>

            <div className="space-y-3">
              {ispDistribution.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-200 font-medium">{item.isp}</span>
                    <span className="font-mono text-emerald-400 font-semibold">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full"
                      style={{ width: `${item.percentage * 1.8}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Vol: {item.volume}</span>
                    <span className="text-slate-300">{item.reputation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Platform Shortcuts */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3">
            <h3 className="text-sm font-semibold text-white">Platform Modules</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onNavigate('contacts')}
                className="p-3 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-left transition"
              >
                <Users className="w-4 h-4 text-indigo-400 mb-1" />
                <div className="font-medium text-slate-200">Contacts</div>
                <div className="text-[10px] text-slate-400">128.4k Verified</div>
              </button>

              <button
                onClick={() => onNavigate('automation')}
                className="p-3 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-left transition"
              >
                <Activity className="w-4 h-4 text-cyan-400 mb-1" />
                <div className="font-medium text-slate-200">Automation</div>
                <div className="text-[10px] text-slate-400">3 Active Workflows</div>
              </button>

              <button
                onClick={() => onNavigate('templates')}
                className="p-3 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-left transition"
              >
                <Layers className="w-4 h-4 text-emerald-400 mb-1" />
                <div className="font-medium text-slate-200">Templates</div>
                <div className="text-[10px] text-slate-400">Responsive HTML</div>
              </button>

              <button
                onClick={() => onNavigate('suppression')}
                className="p-3 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-left transition"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400 mb-1" />
                <div className="font-medium text-slate-200">Suppression</div>
                <div className="text-[10px] text-slate-400">RFC Compliance</div>
              </button>
            </div>
          </div>

          {/* Infrastructure Health Status */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">MTA Transmission Nodes</span>
              <span className="font-mono text-emerald-400">24 / 24 HEALTHY</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Zero queued backlogs detected. Outbound TLS 1.3 socket negotiation latency is nominal across US-East and EU-West regions.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
