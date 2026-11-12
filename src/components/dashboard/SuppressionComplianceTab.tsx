import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Plus, 
  Download, 
  AlertOctagon, 
  Trash2, 
  X, 
  CheckCircle2, 
  FileCheck,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { MorphicCard, MorphicBadge } from '../common/MorphicCard';
import { initialSuppressions } from '../../data/mockData';
import { SuppressionRecord } from '../../types';

export const SuppressionComplianceTab: React.FC = () => {
  const [suppressions, setSuppressions] = useState<SuppressionRecord[]>(initialSuppressions);
  const [searchQuery, setSearchQuery] = useState('');
  const [reasonFilter, setReasonFilter] = useState<string>('All');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Suppression Form
  const [newEmail, setNewEmail] = useState('');
  const [newReason, setNewReason] = useState<SuppressionRecord['reason']>('Manual Policy');
  const [newNote, setNewNote] = useState('');

  const filtered = suppressions.filter(s => {
    const matchesSearch = s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesReason = reasonFilter === 'All' || s.reason === reasonFilter;
    return matchesSearch && matchesReason;
  });

  const handleAddSuppression = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    const newRecord: SuppressionRecord = {
      id: `sup-${Date.now()}`,
      email: newEmail,
      reason: newReason,
      suppressedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      notes: newNote || 'Manual compliance entry applied by system administrator.',
      status: 'Active'
    };

    setSuppressions([newRecord, ...suppressions]);
    setIsAddOpen(false);
    setNewEmail('');
    setNewNote('');
  };

  const handleRevoke = (id: string) => {
    if (confirm('Revoke suppression for this address? Ensure double opt-in re-verification is documented.')) {
      setSuppressions(suppressions.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Suppression & Global Compliance Shield
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated exclusion enforcement to protect sender score and guarantee RFC-8058, GDPR & CAN-SPAM adherence.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition shadow-glow-indigo flex items-center gap-2 border border-indigo-400/40"
        >
          <Plus className="w-4 h-4" />
          <span>Add Suppression Entry</span>
        </button>
      </div>

      {/* Compliance Standards Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MorphicCard glow="emerald" className="p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">RFC-8058 Compliance</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-[11px] text-slate-400 leading-relaxed">
            One-Click List-Unsubscribe header validated across all active templates.
          </div>
          <div className="pt-1 text-[10px] font-mono text-emerald-400 uppercase">Status: ENFORCED</div>
        </MorphicCard>

        <MorphicCard glow="emerald" className="p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">CAN-SPAM Act 2003</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-[11px] text-slate-400 leading-relaxed">
            Registered physical corporate address appended to email footers.
          </div>
          <div className="pt-1 text-[10px] font-mono text-emerald-400 uppercase">Status: PASS</div>
        </MorphicCard>

        <MorphicCard glow="emerald" className="p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">GDPR & CASL Consent</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-[11px] text-slate-400 leading-relaxed">
            Cryptographic audit trails and consent IP timestamps archived.
          </div>
          <div className="pt-1 text-[10px] font-mono text-emerald-400 uppercase">Status: PASS</div>
        </MorphicCard>

        <MorphicCard glow="indigo" className="p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Hard Bounce Lock</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-[11px] text-slate-400 leading-relaxed">
            Automatic permanent suppression for 5xx permanent SMTP rejections.
          </div>
          <div className="pt-1 text-[10px] font-mono text-indigo-400 uppercase">Active Filter</div>
        </MorphicCard>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search suppressed emails, errors..."
            className="w-full glass-input rounded-lg pl-9 pr-3 py-2 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['All', 'Hard Bounce', 'Unsubscribe Request', 'Spam Complaint', 'Manual Policy'].map(rf => (
            <button
              key={rf}
              onClick={() => setReasonFilter(rf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                reasonFilter === rf
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {rf}
            </button>
          ))}
        </div>
      </div>

      {/* Suppressions Table */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Suppressed Address</th>
                <th className="py-3.5 px-4">Reason Category</th>
                <th className="py-3.5 px-4">Trigger Campaign / Source</th>
                <th className="py-3.5 px-4">Suppressed Timestamp</th>
                <th className="py-3.5 px-4">Diagnostics / Notes</th>
                <th className="py-3.5 px-4 text-right">Revoke</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map(sup => (
                <tr key={sup.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-medium text-white">{sup.email}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <MorphicBadge
                      label={sup.reason}
                      variant={
                        sup.reason === 'Hard Bounce'
                          ? 'error'
                          : sup.reason === 'Spam Complaint'
                          ? 'warning'
                          : sup.reason === 'Unsubscribe Request'
                          ? 'info'
                          : 'neutral'
                      }
                    />
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {sup.sourceCampaign || 'Global Policy / Manual'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono">
                    {sup.suppressedAt}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate text-[11px] text-slate-400 font-mono">
                    {sup.notes}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleRevoke(sup.id)}
                      title="Revoke Suppression"
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Suppression Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-semibold text-white">Add Suppression Exclusion</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSuppression} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="recipient@domain.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Suppression Reason</label>
                <select
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value as any)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs bg-slate-900"
                >
                  <option value="Manual Policy">Manual Policy Exclusion</option>
                  <option value="Unsubscribe Request">Unsubscribe Request</option>
                  <option value="Hard Bounce">Hard Bounce</option>
                  <option value="Spam Complaint">Spam Complaint</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Diagnostic Note / Reference</label>
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="e.g. Legal do-not-contact directive"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-glow-indigo"
                >
                  Apply Suppression
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
