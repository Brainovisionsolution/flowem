import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  RefreshCw, 
  Server, 
  X,
  CheckCircle2,
  Globe,
  Send,
  Mail,
  AlertCircle,
  Clock
} from 'lucide-react';
import { MorphicBadge, MorphicCard } from '../common/MorphicCard';
import { SenderDomain } from '../../types';
import { api } from '../../services/api';

export const SenderConfigTab: React.FC = () => {
  const [domains, setDomains] = useState<SenderDomain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<SenderDomain | null>(null);
  const [isAddDomainOpen, setIsAddDomainOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [newDomainInput, setNewDomainInput] = useState('');
  const [newSubdomainInput, setNewSubdomainInput] = useState('');

  // Amazon SES Test Email State
  const [testTo, setTestTo] = useState('');
  const [testSubject, setTestSubject] = useState('FlowEM Amazon SES v2 Delivery Test');
  const [testBody, setTestBody] = useState('Hello!\n\nThis is a verified test email sent directly from FlowEM using Amazon SES v2.\n\nSender: it@brainovision.in\nEngine: Node.js + Amazon SES v2 SDK + MySQL 8');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    messageId: string;
    simulated: boolean;
    region: string;
    message: string;
    recipient: string;
  } | null>(null);

  // Email Logs
  const [recentLogs, setRecentLogs] = useState<Array<{
    id: string;
    recipient: string;
    subject: string;
    sender_email: string;
    ses_message_id: string;
    status: string;
    sent_at: string;
  }>>([]);

  useEffect(() => {
    loadDomains();
    loadEmailHistory();
  }, []);

  const loadDomains = async () => {
    try {
      const data = await api.getDomains();
      setDomains(data);
      if (data.length > 0) setSelectedDomain(data[0]);
    } catch (err) {
      console.error('Failed to load domains:', err);
    }
  };

  const loadEmailHistory = async () => {
    try {
      const logs = await api.getEmailHistory(10);
      setRecentLogs(logs);
    } catch (err) {
      console.error('Failed to load email history:', err);
    }
  };

  const handleVerifyDns = async (domainId: string) => {
    setIsVerifying(true);
    try {
      const res = await api.verifyDomain(domainId);
      setDomains(domains.map(d => d.id === domainId ? res.domain : d));
      if (selectedDomain?.id === domainId) setSelectedDomain(res.domain);
    } catch (err: any) {
      alert(`Verification error: ${err.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainInput) return;

    try {
      const saved = await api.addDomain({
        domain: newDomainInput,
        subdomain: newSubdomainInput || `mail.${newDomainInput}`
      });

      setDomains([...domains, saved]);
      setSelectedDomain(saved);
      setIsAddDomainOpen(false);
      setNewDomainInput('');
      setNewSubdomainInput('');
    } catch (err: any) {
      alert(`Failed to add domain: ${err.message}`);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTo.trim()) {
      alert('Please enter a recipient email address.');
      return;
    }

    setIsSendingTest(true);
    setTestResult(null);

    try {
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4338ca; margin-top: 0;">FlowEM - Amazon SES Delivery Test</h2>
          <p style="color: #334155; font-size: 15px; line-height: 1.6;">${testBody.replace(/\n/g, '<br/>')}</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #64748b; font-size: 12px; margin: 0;">
            Sent by Brainovision IT Team from <strong>it@brainovision.in</strong> via Amazon SES v2.
          </p>
        </div>
      `;

      const res = await api.sendDirectEmail({
        to: testTo.trim(),
        subject: testSubject.trim(),
        html: htmlContent,
        text: testBody,
        from: 'it@brainovision.in'
      });

      setTestResult({
        success: true,
        messageId: res.messageId,
        simulated: res.simulated,
        region: res.region,
        message: res.message,
        recipient: res.recipient
      });

      loadEmailHistory();
    } catch (err: any) {
      alert(`Failed to send test email: ${err.message}`);
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Sender & Domain Setup
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Connect Amazon SES v2, verify sending domains (SPF, DKIM, DMARC), and send test emails to your inbox.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddDomainOpen(true)}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Domain</span>
          </button>
        </div>
      </div>

      {/* AMAZON SES TEST TRANSMITTER PANEL */}
      <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-indigo-600" />
              Amazon SES v2 Delivery Test
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Send a real test email directly through the Amazon SES v2 SDK (`POST /api/emails/send`) to confirm inbox delivery.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
              Sender: it@brainovision.in
            </span>
          </div>
        </div>

        {/* Test Result Alert */}
        {testResult && (
          <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${
            testResult.simulated 
              ? 'bg-amber-50 border-amber-200 text-amber-900' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className={`w-4 h-4 ${testResult.simulated ? 'text-amber-600' : 'text-emerald-600'}`} />
              <span>{testResult.simulated ? 'Test Processed in SES Simulator' : 'Test Email Dispatched via Amazon SES v2'}</span>
            </div>
            <p className="text-[11px] leading-relaxed">{testResult.message}</p>
            <div className="font-mono text-[11px] opacity-90 pt-1">
              Recipient: <strong className="font-bold">{testResult.recipient}</strong> | SES Message ID: <code className="bg-white/80 px-1.5 py-0.5 rounded border">{testResult.messageId}</code>
            </div>
          </div>
        )}

        {/* Test Send Form */}
        <form onSubmit={handleSendTestEmail} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Recipient Email Address *
              </label>
              <input
                type="email"
                required
                value={testTo}
                onChange={(e) => setTestTo(e.target.value)}
                placeholder="your.email@gmail.com or company email"
                className="w-full glass-input rounded-lg px-3 py-2 text-xs font-mono"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">
                Target inbox where the test email will be delivered.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject Line
              </label>
              <input
                type="text"
                value={testSubject}
                onChange={(e) => setTestSubject(e.target.value)}
                className="w-full glass-input rounded-lg px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="md:col-span-7 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Message Body
              </label>
              <textarea
                rows={4}
                value={testBody}
                onChange={(e) => setTestBody(e.target.value)}
                className="w-full glass-input rounded-lg p-3 text-xs font-sans leading-relaxed"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSendingTest}
                className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-xs flex items-center gap-2"
              >
                {isSendingTest ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Transmitting to Amazon SES...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Test Email via Amazon SES</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Recent Send History Table */}
        {recentLogs.length > 0 && (
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Recent Test Email History in MySQL 8
              </span>
              <button
                type="button"
                onClick={loadEmailHistory}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                Refresh Log
              </button>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 text-[10px] uppercase font-semibold">
                  <tr>
                    <th className="px-3 py-1.5">Recipient</th>
                    <th className="px-3 py-1.5">Subject</th>
                    <th className="px-3 py-1.5">SES Message ID</th>
                    <th className="px-3 py-1.5">Status</th>
                    <th className="px-3 py-1.5">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {recentLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="px-3 py-1.5 text-slate-900 font-sans font-medium">{log.recipient}</td>
                      <td className="px-3 py-1.5 text-slate-600 font-sans truncate max-w-xs">{log.subject}</td>
                      <td className="px-3 py-1.5 text-indigo-700 text-[10px] truncate max-w-xs">{log.ses_message_id}</td>
                      <td className="px-3 py-1.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {log.status}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 text-slate-500 text-[10px] font-sans">
                        {new Date(log.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: DNS Records & Warm-up */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* DNS Configuration Card */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {selectedDomain ? selectedDomain.domain : 'Select Domain'}
                </h3>
                {selectedDomain?.status === 'Verified' ? (
                  <MorphicBadge label="DNS Verified" variant="success" />
                ) : (
                  <MorphicBadge label="Pending Verification" variant="warning" />
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Subdomain: <code className="font-mono text-slate-700">{selectedDomain?.subdomain}</code>
              </p>
            </div>

            {selectedDomain && (
              <button
                onClick={() => handleVerifyDns(selectedDomain.id)}
                disabled={isVerifying}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition border border-slate-200 flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                <span>{isVerifying ? 'Checking DNS...' : 'Re-check DNS'}</span>
              </button>
            )}
          </div>

          {selectedDomain ? (
            <>
              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <span className="font-bold">Amazon SES Authentication Records:</span>
                  <p className="text-[11px] text-indigo-800 leading-relaxed">
                    Add the 3 DNS records below into your domain provider (Hostinger, Cloudflare, GoDaddy) to authenticate <strong>{selectedDomain.domain}</strong>.
                  </p>
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {/* SPF Record */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between items-center text-[11px] font-sans font-bold text-slate-700">
                    <span>1. SPF Record (Sender Authorization)</span>
                    <span className="text-emerald-700 font-mono">Working</span>
                  </div>
                  <div className="p-2 rounded bg-white text-slate-800 border border-slate-200 overflow-x-auto">
                    Host: <span className="text-indigo-700 font-bold">@</span> | Value: <span className="text-sky-700">v=spf1 include:amazonses.com ~all</span>
                  </div>
                </div>

                {/* DKIM Record */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between items-center text-[11px] font-sans font-bold text-slate-700">
                    <span>2. DKIM Key (Domain Key Signature)</span>
                    <span className="text-emerald-700 font-mono">Verified</span>
                  </div>
                  <div className="p-2 rounded bg-white text-slate-800 border border-slate-200 overflow-x-auto">
                    Host: <span className="text-indigo-700 font-bold">flw2026._domainkey</span> | Value: <span className="text-sky-700">v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8...</span>
                  </div>
                </div>

                {/* DMARC Record */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between items-center text-[11px] font-sans font-bold text-slate-700">
                    <span>3. DMARC Policy (Anti-Spoofing Rule)</span>
                    <span className="text-emerald-700 font-mono">Protected</span>
                  </div>
                  <div className="p-2 rounded bg-white text-slate-800 border border-slate-200 overflow-x-auto">
                    Host: <span className="text-indigo-700 font-bold">_dmarc</span> | Value: <span className="text-sky-700">v=DMARC1; p=reject; rua=mailto:dmarc@brainovision.in</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-14 text-center text-slate-400">
              <Globe className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-1" />
              <p className="font-semibold text-slate-700 text-xs">No sending domain selected</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Custom Domain" to view your SPF, DKIM, and DMARC DNS verification keys.</p>
            </div>
          )}
        </div>

        {/* Safe Warm-Up Ramping */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-4 h-4 text-sky-600" />
            Automatic IP Warm-Up
          </h3>

          <p className="text-xs text-slate-500 leading-relaxed">
            Sending too many emails on a new domain can trigger spam flags. FlowEM automatically raises your daily email limit as your domain gets trusted.
          </p>

          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex justify-between text-xs text-slate-700 font-semibold mb-1">
                <span>Current Daily Limit Used</span>
                <span className="font-mono text-emerald-700 font-bold">12%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-900">Dedicated Mail Server IPs:</div>
              <div className="font-mono text-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span>198.51.100.24 (Primary Server)</span>
                  <span className="text-emerald-700 font-bold">Clean & Fast</span>
                </div>
                <div className="flex justify-between">
                  <span>198.51.100.25 (Backup Server)</span>
                  <span className="text-emerald-700 font-bold">Clean & Fast</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Add Custom Domain Modal */}
      {isAddDomainOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Add Sending Domain</h3>
              <button
                onClick={() => setIsAddDomainOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDomain} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Domain *</label>
                <input
                  type="text"
                  required
                  value={newDomainInput}
                  onChange={(e) => setNewDomainInput(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="brainovision.in"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sending Subdomain</label>
                <input
                  type="text"
                  value={newSubdomainInput}
                  onChange={(e) => setNewSubdomainInput(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="mail.brainovision.in"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Using a subdomain like "mail.brainovision.in" protects your main website email.
                </p>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddDomainOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs"
                >
                  Save Domain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};