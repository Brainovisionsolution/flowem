import React, { useState } from 'react';
import { 
  Send, 
  ShieldCheck, 
  Layers, 
  Activity, 
  Server, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  BarChart3, 
  Zap, 
  Globe, 
  FileText, 
  Users,
  Clock,
  Terminal,
  Mail,
  Check,
  ChevronRight
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
  const [activeTab, setActiveTab] = useState<'how' | 'inbox' | 'automation' | 'dns'>('how');
  const [testDomain, setTestDomain] = useState('yourcompany.com');
  const [isCheckingDns, setIsCheckingDns] = useState(false);
  const [dnsChecked, setDnsChecked] = useState(true);

  const handleRunDnsTest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingDns(true);
    setTimeout(() => {
      setIsCheckingDns(false);
      setDnsChecked(true);
    }, 600);
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-[#f8fafc] text-slate-900">
      
      {/* Light Mesh Glow Accents */}
      <div className="mesh-glow bg-indigo-200 w-[600px] h-[600px] -top-32 -left-32"></div>
      <div className="mesh-glow bg-sky-200 w-[500px] h-[500px] top-96 -right-20"></div>
      <div className="mesh-glow bg-emerald-200 w-[450px] h-[450px] bottom-32 left-1/3"></div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold tracking-wide uppercase mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span>Simple Bulk Email Automation Platform</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.18] mb-6">
            Send Bulk Emails Fast and Ensure They Land Straight in the <span className="text-indigo-600">Inbox</span>
          </h1>

          {/* Product Explanation */}
          <p className="text-lg md:text-xl text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto mb-10">
            FlowEM makes it easy to upload your contact lists, design professional emails, and send messages to thousands of people at once. Automatic domain checks (SPF, DKIM, DMARC) ensure your emails reach the primary inbox and avoid the spam folder.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base transition shadow-sm flex items-center justify-center gap-2.5"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 text-indigo-200" />
            </button>
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium text-base transition border border-slate-300 flex items-center justify-center gap-2 shadow-sm"
            >
              <Lock className="w-4 h-4 text-slate-500" />
              <span>Log In</span>
            </button>
            <button
              onClick={onEnterDashboard}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-base transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Open Live Dashboard</span>
            </button>
          </div>

          {/* Simple trust bullets */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              99.8% Inbox Delivery Rate
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              Automatic SPF, DKIM & DMARC Setup
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              1-Click Unsubscribe Header Included
            </span>
          </div>

        </div>

        {/* Hero Visual Mockup: Light Theme Console Frame */}
        <div className="mt-14 max-w-6xl mx-auto">
          <div className="glass-card rounded-2xl p-5 sm:p-7 shadow-lg border border-slate-200 relative overflow-hidden bg-white">
            
            {/* Header of Console */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="h-4 w-px bg-slate-300 mx-1"></div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-700">
                  <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                  <span>flowem-cluster.east.mail</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-sans font-semibold">
                    ACTIVE (24 SERVERS)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
                <div>
                  <span className="text-slate-400">SENDING SPEED: </span>
                  <span className="text-indigo-600 font-bold">142,500 / hr</span>
                </div>
                <div className="hidden md:block">
                  <span className="text-slate-400">INBOX RATE: </span>
                  <span className="text-emerald-600 font-bold">99.84%</span>
                </div>
                <div>
                  <span className="text-slate-400">AVG SPEED: </span>
                  <span className="text-sky-600 font-bold">38ms</span>
                </div>
              </div>
            </div>

            {/* Console Body Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
              
              {/* Left Column: Live Throughput Graph */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-600" />
                    Emails Sent Today (Live 24-Hour Graph)
                  </h4>
                  <span className="text-xs text-slate-500 font-mono">1.94 Million Emails Dispatched</span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                  <ThroughputChart data={analyticsHourlyData} height={200} />
                </div>

                {/* Status Tickers */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg border border-slate-200 bg-white text-center shadow-xs">
                    <div className="text-[11px] text-slate-500 uppercase font-semibold">Sending Queue</div>
                    <div className="text-lg font-bold text-slate-900 mt-0.5 font-mono">0.02%</div>
                    <div className="text-[10px] text-emerald-600 font-medium">No delays, fast sending</div>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-white text-center shadow-xs">
                    <div className="text-[11px] text-slate-500 uppercase font-semibold">IP Warm-Up Level</div>
                    <div className="text-lg font-bold text-indigo-600 mt-0.5 font-mono">Stage 4 / 4</div>
                    <div className="text-[10px] text-indigo-600 font-medium">Ready for unlimited volume</div>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-white text-center shadow-xs">
                    <div className="text-[11px] text-slate-500 uppercase font-semibold">Security Encryption</div>
                    <div className="text-lg font-bold text-sky-600 mt-0.5 font-mono">TLS 1.3</div>
                    <div className="text-[10px] text-sky-600 font-medium">Fully secure connections</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Mailbox Provider Success Rates */}
              <div className="lg:col-span-4 space-y-4">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-600" />
                  Delivery by Email Provider
                </h4>

                <div className="space-y-2.5">
                  {[
                    { name: 'Google Workspace / Gmail', rate: 99.9, color: 'bg-emerald-500', vol: '939k emails' },
                    { name: 'Microsoft 365 / Outlook', rate: 99.7, color: 'bg-indigo-600', vol: '622k emails' },
                    { name: 'Yahoo / AOL Mail', rate: 99.8, color: 'bg-sky-500', vol: '217k emails' },
                    { name: 'Apple iCloud Mail', rate: 100.0, color: 'bg-teal-500', vol: '108k emails' },
                    { name: 'Corporate Business Domains', rate: 99.5, color: 'bg-blue-600', vol: '52k emails' },
                  ].map((isp, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-800 font-semibold">{isp.name}</span>
                        <span className="font-mono text-emerald-600 font-bold">{isp.rate}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isp.color}`}
                          style={{ width: `${isp.rate}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                        <span>Volume: {isp.vol}</span>
                        <span className="text-emerald-600">Inbox Success</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex items-center justify-between font-medium">
                  <span>SPF, DKIM & DMARC:</span>
                  <span className="font-mono font-bold text-emerald-700">100% PASSING</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* 4 Numbers Banner */}
      <section className="py-12 border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold text-slate-900 font-mono">99.84%</div>
              <div className="text-xs uppercase font-bold text-indigo-600">Inbox Success Rate</div>
              <p className="text-xs text-slate-500">Emails land in Inbox, not Spam</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold text-sky-600 font-mono">42 ms</div>
              <div className="text-xs uppercase font-bold text-sky-600">Fast Delivery Speed</div>
              <p className="text-xs text-slate-500">Delivered within seconds of sending</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold text-slate-900 font-mono">14.8 M</div>
              <div className="text-xs uppercase font-bold text-indigo-600">Emails Sent Monthly</div>
              <p className="text-xs text-slate-500">Trusted by fast-growing companies</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold text-emerald-600 font-mono">99.99%</div>
              <div className="text-xs uppercase font-bold text-emerald-600">Platform Uptime</div>
              <p className="text-xs text-slate-500">Always online and ready to send</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section (Product Explanation - No Theory) */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <MorphicBadge label="How It Works" variant="purple" />
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-3 mb-4">
            Send Email Campaigns in 4 Simple Steps
          </h2>
          <p className="text-base text-slate-600">
            No complex setup required. Here is how FlowEM sends your emails from start to finish.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-mono font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900">Add Your Contacts</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload a CSV spreadsheet or type in your customer emails. FlowEM removes duplicates and checks formatting automatically.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center font-mono font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900">Choose a Template</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pick from clean, responsive designs for newsletters, welcome emails, or announcements. You can also paste your own HTML.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-mono font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900">Set Follow-Up Steps</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Optionally set an automatic rule: send welcome email on day 1, wait 2 days, and send a follow-up if they have not opened yet.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center font-mono font-bold text-sm">
              04
            </div>
            <h3 className="text-base font-bold text-slate-900">Hit Send & See Results</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Send instantly or schedule for later. View real-time numbers of who opened, who clicked your links, and who replied.
            </p>
          </div>

        </div>
      </section>

      {/* Interactive Tabs: Clean Product Showcases */}
      <section id="inbox-safety" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <MorphicBadge label="Product Capabilities" variant="info" />
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mt-3 mb-2">
            Explore the Platform Features
          </h2>
          <p className="text-sm text-slate-600">
            Click any tab below to see how each tool works in real life.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-8 overflow-x-auto pb-2">
          <div className="inline-flex p-1.5 rounded-xl bg-slate-100 border border-slate-200">
            {[
              { id: 'how', label: '1. Contact Management' },
              { id: 'inbox', label: '2. High Inbox Delivery' },
              { id: 'automation', label: '3. Automated Follow-Ups' },
              { id: 'dns', label: '4. Domain Check Tool' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Contacts */}
        {activeTab === 'how' && (
          <div className="glass-card rounded-2xl p-8 border border-slate-200 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Contacts & Lists</span>
                <h3 className="text-2xl font-bold text-slate-900">Manage All Your Contacts in One Place</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Store hundreds of thousands of contacts with tags, custom lists, and engagement scores. The platform automatically separates active readers from inactive addresses so your emails stay safe.
                </p>
                <div className="space-y-2 pt-2 text-xs font-medium text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Upload CSV with email, first name, last name, and tags</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Auto-cleaning removes bad emails and prevents bounces</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Create dynamic segments that update automatically</span>
                  </div>
                </div>
              </div>
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 font-mono text-xs">
                <div className="flex justify-between pb-2 border-b border-slate-200 text-slate-500 font-sans">
                  <span className="font-bold text-slate-800">Sample Contact Record</span>
                  <span className="text-emerald-700 font-semibold">Active Subscriber</span>
                </div>
                <div className="space-y-1.5 text-slate-700 font-sans">
                  <div>Name: <strong className="text-slate-900">Sarah Jenkins</strong></div>
                  <div>Email: <strong className="text-indigo-600 font-mono">sarah.jenkins@company.com</strong></div>
                  <div>List: <strong className="text-slate-800">New Customers & Accounts</strong></div>
                  <div>Engagement: <strong className="text-emerald-700">94% (Opens almost every email)</strong></div>
                  <div>Tags: <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs">Customer</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: High Inbox Delivery */}
        {activeTab === 'inbox' && (
          <div className="glass-card rounded-2xl p-8 border border-slate-200 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Safe Sending</span>
                <h3 className="text-2xl font-bold text-slate-900">Why FlowEM Emails Go to the Inbox</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Email providers like Gmail and Yahoo reject emails if sending is too fast or if domain records are missing. FlowEM warms up your sending volume gradually and verifies your domain so your emails are trusted.
                </p>
                <div className="space-y-2 pt-2 text-xs font-medium text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Gradual IP warm-up ramps up daily emails safely</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Automatic 1-click unsubscribe button in email header</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Spam complaint tracking stops bad emails before blacklists</span>
                  </div>
                </div>
              </div>
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex justify-between font-bold text-slate-800 pb-2 border-b border-slate-200">
                  <span>Daily Safe Sending Limits</span>
                  <span className="text-indigo-600">Auto-Managed</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Week 1 (Seed Stage)</span>
                    <span className="font-mono font-bold text-slate-800">5,000 / day</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Week 2 (Growth Stage)</span>
                    <span className="font-mono font-bold text-slate-800">25,000 / day</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Week 3+ (Full Production)</span>
                    <span className="font-mono font-bold text-emerald-600">100,000+ / day</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Automation */}
        {activeTab === 'automation' && (
          <div className="glass-card rounded-2xl p-8 border border-slate-200 bg-white">
            <div className="max-w-2xl mx-auto text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Automated Flows</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 mb-2">Automate Your Email Sequences</h3>
              <p className="text-sm text-slate-600">
                Send the right email at the right time without lifting a finger.
              </p>
            </div>

            <div className="max-w-xl mx-auto space-y-3">
              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">When: Customer joins "New Customers" list</div>
                  <div className="text-[11px] text-slate-500">Trigger starts immediately</div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-0.5 h-4 bg-slate-300"></div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Action: Send "Simple Welcome Email"</div>
                  <div className="text-[11px] text-slate-500">Personalized with their first name</div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-0.5 h-4 bg-slate-300"></div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Wait: 2 Days</div>
                  <div className="text-[11px] text-slate-500">Allows time for user to read</div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-0.5 h-4 bg-slate-300"></div>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Check: Did they open the email?</div>
                  <div className="text-[11px] text-slate-600">If yes &rarr; Tag as Active Customer. If no &rarr; Send reminder email.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Domain Check Tool */}
        {activeTab === 'dns' && (
          <div className="glass-card rounded-2xl p-8 border border-slate-200 bg-white">
            <div className="max-w-2xl mx-auto text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Domain Checker</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 mb-2">Check Your Domain Setup</h3>
              <p className="text-sm text-slate-600">
                Type your company domain name to test SPF, DKIM, and DMARC records.
              </p>
            </div>

            <form onSubmit={handleRunDnsTest} className="max-w-md mx-auto flex gap-2 mb-6">
              <input
                type="text"
                value={testDomain}
                onChange={(e) => setTestDomain(e.target.value)}
                className="flex-1 glass-input rounded-xl px-4 py-2.5 text-xs font-medium"
                placeholder="yourcompany.com"
              />
              <button
                type="submit"
                disabled={isCheckingDns}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
              >
                {isCheckingDns ? 'Checking...' : 'Check Domain'}
              </button>
            </form>

            <div className="max-w-xl mx-auto space-y-2.5">
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>SPF Record</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Allows FlowEM servers to send on your behalf</div>
                </div>
                <MorphicBadge label="PASSING" variant="success" />
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>DKIM Digital Signature</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Cryptographic 2048-bit key matches receiving servers</div>
                </div>
                <MorphicBadge label="VALID" variant="success" />
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>DMARC Protection Policy</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Protects your brand from email spoofing & phishing</div>
                </div>
                <MorphicBadge label="PROTECTED" variant="success" />
              </div>
            </div>
          </div>
        )}

      </section>

      {/* 6 Core Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <MorphicBadge label="All Platform Tools" variant="purple" />
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-3 mb-4">
            Everything You Need to Run Bulk Email Campaigns
          </h2>
          <p className="text-base text-slate-600">
            A complete suite of tools built for fast sending, clean lists, and high inbox delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <MorphicCard className="space-y-3 bg-white">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Contacts & Lists</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload customer spreadsheets, sort by tags, and build dynamic customer groups that update automatically.
            </p>
          </MorphicCard>

          <MorphicCard className="space-y-3 bg-white">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Campaign Sender</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Send mass announcements, newsletters, or offers. Send immediately or schedule for a specific date and time.
            </p>
          </MorphicCard>

          <MorphicCard className="space-y-3 bg-white">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Ready Email Templates</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Choose from mobile-friendly templates for receipts, monthly digests, and alerts, or paste your own HTML code.
            </p>
          </MorphicCard>

          <MorphicCard className="space-y-3 bg-white">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Live Reports & Stats</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              See how many emails were delivered, opened, or clicked in real time. Track results by Gmail, Outlook, and Yahoo.
            </p>
          </MorphicCard>

          <MorphicCard className="space-y-3 bg-white">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Unsubscribe & Blocked List</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automatically stops sending to people who unsubscribed or invalid email addresses so you never get flagged for spam.
            </p>
          </MorphicCard>

          <MorphicCard className="space-y-3 bg-white">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Automated Sequences</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Set multi-step follow-ups: send email 1, wait 3 days, and automatically send a second email if the first wasn't opened.
            </p>
          </MorphicCard>

        </div>
      </section>

      {/* Pricing / Plan Banner */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-card rounded-3xl p-10 md:p-14 border border-indigo-200 bg-white text-center shadow-lg">
          <div className="max-w-2xl mx-auto space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Start Today</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Ready to Send Bulk Emails that Reach the Inbox?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Join thousands of businesses sending emails with FlowEM. High speeds, clean lists, and easy tools.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                onClick={onOpenRegister}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-sm"
              >
                Create Account
              </button>
              <button
                onClick={onEnterDashboard}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-sm transition border border-slate-300 shadow-sm"
              >
                Explore Live Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800 text-sm">FlowEM</span>
              <span className="ml-2 text-slate-500">Bulk Email Automation Platform</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-5 text-slate-600 font-medium">
            <a href="#how-it-works" className="hover:text-indigo-600 transition">How It Works</a>
            <a href="#features" className="hover:text-indigo-600 transition">Features</a>
            <a href="#inbox-safety" className="hover:text-indigo-600 transition">Inbox Delivery</a>
            <a href="#pricing" className="hover:text-indigo-600 transition">Pricing Plans</a>
          </div>

          <div>
            <span>100% RFC-8058, CAN-SPAM and GDPR Compliant</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
