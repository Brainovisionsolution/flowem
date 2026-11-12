import React, { useState, useEffect } from 'react';
import { 
  FolderPlus, 
  Search, 
  CheckCircle2, 
  X, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { MorphicCard, MorphicBadge } from '../common/MorphicCard';
import { ContactList } from '../../types';
import { api } from '../../services/api';

export const ContactListsTab: React.FC = () => {
  const [lists, setLists] = useState<ContactList[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanMessage, setCleanMessage] = useState<string | null>(null);

  // New List State
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<'Static' | 'Dynamic'>('Dynamic');
  const [newTags, setNewTags] = useState('Customers, Verified');

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    const data = await api.getLists();
    setLists(data);
  };

  const filteredLists = lists.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const saved = await api.addList({
      name: newName,
      description: newDesc,
      type: newType,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean)
    });

    setLists([saved, ...lists]);
    setIsCreateOpen(false);
    setNewName('');
    setNewDesc('');
  };

  const handleCleanList = async (listId: string) => {
    setIsCleaning(true);
    const res = await api.cleanList(listId);
    setLists(prev => prev.map(l => l.id === listId ? res.list : l));
    setIsCleaning(false);
    setCleanMessage(`Cleaned ${res.removed} inactive or invalid email addresses!`);
    setTimeout(() => setCleanMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Contact Lists
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Group your contacts into targeted lists for your newsletters and campaigns ({lists.length} lists).
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-xs flex items-center gap-2"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Create New List</span>
        </button>
      </div>

      {cleanMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{cleanMessage}</span>
        </div>
      )}

      {/* Search and Stats Bar */}
      <div className="glass-panel p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search list name, description..."
            className="w-full glass-input rounded-lg pl-9 pr-3 py-2 text-xs"
          />
        </div>

        <div className="text-xs text-slate-600 flex items-center gap-4 font-medium">
          <span>Total Contacts Across Lists: <strong className="text-slate-900 font-mono">452,280</strong></span>
          <span className="h-4 w-px bg-slate-200"></span>
          <span>Average Open Rate: <strong className="text-emerald-700 font-mono">41.8%</strong></span>
        </div>
      </div>

      {/* Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLists.map((list) => (
          <MorphicCard key={list.id} className="space-y-4 bg-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{list.name}</h3>
                  <MorphicBadge
                    label={list.type}
                    variant={list.type === 'Dynamic' ? 'purple' : 'info'}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {list.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Total Contacts</div>
                <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                  {list.contactCount.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Active Readers</div>
                <div className="text-sm font-bold text-emerald-700 font-mono mt-0.5">
                  {list.activeSubscribers.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Avg Open Rate</div>
                <div className="text-sm font-bold text-sky-700 font-mono mt-0.5">
                  {list.avgOpenRate}%
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {list.tags.map((tg, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                  {tg}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-[11px] text-slate-400">Updated: {list.updatedAt}</span>
              <button
                onClick={() => handleCleanList(list.id)}
                disabled={isCleaning}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center gap-1.5 transition disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Clean Dead Emails</span>
              </button>
            </div>
          </MorphicCard>
        ))}
      </div>

      {/* Create List Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Create New List</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateList} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">List Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="e.g. VIP Customers Q4"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="Describe who is in this list..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">List Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewType('Dynamic')}
                    className={`p-3 rounded-lg text-left border transition ${
                      newType === 'Dynamic'
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">Dynamic List</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Updates automatically when contacts match tags</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('Static')}
                    className={`p-3 rounded-lg text-left border transition ${
                      newType === 'Static'
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">Static List</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Fixed list from a specific CSV upload</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tags (separated by comma)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="Customers, Verified"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs"
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
