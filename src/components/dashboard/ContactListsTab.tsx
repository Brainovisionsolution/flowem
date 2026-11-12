import React, { useState } from 'react';
import { 
  FolderPlus, 
  Search, 
  Users, 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Calendar, 
  BarChart, 
  AlertCircle,
  Trash2,
  Filter
} from 'lucide-react';
import { MorphicCard, MorphicBadge } from '../common/MorphicCard';
import { initialContactLists } from '../../data/mockData';
import { ContactList } from '../../types';

export const ContactListsTab: React.FC = () => {
  const [lists, setLists] = useState<ContactList[]>(initialContactLists);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCleaningOpen, setIsCleaningOpen] = useState(false);
  const [cleanedMessage, setCleanedMessage] = useState<string | null>(null);

  // New List State
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<'Static' | 'Dynamic'>('Dynamic');
  const [newTags, setNewTags] = useState('Production, Verified');

  const filteredLists = lists.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const newList: ContactList = {
      id: `lst-${Date.now()}`,
      name: newName,
      description: newDesc || 'Automated audience segment managed by FlowEM query engine.',
      contactCount: 0,
      type: newType,
      activeSubscribers: 0,
      avgOpenRate: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: 'Just now',
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean)
    };

    setLists([newList, ...lists]);
    setIsCreateOpen(false);
    setNewName('');
    setNewDesc('');
  };

  const handleRunHygiene = (listId: string) => {
    setIsCleaningOpen(true);
    setTimeout(() => {
      setLists(prev => prev.map(l => {
        if (l.id === listId) {
          const removed = Math.round(l.contactCount * 0.012);
          return {
            ...l,
            contactCount: l.contactCount - removed,
            activeSubscribers: l.activeSubscribers - removed,
            updatedAt: 'Just now (Cleaned)'
          };
        }
        return l;
      }));
      setIsCleaningOpen(false);
      setCleanedMessage('Hygiene scrub completed: 1.2% dormant/syntax-invalid addresses purged.');
      setTimeout(() => setCleanedMessage(null), 4000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Audience Segments & Contact Lists
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage static cohorts and dynamic SQL-evaluated rule segments across {lists.length} lists.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition shadow-glow-indigo flex items-center gap-2 border border-indigo-400/40"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Create New List / Segment</span>
        </button>
      </div>

      {cleanedMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{cleanedMessage}</span>
        </div>
      )}

      {/* Search and Segments Control */}
      <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search list name, description..."
            className="w-full glass-input rounded-lg pl-9 pr-3 py-2 text-xs"
          />
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-4">
          <span>Total Contacts across lists: <strong className="text-white font-mono">490,880</strong></span>
          <span className="h-4 w-px bg-slate-800"></span>
          <span>Avg Open Rate: <strong className="text-emerald-400 font-mono">41.8%</strong></span>
        </div>
      </div>

      {/* Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLists.map((list) => (
          <MorphicCard key={list.id} className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{list.name}</h3>
                  <MorphicBadge
                    label={list.type}
                    variant={list.type === 'Dynamic' ? 'purple' : 'info'}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {list.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-slate-900/70 border border-slate-800 text-center">
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Subscribers</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  {list.contactCount.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Active</div>
                <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                  {list.activeSubscribers.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Avg Open</div>
                <div className="text-sm font-bold text-cyan-400 font-mono mt-0.5">
                  {list.avgOpenRate}%
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {list.tags.map((tg, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50">
                  {tg}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
              <span className="text-[11px] text-slate-500">Updated: {list.updatedAt}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRunHygiene(list.id)}
                  disabled={isCleaningOpen}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs border border-slate-700 disabled:opacity-50"
                >
                  Scrub List
                </button>
              </div>
            </div>
          </MorphicCard>
        ))}
      </div>

      {/* Create List Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-semibold text-white">Create Audience Cohort</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateList} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">List / Segment Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="e.g. VIP Enterprise Leads Q4"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Cohort Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="Describe the target audience or inclusion policy..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Segment Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewType('Dynamic')}
                    className={`p-3 rounded-lg text-left border transition ${
                      newType === 'Dynamic'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">Dynamic Segment</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Rules re-evaluated automatically</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('Static')}
                    className={`p-3 rounded-lg text-left border transition ${
                      newType === 'Static'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">Static List</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Manual or CSV-managed cohort</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="B2B, Tier 1, High LTV"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-glow-indigo"
                >
                  Save List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
