import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Plus, 
  X, 
  CheckCircle2, 
  RotateCcw
} from 'lucide-react';
import { MorphicCard, MorphicBadge } from '../common/MorphicCard';
import { SuppressionRecord } from '../../types';
import { api } from '../../services/api';

export const SuppressionComplianceTab: React.FC = () => {
  const [suppressions, setSuppressions] = useState<SuppressionRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [reasonFilter, setReasonFilter] = useState<string>('All');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Form
  const [newEmail, setNewEmail] = useState('');
  const [newReason, setNewReason] = useState<SuppressionRecord['reason']>('Manual Policy');
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    loadSuppressions();
  }, []);

  const loadSuppressions = async () => {
    const data = await api.getSuppressions();
    setSuppressions(data);
  };

  const filtered = suppressions.filter(s => {
    const matchesSearch = s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesReason = reasonFilter === 'All' || s.reason === reasonFilter;
    return matchesSearch && matchesReason;
  });

  const handleAddSuppression = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    const saved = await api.addSuppression({
      email: newEmail,
      reason: newReason,
      notes: newNote || 'Manually added to blocked list.'
    });

    setSuppressions([saved, ...suppressions]);
    setIsAddOpen(false);
    setNewEmail('');
    setNewNote('');
  };

  const handleRevoke = async (id: string) => {
    if (confirm('Unblock this email address so you can send emails to them again?')) {
      await api.removeSuppression(id);
      setSuppressions(suppressions.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Unsubscribed & Blocked Emails
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            People who clicked unsubscribe, invalid emails that bounced, or spam complaints ({suppressions.length} blocked).
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Blocked Email</span>
        </button>
      </div>

      {/* Safety Standards Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MorphicCard className="p-4 space-y-1.5 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">1-Click Unsubscribe</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-[11px] text-slate-500 leading-relaxed">
            Automatic unsubscribe button in email header satisfies Google & Yahoo 2024 rules.
          </div>
          <div className="pt-1 text-[10px] font-mono text-emerald-700 font-bold uppercase">STATUS: ACTIVE</div>
        </MorphicCard>

        <MorphicCard className="p-4 space-y-1.5 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Company Address Footer</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-[11px] text-slate-500 leading-relaxed">
            Your registered office address is placed at the bottom of every sent email.
          </div>
          <div className="pt-1 text-[10px] font-mono text-emerald-700 font-bold uppercase">STATUS: PASS</div>
        </MorphicCard>

        <MorphicCard className="p-4 space-y-1.5 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Consent Records</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-[11px] text-slate-500 leading-relaxed">
            Proof of user signup date and IP address saved to meet privacy laws.
          </div>
          <div className="pt-1 text-[10px] font-mono text-emerald-700 font-bold uppercase">STATUS: SAVED</div>
        </MorphicCard>

        <MorphicCard className="p-4 space-y-1.5 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Automatic Bounce Lock</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-[11px] text-slate-500 leading-relaxed">
            Dead email addresses are automatically blocked so you never re-send to them.
          </div>
          <div className="pt-1 text-[10px] font-mono text-indigo-700 font-bold uppercase">AUTOMATIC</div>
        </MorphicCard>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blocked email or note..."
            className="w-full glass-input rounded-lg pl-9 pr-3 py-2 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['All', 'Hard Bounce', 'Unsubscribe Request', 'Spam Complaint', 'Manual Policy'].map(rf => (
            <button
              key={rf}
              onClick={() => setReasonFilter(rf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                reasonFilter === rf
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {rf}
            </button>
          ))}
        </div>
      </div>

      {/* Suppressions Table */}
      <div className="glass-panel rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-bold text-[11px]">
              <tr>
                <th className="py-3 px-4">Blocked Email</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">From Campaign</th>
                <th className="py-3 px-4">Blocked Date</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Unblock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map(sup => (
                <tr key={sup.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-slate-900">{sup.email}</span>
                  </td>
                  <td className="py-3 px-4">
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
                  <td className="py-3 px-4 text-slate-600">
                    {sup.sourceCampaign || 'Manually added'}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono">
                    {sup.suppressedAt}
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate text-[11px] text-slate-600">
                    {sup.notes}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleRevoke(sup.id)}
                      title="Unblock Email"
                      className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition"
                    >
                      <RotateCcw className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Add Email to Blocked List</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSuppression} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Blocking</label>
                <select
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value as any)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                >
                  <option value="Manual Policy">User asked not to be contacted</option>
                  <option value="Unsubscribe Request">Unsubscribe Request</option>
                  <option value="Hard Bounce">Invalid email (Hard Bounce)</option>
                  <option value="Spam Complaint">Spam Complaint</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Short Note</label>
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="e.g. Requested via support email"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs"
                >
                  Block Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
