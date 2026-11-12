import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  UploadCloud, 
  Download, 
  Filter, 
  CheckCircle2, 
  X, 
  Tag, 
  Mail, 
  Calendar,
  Trash2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { MorphicCard, MorphicBadge } from '../common/MorphicCard';
import { initialContacts } from '../../data/mockData';
import { Contact } from '../../types';

export const ContactsTab: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // New Contact Form State
  const [newEmail, setNewEmail] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newList, setNewList] = useState('Enterprise Leads & Accounts');
  const [newTags, setNewTags] = useState('B2B, Verified');

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    const newEntry: Contact = {
      id: `ct-${Date.now()}`,
      email: newEmail,
      firstName: newFirstName || 'Subscriber',
      lastName: newLastName || '',
      status: 'Subscribed',
      lists: [newList],
      engagementScore: 85,
      lastSentAt: 'Pending Dispatch',
      createdAt: new Date().toISOString().split('T')[0],
      deliveriesCount: 0,
      opensCount: 0,
      clicksCount: 0,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean)
    };

    setContacts([newEntry, ...contacts]);
    setIsAddModalOpen(false);
    setNewEmail('');
    setNewFirstName('');
    setNewLastName('');
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["Email,FirstName,LastName,Status,EngagementScore,CreatedAt"]
      .concat(contacts.map(c => `"${c.email}","${c.firstName}","${c.lastName}","${c.status}",${c.engagementScore},"${c.createdAt}"`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `flowem_contacts_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Subscriber Directory & Contacts
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Total of {contacts.length} indexed subscribers. Continuous deliverability score tracking active.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-xs text-slate-300 border border-slate-700 transition flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-xs text-cyan-300 border border-cyan-500/30 transition flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4 text-cyan-400" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition shadow-glow-indigo flex items-center gap-2 border border-indigo-400/40"
          >
            <Plus className="w-4 h-4" />
            <span>Add Single Contact</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search email, name, tag..."
            className="w-full glass-input rounded-lg pl-9 pr-3 py-2 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </span>
          {['All', 'Subscribed', 'Unsubscribed', 'Bounced', 'Complained'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts Table */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Associated Lists</th>
                <th className="py-3.5 px-4">Engagement</th>
                <th className="py-3.5 px-4">Dispatches</th>
                <th className="py-3.5 px-4">Opens / Clicks</th>
                <th className="py-3.5 px-4">Tags</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredContacts.map(contact => (
                <tr
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className="hover:bg-slate-800/40 transition cursor-pointer"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-white">{contact.firstName} {contact.lastName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{contact.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <MorphicBadge
                      label={contact.status}
                      variant={
                        contact.status === 'Subscribed'
                          ? 'success'
                          : contact.status === 'Unsubscribed'
                          ? 'warning'
                          : contact.status === 'Bounced'
                          ? 'error'
                          : 'neutral'
                      }
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="max-w-[160px] truncate text-slate-300">
                      {contact.lists.join(', ')}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            contact.engagementScore > 80
                              ? 'bg-emerald-400'
                              : contact.engagementScore > 50
                              ? 'bg-indigo-400'
                              : 'bg-amber-400'
                          }`}
                          style={{ width: `${contact.engagementScore}%` }}
                        ></div>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">{contact.engagementScore}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {contact.deliveriesCount}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    <span className="text-emerald-400">{contact.opensCount}</span> / <span className="text-cyan-400">{contact.clicksCount}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tg, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50">
                          {tg}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedContact(contact);
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
                    >
                      <span>Inspect</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Single Contact Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-semibold text-white">Add Individual Subscriber</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="subscriber@enterprise.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">First Name</label>
                  <input
                    type="text"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                    placeholder="Marcus"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                    placeholder="Vance"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Assign to List</label>
                <select
                  value={newList}
                  onChange={(e) => setNewList(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs bg-slate-900"
                >
                  <option value="Enterprise Leads & Accounts">Enterprise Leads & Accounts</option>
                  <option value="Product Infrastructure Updates">Product Infrastructure Updates</option>
                  <option value="Global Investors & Partners">Global Investors & Partners</option>
                  <option value="Weekly Engineering Briefing">Weekly Engineering Briefing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="B2B, Decision Maker, High Priority"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-glow-indigo"
                >
                  Save Subscriber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import CSV Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-semibold text-white">Bulk CSV Importer</h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-xl p-8 text-center space-y-3 cursor-pointer transition">
              <UploadCloud className="w-10 h-10 text-indigo-400 mx-auto" />
              <div className="text-sm font-medium text-white">Drop your subscriber CSV file here</div>
              <p className="text-xs text-slate-400">
                Supports up to 250,000 records per upload batch. Automatic syntax validation and deduplication will run immediately.
              </p>
              <button
                type="button"
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700"
              >
                Browse Disk Files
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="font-semibold text-slate-300">Required CSV Columns:</div>
              <div><code>email, first_name, last_name, tags</code></div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Contact Drawer */}
      {selectedContact && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-950/95 backdrop-blur-xl border-l border-white/10 p-6 overflow-y-auto space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">{selectedContact.firstName} {selectedContact.lastName}</h3>
              <p className="text-xs text-slate-400 font-mono">{selectedContact.email}</p>
            </div>
            <button
              onClick={() => setSelectedContact(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Subscriber Engagement Score</span>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold font-mono text-emerald-400">{selectedContact.engagementScore} / 100</span>
                <MorphicBadge label={selectedContact.status} variant="success" />
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Total Transmissions:</span>
                <span className="font-mono text-white">{selectedContact.deliveriesCount}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Unique Opens:</span>
                <span className="font-mono text-emerald-400">{selectedContact.opensCount}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Link Clicks:</span>
                <span className="font-mono text-cyan-400">{selectedContact.clicksCount}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Subscribed Since:</span>
                <span className="text-slate-300">{selectedContact.createdAt}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Last Transmission:</span>
                <span className="text-slate-300">{selectedContact.lastSentAt}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-300 mb-2">Assigned Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedContact.tags.map((tg, i) => (
                  <span key={i} className="px-2.5 py-1 rounded bg-slate-800 text-xs text-indigo-300 border border-slate-700">
                    {tg}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
