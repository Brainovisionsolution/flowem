import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  Globe, 
  CheckCircle2, 
  TrendingUp, 
  Clock 
} from 'lucide-react';
import { MorphicCard, MorphicBadge } from '../common/MorphicCard';
import { ThroughputChart } from '../common/VisualChart';
import { analyticsHourlyData, ispDistribution } from '../../data/mockData';

export const AnalyticsTab: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'mtd'>('24h');

  const bounceDiagnostics = [
    { code: '550 5.1.1', reason: 'Recipient address rejected: User unknown', count: 142, pct: '48%' },
    { code: '554 5.7.1', reason: 'Host resolution failure / NXDOMAIN', count: 88, pct: '30%' },
    { code: '451 4.4.0', reason: 'Transient DNS routing timeout (Soft Bounce)', count: 42, pct: '14%' },
    { code: '552 5.2.2', reason: 'Mailbox quota exceeded on destination server', count: 24, pct: '8%' },
  ];

  const geoBreakdown = [
    { region: 'North America (US / CA)', volume: '1,047,700', pct: 54, latency: '28ms' },
    { region: 'Europe (EU / UK / CH)', volume: '543,250', pct: 28, latency: '34ms' },
    { region: 'Asia-Pacific (JP / SG / AU)', volume: '271,620', pct: 14, latency: '62ms' },
    { region: 'Latin America & Other', volume: '77,640', pct: 4, latency: '75ms' },
  ];

  const handleExportAudit = () => {
    alert('Compliance Telemetry CSV generated and queued for download.');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Deliverability Analytics & ISP Telemetry
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end MTA handshake logs, spam complaint thresholds, and ISP deliverability distributions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            {(['24h', '7d', '30d', 'mtd'] as const).map(tr => (
              <button
                key={tr}
                onClick={() => setTimeRange(tr)}
                className={`px-3 py-1.5 rounded-md font-mono uppercase transition ${
                  timeRange === tr ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tr}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportAudit}
            className="px-3.5 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-xs text-slate-300 border border-slate-700 transition flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export Telemetry CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MorphicCard glow="indigo" className="p-4 space-y-1">
          <div className="text-xs text-slate-400 uppercase tracking-wider">Inbox Placement Rate</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">99.84%</div>
          <div className="text-[11px] text-slate-400">Target threshold: &gt; 98.5%</div>
        </MorphicCard>

        <MorphicCard glow="cyan" className="p-4 space-y-1">
          <div className="text-xs text-slate-400 uppercase tracking-wider">Spam Complaint Rate</div>
          <div className="text-2xl font-bold text-cyan-300 font-mono">0.012%</div>
          <div className="text-[11px] text-emerald-400">Google / Yahoo cap: &lt; 0.10%</div>
        </MorphicCard>

        <MorphicCard glow="none" className="p-4 space-y-1">
          <div className="text-xs text-slate-400 uppercase tracking-wider">Hard Bounce Suppression</div>
          <div className="text-2xl font-bold text-white font-mono">0.158%</div>
          <div className="text-[11px] text-slate-400">Automatic exclusion active</div>
        </MorphicCard>

        <MorphicCard glow="none" className="p-4 space-y-1">
          <div className="text-xs text-slate-400 uppercase tracking-wider">MTA Socket Latency</div>
          <div className="text-2xl font-bold text-white font-mono">38 ms</div>
          <div className="text-[11px] text-cyan-400">Sub-second TLS handshake</div>
        </MorphicCard>
      </div>

      {/* Chart Section */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            Dispatched Volume vs Unique Opens Telemetry
          </h3>
          <span className="text-xs font-mono text-slate-400">Timezone: UTC</span>
        </div>
        <ThroughputChart data={analyticsHourlyData} height={260} />
      </div>

      {/* 2 Column Breakdown: ISP Deliverability & Bounce Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ISP Distribution */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Recipient ISP Inbox Breakdown
          </h3>

          <div className="space-y-3">
            {ispDistribution.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-white">{item.isp}</span>
                  <span className="font-mono text-emerald-400 font-bold">{item.percentage}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full"
                    style={{ width: `${item.percentage * 1.8}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>Processed: {item.volume}</span>
                  <span className="text-slate-300">{item.reputation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bounce Diagnostics */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Bounce Error Classification
          </h3>

          <div className="space-y-3">
            {bounceDiagnostics.map((b, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <code className="text-indigo-400 font-bold font-mono">{b.code}</code>
                  <span className="font-mono text-xs text-slate-300">{b.count} events ({b.pct})</span>
                </div>
                <p className="text-[11px] text-slate-400">{b.reason}</p>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/30 text-xs text-amber-300">
            Hard bounce occurrences are immediately piped into the suppression engine to safeguard domain reputation.
          </div>
        </div>

      </div>

      {/* Geographic Latency & Distribution */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          Geographic Distribution & Handshake Latency
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {geoBreakdown.map((g, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-white">{g.region}</div>
              <div className="text-xl font-bold font-mono text-white">{g.volume}</div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Share: {g.pct}%</span>
                <span className="text-cyan-400 font-mono">MTA Latency: {g.latency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
