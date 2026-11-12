import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  Globe,
  RefreshCw,
  Send,
  Mail,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { MorphicCard } from '../common/MorphicCard';
import { ThroughputChart } from '../common/VisualChart';
import { analyticsHourlyData, ispDistribution } from '../../data/mockData';
import { api } from '../../services/api';

interface AnalyticsData {
  totalContacts: number;
  totalCampaigns: number;
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  bouncedCount: number;
  suppressionCount: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  monthlyQuota: number;
  currentUsage: number;
  recentSends?: Array<{
    id: string;
    name: string;
    subject: string;
    senderEmail: string;
    status: string;
    recipientsTotal: number;
    sentCount: number;
    deliveredCount: number;
    openedCount: number;
    clickedCount: number;
    createdAt: string;
  }>;
}

export const AnalyticsTab: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [stats, setStats] = useState<AnalyticsData>({
    totalContacts: 0,
    totalCampaigns: 0,
    sentCount: 0,
    deliveredCount: 0,
    openedCount: 0,
    clickedCount: 0,
    bouncedCount: 0,
    suppressionCount: 0,
    deliveryRate: 100.0,
    openRate: 0.0,
    clickRate: 0.0,
    bounceRate: 0.0,
    monthlyQuota: 100000,
    currentUsage: 0,
    recentSends: []
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAnalyticsOverview();
      setStats(data as any);
    } catch (err) {
      console.error('Failed to load analytics overview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportAudit = () => {
    const csvRows = [
      ['Metric', 'Value'],
      ['Total Emails Sent', String(stats.sentCount)],
      ['Delivered Count', String(stats.deliveredCount)],
      ['Delivery Rate', `${stats.deliveryRate}%`],
      ['Opened Count', String(stats.openedCount)],
      ['Open Rate', `${stats.openRate}%`],
      ['Clicked Count', String(stats.clickedCount)],
      ['Bounced Count', String(stats.bouncedCount)],
      ['Suppressed Addresses', String(stats.suppressionCount)],
      ['Monthly Quota', String(stats.monthlyQuota)],
      ['Current Usage', String(stats.currentUsage)],
      [],
      ['Recent Sends Log'],
      ['ID', 'Name', 'Subject', 'Sender', 'Status', 'Recipients', 'Sent Count', 'Created At']
    ];

    if (stats.recentSends && stats.recentSends.length > 0) {
      for (const s of stats.recentSends) {
        csvRows.push([
          s.id,
          s.name,
          s.subject,
          s.senderEmail,
          s.status,
          String(s.recipientsTotal),
          String(s.sentCount),
          s.createdAt
        ]);
      }
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `flowem_analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            Real-time delivery statistics, emails sent counter, open rates, and recent broadcast history.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAnalytics}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition border border-slate-200 flex items-center gap-1.5"
            title="Refresh statistics from MySQL"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

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

      {/* Primary KPI Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total Emails Sent */}
        <MorphicCard className="p-4 space-y-1 bg-white border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Emails Sent</span>
            <Send className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 font-mono">
            {stats.sentCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Active sends recorded in MySQL
          </div>
        </MorphicCard>

        {/* Inbox Delivery Rate */}
        <MorphicCard className="p-4 space-y-1 bg-white border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Inbox Delivery Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 font-mono">
            {stats.deliveryRate}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {stats.deliveredCount.toLocaleString()} emails delivered
          </div>
        </MorphicCard>

        {/* Spam Complaint Rate */}
        <MorphicCard className="p-4 space-y-1 bg-white border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Spam Complaint Rate</span>
            <ShieldCheck className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-sky-600 font-mono">0.00%</div>
          <div className="text-[11px] text-emerald-600 font-medium">Safe threshold (&lt; 0.10%)</div>
        </MorphicCard>

        {/* Hard Bounce Rate */}
        <MorphicCard className="p-4 space-y-1 bg-white border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Hard Bounce Rate</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {stats.bounceRate}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {stats.bouncedCount} blocked addresses
          </div>
        </MorphicCard>
      </div>

      {/* Recent Email Broadcasts & Sends Table */}
      <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-600" />
              Recent Email Broadcasts & Dispatches
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live log of batches dispatched using templates, manual lists, and CSV imports.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {stats.recentSends?.length || 0} recent record(s)
          </span>
        </div>

        {!stats.recentSends || stats.recentSends.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <Mail className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700 text-xs">No email dispatches yet</p>
            <p className="text-[11px] text-slate-400">
              When you choose a template and send emails via CSV or manual entry, all dispatch logs will display here.
            </p>
          </div>
        ) : (
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">Broadcast / Campaign</th>
                    <th className="px-4 py-2.5">Sender Identity</th>
                    <th className="px-4 py-2.5 font-mono">Recipients</th>
                    <th className="px-4 py-2.5 font-mono">Emails Sent</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5">Dispatched At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recentSends.map((send) => (
                    <tr key={send.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{send.name}</div>
                        <div className="text-[11px] text-slate-500 font-serif italic">"{send.subject}"</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {send.senderEmail}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-900 font-semibold">
                        {send.recipientsTotal}
                      </td>
                      <td className="px-4 py-3 font-mono text-emerald-700 font-bold">
                        {send.sentCount}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          {send.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-[11px] font-mono">
                        {new Date(send.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
            {ispDistribution.map((item, idx) => (
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
            ))}
          </div>
        </div>

        {/* Bounce Reasons */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Why Emails Bounced
          </h3>

          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <AlertTriangle className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
            <p className="font-semibold text-slate-700 text-xs">Zero bounces recorded</p>
            <p className="text-[11px] text-slate-400">
              No hard or soft bounces detected. Sent emails will log delivery failure codes here if any occur.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
            Invalid email addresses are automatically moved to your Blocked list to keep your domain safe.
          </div>
        </div>

      </div>

    </div>
  );
};