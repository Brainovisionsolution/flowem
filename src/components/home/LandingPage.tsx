import React, { useState } from 'react';
import { 
  Send, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Activity, 
  Server, 
  CheckCircle2, 
  ArrowRight, 
  Database, 
  Lock, 
  BarChart3, 
  Zap, 
  Globe, 
  Code2, 
  FileText, 
  Sliders, 
  Filter, 
  ExternalLink,
  Users,
  Clock,
  Terminal,
  Compass
} from 'lucide-react';
import { MorphicCard, MorphicBadge } from '../common/MorphicCard';
import { ThroughputChart } from '../common/VisualChart';
import { analyticsHourlyData } from '../../data/mockData';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onEnterDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenRegister,
  onEnterDashboard,
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'warmup' | 'automation' | 'dns'>('architecture');
  const [dnsTestDomain, setDnsTestDomain] = useState('enterprise-sender.com');
  const [dnsChecking, setDnsChecking] = useState(false);
  const [dnsVerified, setDnsVerified] = useState(true);

  const handleTestDns = (e: React.FormEvent) => {
    e.preventDefault();
    setDnsChecking(true);
    setTimeout(() => {
      setDnsChecking(false);
      setDnsVerified(true);
    }, 600);
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background Glow Mesh Gradients */}
      <div className="mesh-glow bg-indigo-600 w-[600px] h-[600px] -top-40 -left-40"></div>
      <div className="mesh-glow bg-cyan-600 w-[500px] h-[500px] top-96 -right-20"></div>
      <div className="mesh-glow bg-purple-600 w-[550px] h-[550px] bottom-40 left-1/3"></div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs tracking-wider uppercase backdrop-blur-md mb-8 shadow-glass-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span>Next-Generation Bulk Email Infrastructure</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.15] mb-6">
            Autonomous Bulk Email Automation Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-200">Sub-Second Delivery</span>
          </h1>

          {/* Subtitle / Explanation */}
          <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl mx-auto mb-10">
            FlowEM is an enterprise-tier bulk email automation platform with distributed MTA clustering, autonomous IP warm-up protocols, real-time bounce suppression, and visual multi-branch customer journeys. Achieve 99.8% inbox placement with full compliance across global ISPs.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base transition-all shadow-glow-indigo border border-indigo-400/40 flex items-center justify-center gap-3"
            >
              <span>Get Started with FlowEM</span>
              <ArrowRight className="w-5 h-5 text-indigo-200" />
            </button>
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-base transition border border-slate-700/80 flex items-center justify-center gap-2.5 backdrop-blur-md shadow-glass-sm"
            >
              <Lock className="w-4 h-4 text-slate-400" />
              <span>Log In to Workspace</span>
            </button>
            <button
              onClick={onEnterDashboard}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-cyan-300 hover:text-cyan-200 font-medium text-base transition border border-cyan-500/30 flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Open Live Platform Console</span>
            </button>
          </div>

          {/* Micro trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              RFC-8058 One-Click Unsubscribe Compliant
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Automated SPF, DKIM & DMARC Validation
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Zero Setup Fees & Dedicated IP Pools
            </span>
          </div>

        </div>

        {/* Hero Visual Mockup: FlowEM Live Dispatch Engine Console */}
        <div className="mt-14 max-w-6xl mx-auto">
          <div className="glass-card rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/10 relative overflow-hidden">
            
            {/* Header of Glass Console */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <div className="h-4 w-px bg-slate-700 mx-1"></div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>flowem-mta-cluster.us-east-1.internal</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-sans">
                    ONLINE (24 NODES)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
                <div>
                  <span className="text-slate-500">DISPATCH RATE: </span>
                  <span className="text-indigo-300 font-semibold">142,500 / hr</span>
                </div>
                <div className="hidden md:block">
                  <span className="text-slate-500">INBOX SCORE: </span>
                  <span className="text-emerald-400 font-semibold">99.84%</span>
                </div>
                <div>
                  <span className="text-slate-500">AVG LATENCY: </span>
                  <span className="text-cyan-400 font-semibold">38ms</span>
                </div>
              </div>
            </div>

            {/* Console Body Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
              
              {/* Left Column: Live Throughput Graph */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    Distributed Transmission Throughput (Last 24 Hours)
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">1.94M Transmissions Today</span>
                </div>

                <div className="glass-panel p-4 rounded-xl border border-white/5">
                  <ThroughputChart data={analyticsHourlyData} height={200} />
                </div>

                {/* Status Tickers */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="morphic-concave p-3 rounded-lg text-center">
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider">MTA Cluster Queue</div>
                    <div className="text-lg font-bold text-white mt-0.5 font-mono">0.02%</div>
                    <div className="text-[10px] text-emerald-400">Zero Backlog Delay</div>
                  </div>
                  <div className="morphic-concave p-3 rounded-lg text-center">
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider">IP Warm-up Stage</div>
                    <div className="text-lg font-bold text-indigo-300 mt-0.5 font-mono">Stage 4 / 4</div>
                    <div className="text-[10px] text-indigo-400">Unrestricted Volume</div>
                  </div>
                  <div className="morphic-concave p-3 rounded-lg text-center">
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider">TLS 1.3 Cipher</div>
                    <div className="text-lg font-bold text-cyan-300 mt-0.5 font-mono">ChaCha20</div>
                    <div className="text-[10px] text-cyan-400">PFS Enforced</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Recipient ISP Placement Breakdown */}
              <div className="lg:col-span-4 space-y-4">
                <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  ISP Inboxing Telemetry
                </h4>

                <div className="space-y-2.5">
                  {[
                    { name: 'Google Workspace / Gmail', rate: 99.9, color: 'bg-emerald-500', vol: '939k' },
                    { name: 'Microsoft 365 / Outlook', rate: 99.7, color: 'bg-indigo-500', vol: '622k' },
                    { name: 'Yahoo / AOL Mail', rate: 99.8, color: 'bg-cyan-500', vol: '217k' },
                    { name: 'Apple iCloud Relay', rate: 100.0, color: 'bg-teal-500', vol: '108k' },
                    { name: 'Corporate Dedicated MTAs', rate: 99.5, color: 'bg-blue-500', vol: '52k' },
                  ].map((isp, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-300 font-medium">{isp.name}</span>
                        <span className="font-mono text-emerald-400 font-semibold">{isp.rate}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isp.color}`}
                          style={{ width: `${isp.rate}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                        <span>Volume: {isp.vol}</span>
                        <span>0.01% Complaint</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-800/30 text-xs text-indigo-300 flex items-center justify-between">
                  <span>SPF / DKIM / DMARC:</span>
                  <span className="font-mono font-bold text-emerald-400">100% ALIGNED</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* SLA & Metric Highlights */}
      <section id="sla" className="py-12 border-y border-white/5 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold text-white font-mono tracking-tight">99.84%</div>
              <div className="text-xs uppercase tracking-wider text-indigo-400 font-medium">Inbox Placement Ratio</div>
              <p className="text-xs text-slate-400">Verified across top global mail transfer agents</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold text-cyan-300 font-mono tracking-tight">42 ms</div>
              <div className="text-xs uppercase tracking-wider text-cyan-400 font-medium">Average Dispatch Latency</div>
              <p className="text-xs text-slate-400">From API receipt to recipient server handshake</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold text-white font-mono tracking-tight">14.8 B</div>
              <div className="text-xs uppercase tracking-wider text-indigo-400 font-medium">Monthly Dispatched Volumes</div>
              <p className="text-xs text-slate-400">Powering high-scale global enterprise operations</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold text-emerald-300 font-mono tracking-tight">99.999%</div>
              <div className="text-xs uppercase tracking-wider text-emerald-400 font-medium">Infrastructure SLA</div>
              <p className="text-xs text-slate-400">Guaranteed uptime with multi-region failover</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Platform Architecture & Deep Dive */}
      <section id="architecture" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs tracking-wider uppercase mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>High-Throughput Core Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Built from the Ground Up for Mission-Critical Bulk Delivery
          </h2>
          <p className="text-base text-slate-300 leading-relaxed">
            Unlike legacy SMTP providers that bottleneck on monolithic queues, FlowEM operates a partitioned, multi-region MTA network with dynamic sender reputation routing.
          </p>
        </div>

        {/* Interactive Architecture Tabs */}
        <div className="flex justify-center mb-10 overflow-x-auto pb-2">
          <div className="inline-flex p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
            {[
              { id: 'architecture', label: 'MTA Distributed Pipeline' },
              { id: 'warmup', label: 'Autonomous IP Warm-Up' },
              { id: 'automation', label: 'Multi-Branch Journey Builder' },
              { id: 'dns', label: 'DNS & DMARC Checker Tool' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Architecture Pipeline */}
        {activeTab === 'architecture' && (
          <div className="glass-card rounded-2xl p-8 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              
              <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-mono font-bold text-sm">
                  01
                </div>
                <h4 className="text-base font-semibold text-white">Inbound Queue & Validation</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Bulk CSV uploads or high-speed REST API streams are ingested into redundant Kafka/Redis buffer pools. Real-time syntax and MX verification eliminate dead addresses prior to queueing.
                </p>
                <div className="pt-2 text-[11px] font-mono text-cyan-300">Rate: 50,000 req/sec</div>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-sm">
                  02
                </div>
                <h4 className="text-base font-semibold text-white">ISP Throttling & Policy Engine</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Adaptive algorithms track real-time recipient ISP response codes. Hourly sending rates automatically throttle down if Google or Microsoft signals rate-limiting, preventing greylisting.
                </p>
                <div className="pt-2 text-[11px] font-mono text-emerald-300">Zero Spamtrap Hits</div>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-mono font-bold text-sm">
                  03
                </div>
                <h4 className="text-base font-semibold text-white">Dedicated IP Routing Pool</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Traffic is distributed across dedicated class C IP blocks. High-engagement recipients are sequenced first to establish pristine sender reputation with major spam filters.
                </p>
                <div className="pt-2 text-[11px] font-mono text-indigo-300">Dedicated IP Isolation</div>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-sm">
                  04
                </div>
                <h4 className="text-base font-semibold text-white">Real-Time Feedback Loop & FBL</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Hard bounces, unsubscribes, and ISP spam complaints trigger instant automatic suppression across all future campaigns, protecting domain reputation permanently.
                </p>
                <div className="pt-2 text-[11px] font-mono text-teal-300">RFC-8058 Automatic Sync</div>
              </div>

            </div>

            <div className="mt-8 p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-indigo-400" />
                <span className="text-xs text-slate-300">
                  Global Edge Nodes: <strong className="text-white">Ashburn (VA), Frankfurt (DE), Tokyo (JP), London (UK)</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>All 24 Nodes Healthy & TLS 1.3 Certified</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Autonomous Warm-Up */}
        {activeTab === 'warmup' && (
          <div className="glass-card rounded-2xl p-8 border border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <MorphicBadge label="Smart Deliverability" variant="purple" />
                <h3 className="text-2xl font-bold text-white">
                  Automated Gradual IP Escalation Without Human Guesswork
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Fresh IP addresses and new sender subdomains require calculated volume escalation to establish credibility with mail algorithms. FlowEM calculates daily sending increments tailored to your recipient list distribution.
                </p>
                
                <div className="space-y-3 pt-2">
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <div className="flex justify-between text-xs font-semibold text-slate-200">
                      <span>Phase 1: Seed List & Highly Engaged (Days 1 - 7)</span>
                      <span className="text-indigo-400 font-mono">5,000 / day</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Establishes initial 40%+ open rate baseline with recipient mailbox providers.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <div className="flex justify-between text-xs font-semibold text-slate-200">
                      <span>Phase 2: Core Subscriber Segment (Days 8 - 14)</span>
                      <span className="text-cyan-400 font-mono">25,000 / day</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Expands distribution into secondary domains while monitoring Google Postmaster reputation.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <div className="flex justify-between text-xs font-semibold text-slate-200">
                      <span>Phase 3: High-Volume Production (Days 15 - 21)</span>
                      <span className="text-emerald-400 font-mono">100,000+ / day</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Full speed ahead with automated throttling and zero deliverability drop-offs.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="morphic-concave rounded-xl p-6 border border-white/5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Live Warm-up Gauge</span>
                    <span className="text-xs font-mono text-emerald-400">Reputation: 98 / 100</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Daily Volume Allocation</span>
                        <span className="font-mono text-slate-200">88,400 / 100,000 (88.4%)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: '88.4%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Spam Complaint Threshold</span>
                        <span className="font-mono text-emerald-400">0.01% (Target &lt; 0.08%)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '12%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Hard Bounce Tolerance</span>
                        <span className="font-mono text-cyan-400">0.14% (Target &lt; 0.50%)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-cyan-500 h-full rounded-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Automation Canvas Preview */}
        {activeTab === 'automation' && (
          <div className="glass-card rounded-2xl p-8 border border-white/10">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Visual Multi-Branch Journey Canvas</h3>
              <p className="text-sm text-slate-300">
                Trigger personalized email dispatches based on user behavior, webhook events, or segment membership with zero programming required.
              </p>
            </div>

            {/* Visual Node Flow */}
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/40 flex items-center justify-between shadow-glow-indigo">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Trigger: Contact Subscribed to "Enterprise Leads"</div>
                    <div className="text-xs text-slate-400">Inbound double opt-in verification complete</div>
                  </div>
                </div>
                <MorphicBadge label="Trigger Node" variant="purple" />
              </div>

              <div className="flex justify-center">
                <div className="w-0.5 h-6 bg-slate-700"></div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Time Delay: Wait 15 Minutes</div>
                    <div className="text-xs text-slate-400">Sync contact attributes with CRM records</div>
                  </div>
                </div>
                <MorphicBadge label="Delay Node" variant="info" />
              </div>

              <div className="flex justify-center">
                <div className="w-0.5 h-6 bg-slate-700"></div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Send Email: Technical Architecture Advisory</div>
                    <div className="text-xs text-slate-400">Domain: dispatch.flowem-enterprise.net | Template #tpl-201</div>
                  </div>
                </div>
                <MorphicBadge label="Dispatch Node" variant="success" />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Live DNS & DMARC Checker Tool */}
        {activeTab === 'dns' && (
          <div className="glass-card rounded-2xl p-8 border border-white/10">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Simulated DNS Authentication Verifier</h3>
              <p className="text-sm text-slate-300">
                Test your sending domain against RFC specifications for SPF, DKIM 2048-bit, and DMARC enforcement.
              </p>
            </div>

            <form onSubmit={handleTestDns} className="max-w-xl mx-auto flex gap-3 mb-8">
              <input
                type="text"
                value={dnsTestDomain}
                onChange={(e) => setDnsTestDomain(e.target.value)}
                className="flex-1 glass-input rounded-xl px-4 py-3 text-sm"
                placeholder="domain.com"
              />
              <button
                type="submit"
                disabled={dnsChecking}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition shadow-glow-indigo disabled:opacity-50"
              >
                {dnsChecking ? 'Querying DNS...' : 'Verify DNS Records'}
              </button>
            </form>

            <div className="max-w-2xl mx-auto space-y-3">
              <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-500/30 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>SPF Record (Sender Policy Framework)</span>
                  </div>
                  <code className="text-xs font-mono text-slate-400 block">v=spf1 include:_spf.flowem.net ~all</code>
                </div>
                <MorphicBadge label="Valid Record" variant="success" />
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-500/30 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>DKIM Signature (DomainKeys Identified Mail)</span>
                  </div>
                  <code className="text-xs font-mono text-slate-400 block">k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ...</code>
                </div>
                <MorphicBadge label="2048-Bit Aligned" variant="success" />
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-500/30 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>DMARC Enforcement Policy</span>
                  </div>
                  <code className="text-xs font-mono text-slate-400 block">v=DMARC1; p=reject; rua=mailto:dmarc@flowem.net</code>
                </div>
                <MorphicBadge label="Policy: Reject" variant="success" />
              </div>
            </div>
          </div>
        )}

      </section>

      {/* 4 Pillars Section with Rich Visuals */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <MorphicBadge label="Engineered Capabilities" variant="info" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-3 mb-4">
            Everything Required for High-Performance Enterprise Email
          </h2>
          <p className="text-base text-slate-300">
            A cohesive suite of tools tailored for deliverability specialists, system engineers, and marketing operators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <MorphicCard glow="indigo" className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Contacts & Dynamic Lists</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Upload millions of subscribers with automatic deduplication, attribute mapping, and dynamic SQL-like segment criteria that update in real time.
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Real-time double opt-in logs
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Engagement score recalculation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Automated hygiene scrubbing
              </li>
            </ul>
          </MorphicCard>

          <MorphicCard glow="cyan" className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Send className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Mass Campaign Orchestrator</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Configure multi-recipient broadcasts with AB split tests, custom throttle scheduling, and real-time delivery telemetry as dispatches occur.
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Multi-variable subject testing
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Subdomain & sender rotation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Rate-limiting per mailbox provider
              </li>
            </ul>
          </MorphicCard>

          <MorphicCard glow="emerald" className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Responsive Template Library</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Craft pixel-perfect HTML layouts that render cleanly across Outlook 2016 to Apple Mail on iOS with integrated desktop and mobile preview toggle.
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Jinja / Liquid dynamic variables
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> CSS inliner & minifier
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Dark mode render validation
              </li>
            </ul>
          </MorphicCard>

          <MorphicCard glow="none" className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Granular Analytics & Telemetry</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Track open timestamps, device fingerprints, click coordinates, ISP deliverability distribution, and bounce error classifications in real time.
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> ISP-specific inbox rate breakdown
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Bounce code diagnostic logs
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Exportable audit compliance CSV
              </li>
            </ul>
          </MorphicCard>

          <MorphicCard glow="none" className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Suppression & Compliance Shield</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Enforce global suppression lists with automated unsubscribe link injection, complaint processing, and compliance reporting under GDPR, CAN-SPAM, and CASL.
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> RFC-8058 List-Unsubscribe headers
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Hard bounce suppression lock
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Manual override protections
              </li>
            </ul>
          </MorphicCard>

          <MorphicCard glow="none" className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Multi-Tenant RBAC & Security</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Manage organization quotas, provision REST API tokens with scoping, mandate hardware 2FA, and configure webhook delivery feeds for internal systems.
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Granular roles: Admin, Engineer, Analyst
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Webhook HMAC-SHA256 signatures
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> SOC 2 Type II audit logging
              </li>
            </ul>
          </MorphicCard>

        </div>
      </section>

      {/* Compliance & Standards Showcase */}
      <section id="compliance" className="py-20 bg-slate-950/60 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-5">
              <MorphicBadge label="Strict Compliance" variant="neutral" />
              <h2 className="text-3xl font-bold text-white">
                Engineered for Zero-Tolerance Legal and Regulatory Standards
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Global email laws demand strict opt-out handling and domain verification. FlowEM automatically implements RFC standards so your domain avoids blacklists and legal penalties.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">RFC-8058 One-Click List-Unsubscribe</h4>
                    <p className="text-xs text-slate-400">Enforces Google and Yahoo 2024+ mandatory email sender requirements without manual code editing.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">GDPR & CASL Consent Logging</h4>
                    <p className="text-xs text-slate-400">Stores cryptographic timestamps and IP address proof of consent for every subscriber in your database.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Automated Feedback Loops (FBL)</h4>
                    <p className="text-xs text-slate-400">Direct integration with Yahoo CFL, Microsoft SNDS/JMRP, and Spamhaus data feeds.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
                  <span>OUTBOUND RFC EMAIL HEADER TELEMETRY</span>
                  <span className="text-emerald-400">TLS 1.3 PASS</span>
                </div>
                <div className="space-y-2 text-slate-300 overflow-x-auto p-4 rounded-lg bg-black/40 border border-slate-800 leading-relaxed">
                  <p><span className="text-indigo-400">From:</span> "FlowEM Enterprise Dispatch" &lt;dispatch@flowem-enterprise.net&gt;</p>
                  <p><span className="text-indigo-400">To:</span> &lt;sarah.jenkins@acme-corp.com&gt;</p>
                  <p><span className="text-indigo-400">DKIM-Signature:</span> v=1; a=rsa-sha256; c=relaxed/relaxed; d=flowem-enterprise.net; s=flw2026; bh=47DEQpj8...;</p>
                  <p><span className="text-indigo-400">Authentication-Results:</span> spf=pass (flowem.net: sender IP is 198.51.100.24) smtp.mailfrom=flowem-enterprise.net; dkim=pass header.i=@flowem-enterprise.net;</p>
                  <p><span className="text-indigo-400">List-Unsubscribe:</span> &lt;https://flowem.net/u/c994821a&gt;, &lt;mailto:unsub@flowem.net?subject=c994821a&gt;</p>
                  <p><span className="text-indigo-400">List-Unsubscribe-Post:</span> List-Unsubscribe=One-Click</p>
                  <p><span className="text-indigo-400">Feedback-ID:</span> cmp-901:lst-01:flw_tenant_44:flowem</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Enterprise Call to Action */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-card rounded-3xl p-10 md:p-16 border border-indigo-500/30 text-center relative overflow-hidden shadow-glow-indigo">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Ready to Upgrade Your Bulk Email Infrastructure?
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Transition your campaigns to FlowEM. Enjoy dedicated IP warm-up, continuous deliverability monitoring, and zero-compromise deliverability at scale.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={onOpenRegister}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base transition shadow-glow-indigo border border-indigo-400/40"
              >
                Create Enterprise Account
              </button>
              <button
                onClick={onEnterDashboard}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-base transition border border-slate-700 backdrop-blur-md"
              >
                Explore Live Demo Platform
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#04060d] py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-300 text-sm">FlowEM</span>
              <span className="ml-2 text-slate-500">Bulk Email Automation Systems Inc.</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-slate-400">
            <a href="#architecture" className="hover:text-indigo-400 transition">MTA Nodes</a>
            <a href="#deliverability" className="hover:text-indigo-400 transition">Deliverability</a>
            <a href="#features" className="hover:text-indigo-400 transition">Platform Features</a>
            <a href="#compliance" className="hover:text-indigo-400 transition">RFC-8058 Guidelines</a>
            <a href="#sla" className="hover:text-indigo-400 transition">Telemetry & SLA</a>
          </div>

          <div>
            <span>SOC-2 Type II Certified | ISO 27001 | HIPAA Compliant</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
