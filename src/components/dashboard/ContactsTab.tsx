import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  UploadCloud, 
  Download, 
  Filter, 
  CheckCircle2, 
  X, 
  ChevronRight,
  Trash2
} from 'lucide-react';
import { MorphicCard, MorphicBadge } from '../common/MorphicCard';
import { Contact } from '../../types';
import { api } from '../../services/api';

export const ContactsTab: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // New Contact Form State
  const [newEmail, setNewEmail] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newList, setNewList] = useState('New Customers & Accounts');
  const [newTags, setNewTags] = useState('Customer, Verified');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    const data = await api.getContacts();
    setContacts(data);
    setLoading(false);
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    const saved = await api.addContact({
      email: newEmail,
      firstName: newFirstName,
      lastName: newLastName,
      lists: [newList],
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean)
    });

    setContacts([saved, ...contacts]);
    setIsAddModalOpen(false);
    setNewEmail('');
    setNewFirstName('');
    setNewLastName('');
  };

  const handleDeleteContact = async (id: string) => {
    if (confirm('Delete this contact?')) {
      await api.deleteContact(id);
      setContacts(contacts.filter(c => c.id !== id));
      if (selectedContact?.id === id) setSelectedContact(null);
    }
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["Email,FirstName,LastName,Status,EngagementScore,CreatedAt"]
      .concat(contacts.map(c => `"${c.email}","${c.firstName}","${c.lastName}","${c.status}",${c.engagementScore},"${c.createdAt}"`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `contacts_${new Date().toISOString().split('T')[0]}.csv`);
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
            Contacts
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            View, search, and manage your email subscribers ({contacts.length} total contacts).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 shadow-xs transition flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-xs font-semibold text-sky-800 border border-sky-200 transition flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4 text-sky-600" />
            <span>Upload CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search email, name, tag..."
            className="w-full glass-input rounded-lg pl-9 pr-3 py-2 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <span className="text-xs text-slate-500 mr-1 flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          {['All', 'Subscribed', 'Unsubscribed', 'Bounced'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts Table */}
      <div className="glass-panel rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-bold text-[11px]">
              <tr>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">List</th>
                <th className="py-3 px-4">Open Score</th>
                <th className="py-3 px-4">Emails Sent</th>
                <th className="py-3 px-4">Opens / Clicks</th>
                <th className="py-3 px-4">Tags</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Users className="w-8 h-8 text-slate-300" />
                      <div className="text-sm font-bold text-slate-800">No contacts found</div>
                      <div className="text-xs text-slate-400">Add an individual contact or upload a CSV spreadsheet to start sending.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredContacts.map(contact => (
                  <tr
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className="hover:bg-slate-50/80 transition cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{contact.firstName} {contact.lastName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{contact.email}</div>
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
                    <td className="py-3 px-4 text-slate-800">
                      {contact.lists.join(', ')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              contact.engagementScore > 80
                                ? 'bg-emerald-600'
                                : contact.engagementScore > 50
                                ? 'bg-indigo-600'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${contact.engagementScore}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-700">{contact.engagementScore}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-800">
                      {contact.deliveriesCount}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className="text-emerald-700 font-bold">{contact.opensCount}</span> / <span className="text-sky-700 font-bold">{contact.clicksCount}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.map((tg, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                            {tg}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteContact(contact.id);
                        }}
                        className="p-1.5 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                        title="Delete Contact"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Single Contact Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Add New Contact</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="customer@company.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                    placeholder="Marcus"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Add to List</label>
                <select
                  value={newList}
                  onChange={(e) => setNewList(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                >
                  <option value="New Customers & Accounts">New Customers & Accounts</option>
                  <option value="Product Updates & Releases">Product Updates & Releases</option>
                  <option value="Monthly Newsletter Readers">Monthly Newsletter Readers</option>
                  <option value="Company Partners & Investors">Company Partners & Investors</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tags (separated by comma)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="Customer, VIP, Buyer"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload CSV Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Upload Contacts CSV</h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl p-8 text-center space-y-3 cursor-pointer bg-slate-50/50">
              <UploadCloud className="w-10 h-10 text-indigo-600 mx-auto" />
              <div className="text-sm font-bold text-slate-900">Drop your CSV file here</div>
              <p className="text-xs text-slate-500">
                Upload up to 250,000 email addresses. Automatic duplicate removal will run instantly.
              </p>
              <button
                type="button"
                onClick={() => {
                  api.importContacts([
                    { email: 'newuser1@company.com', firstName: 'John', lastName: 'Doe' },
                    { email: 'newuser2@company.com', firstName: 'Emma', lastName: 'Stone' }
                  ]).then(() => {
                    loadContacts();
                    setIsImportModalOpen(false);
                  });
                }}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs shadow-xs"
              >
                Simulate Uploading 2 Sample Contacts
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="font-bold text-slate-800">CSV Column Names:</div>
              <div><code>email, first_name, last_name, tags</code></div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Contact Drawer */}
      {selectedContact && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-slate-200 p-6 overflow-y-auto space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900">{selectedContact.firstName} {selectedContact.lastName}</h3>
              <p className="text-xs text-slate-500 font-mono">{selectedContact.email}</p>
            </div>
            <button
              onClick={() => setSelectedContact(null)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs text-slate-500 font-semibold uppercase">Open Rate Score</span>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold font-mono text-emerald-600">{selectedContact.engagementScore}%</span>
                <MorphicBadge label={selectedContact.status} variant="success" />
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Total Emails Received:</span>
                <span className="font-mono font-bold text-slate-900">{selectedContact.deliveriesCount}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Emails Opened:</span>
                <span className="font-mono font-bold text-emerald-700">{selectedContact.opensCount}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Links Clicked:</span>
                <span className="font-mono font-bold text-sky-700">{selectedContact.clicksCount}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Joined On:</span>
                <span className="text-slate-800">{selectedContact.createdAt}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2">Assigned Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedContact.tags.map((tg, i) => (
                  <span key={i} className="px-2.5 py-1 rounded bg-indigo-50 text-xs font-semibold text-indigo-700 border border-indigo-200">
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
