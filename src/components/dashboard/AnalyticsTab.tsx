import React, { useState } from 'react';
import { 
  Download, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  Globe 
} from 'lucide-react';
import { MorphicCard } from '../common/MorphicCard';
import { ThroughputChart } from '../common/VisualChart';
import { analyticsHourlyData, ispDistribution } from '../../data/mockData';

export const AnalyticsTab: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  const bounceDiagnostics: { code: string; reason: string; count: number; pct: string }[] = [];

  const geoBreakdown: { region: string; volume: string; pct: number; speed: string }[] = [];

  const handleExportAudit = () => {
    alert('Email report CSV has been exported and saved to your device.');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Email Analytics & Reports
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time delivery statistics, open rates, click percentages, and bounce reasons.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold">
            {(['24h', '7d', '30d'] as const).map(tr => (
              <button
                key={tr}
                onClick={() => setTimeRange(tr)}
                className={`px-3 py-1.5 rounded-md uppercase transition ${
                  timeRange === tr ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tr}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportAudit}
            className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 shadow-xs transition flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Download CSV Report</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MorphicCard className="p-4 space-y-1 bg-white">
          <div className="text-xs font-semibold text-slate-500 uppercase">Inbox Delivery Rate</div>
          <div className="text-2xl font-bold text-emerald-600 font-mono">0.0%</div>
          <div className="text-[11px] text-slate-500">Target: Above 98.5%</div>
        </MorphicCard>

        <MorphicCard className="p-4 space-y-1 bg-white">
          <div className="text-xs font-semibold text-slate-500 uppercase">Spam Complaint Rate</div>
          <div className="text-2xl font-bold text-sky-600 font-mono">0.00%</div>
          <div className="text-[11px] text-emerald-600 font-medium">Safe threshold (&lt; 0.10%)</div>
        </MorphicCard>

        <MorphicCard className="p-4 space-y-1 bg-white">
          <div className="text-xs font-semibold text-slate-500 uppercase">Hard Bounce Rate</div>
          <div className="text-2xl font-bold text-slate-900 font-mono">0.00%</div>
          <div className="text-[11px] text-slate-500">Auto-blocked from future sends</div>
        </MorphicCard>

        <MorphicCard className="p-4 space-y-1 bg-white">
          <div className="text-xs font-semibold text-slate-500 uppercase">Average Delivery Speed</div>
          <div className="text-2xl font-bold text-indigo-600 font-mono">-- ms</div>
          <div className="text-[11px] text-indigo-600 font-medium">Instant server connection</div>
        </MorphicCard>
      </div>

      {/* Chart */}
      <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            Emails Sent vs Opened
          </h3>
          <span className="text-xs font-mono text-slate-400">Timezone: UTC</span>
        </div>
        <ThroughputChart data={analyticsHourlyData} height={250} />
      </div>

      {/* 2 Columns: ISP Delivery & Bounce Reasons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ISP Delivery */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Delivery Rates by Email Provider
          </h3>

          <div className="space-y-3">
            {ispDistribution.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                <ShieldCheck className="w-8 h-8 mx-auto text-slate-300 stroke-1 mb-2" />
                <p className="font-semibold text-slate-700 text-xs">No provider delivery data yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Inbox delivery statistics for Gmail, Microsoft Outlook, and Yahoo will automatically display once campaigns start transmitting.</p>
              </div>
            ) : (
              ispDistribution.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-900">{item.isp}</span>
                    <span className="font-mono text-emerald-700 font-bold">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${item.percentage * 1.8}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>Emails Delivered: {item.volume}</span>
                    <span className="text-emerald-700 font-semibold">{item.reputation}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bounce Reasons */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Why Emails Bounced
          </h3>

          <div className="space-y-3">
            {bounceDiagnostics.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                <AlertTriangle className="w-8 h-8 mx-auto text-slate-300 stroke-1 mb-2" />
                <p className="font-semibold text-slate-700 text-xs">Zero bounces recorded</p>
                <p className="text-[11px] text-slate-400 mt-0.5">No hard or soft bounces detected. Sent emails will log delivery failure codes here if any occur.</p>
              </div>
            ) : (
              bounceDiagnostics.map((b, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">{b.reason}</span>
                    <span className="font-mono text-xs font-bold text-slate-600">{b.count} ({b.pct})</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Server Code: {b.code}</div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
            Invalid email addresses are automatically moved to your Blocked list to keep your domain safe.
          </div>
        </div>

      </div>

      {/* Geographic Speed */}
      <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Globe className="w-4 h-4 text-sky-600" />
          Delivery Volume by Region
        </h3>

        {geoBreakdown.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
            <Globe className="w-8 h-8 mx-auto text-slate-300 stroke-1 mb-2" />
            <p className="font-semibold text-slate-700 text-xs">No regional transmission data yet</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Geographical transmission latency will record automatically across North America, Europe, and Asia-Pacific edge servers.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {geoBreakdown.map((g, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-slate-900">{g.region}</div>
                <div className="text-xl font-bold font-mono text-indigo-700">{g.volume}</div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>{g.pct}% of all emails</span>
                  <span className="text-slate-600 font-mono">Speed: {g.speed}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
