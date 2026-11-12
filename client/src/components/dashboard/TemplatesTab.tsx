import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Eye, 
  Code, 
  Smartphone, 
  Monitor, 
  X,
  Pencil,
  Trash2,
  Send,
  Upload,
  CheckCircle2,
  AlertCircle,
  Users,
  Mail,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { MorphicCard, MorphicBadge } from '../common/MorphicCard';
import { EmailTemplate, NavigationTab } from '../../types';
import { api } from '../../services/api';

interface TemplatesTabProps {
  onNavigate?: (tab: NavigationTab) => void;
}

interface ParsedRecipient {
  email: string;
  firstName?: string;
  lastName?: string;
}

export const TemplatesTab: React.FC<TemplatesTabProps> = ({ onNavigate }) => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePreview, setActivePreview] = useState<EmailTemplate | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<EmailTemplate['category']>('Transactional');
  const [newSubject, setNewSubject] = useState('');
  const [newHtml, setNewHtml] = useState('<!DOCTYPE html><html><body><h1>Hello {{firstName}},</h1><p>Welcome to Brainovision platform.</p></body></html>');

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<EmailTemplate['category']>('Transactional');
  const [editSubject, setEditSubject] = useState('');
  const [editPreviewText, setEditPreviewText] = useState('');
  const [editHtml, setEditHtml] = useState('');

  // Delete Confirmation State
  const [templateToDelete, setTemplateToDelete] = useState<EmailTemplate | null>(null);

  // Send with Template State
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [selectedTemplateForSend, setSelectedTemplateForSend] = useState<EmailTemplate | null>(null);
  const [senderEmail, setSenderEmail] = useState('it@brainovision.in');
  const [senderName, setSenderName] = useState('Brainovision IT Team');
  const [customSubject, setCustomSubject] = useState('');
  const [recipientInputMode, setRecipientInputMode] = useState<'csv' | 'manual'>('csv');
  const [manualText, setManualText] = useState('');
  const [csvFileName, setCsvFileName] = useState('');
  const [parsedRecipients, setParsedRecipients] = useState<ParsedRecipient[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{
    success: boolean;
    totalSent: number;
    senderEmail: string;
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await api.getTemplates();
      setTemplates(data);
      if (data.length > 0) {
        setActivePreview(data[0]);
      } else {
        setActivePreview(null);
      }
    } catch (err) {
      console.error('Failed to load templates:', err);
    }
  };

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle Create Template
  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const saved = await api.addTemplate({
        title: newTitle.trim(),
        category: newCategory,
        subject: newSubject.trim() || 'Notice from Brainovision',
        previewText: 'A direct message from our team.',
        htmlContent: newHtml
      });

      setTemplates([saved, ...templates]);
      setActivePreview(saved);
      setIsCreateOpen(false);
      setNewTitle('');
      setNewSubject('');
      setNewHtml('<!DOCTYPE html><html><body><h1>Hello {{firstName}},</h1><p>Welcome to Brainovision platform.</p></body></html>');
    } catch (err: any) {
      alert(`Failed to create template: ${err.message}`);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setEditTitle(template.title);
    setEditCategory(template.category);
    setEditSubject(template.subject);
    setEditPreviewText(template.previewText || '');
    setEditHtml(template.htmlContent);
    setIsEditOpen(true);
  };

  // Handle Submit Edit Template
  const handleUpdateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate || !editTitle.trim()) return;

    try {
      const updated = await api.updateTemplate(editingTemplate.id, {
        title: editTitle.trim(),
        category: editCategory,
        subject: editSubject.trim(),
        previewText: editPreviewText.trim(),
        htmlContent: editHtml
      });

      setTemplates(templates.map(t => t.id === updated.id ? updated : t));
      if (activePreview?.id === updated.id) {
        setActivePreview(updated);
      }
      setIsEditOpen(false);
      setEditingTemplate(null);
    } catch (err: any) {
      alert(`Failed to update template: ${err.message}`);
    }
  };

  // Handle Delete Template
  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return;

    try {
      await api.deleteTemplate(templateToDelete.id);
      const remaining = templates.filter(t => t.id !== templateToDelete.id);
      setTemplates(remaining);
      if (activePreview?.id === templateToDelete.id) {
        setActivePreview(remaining.length > 0 ? remaining[0] : null);
      }
      setTemplateToDelete(null);
    } catch (err: any) {
      alert(`Failed to delete template: ${err.message}`);
    }
  };

  // Open "Send with Template" Wizard
  const handleOpenSend = (template: EmailTemplate) => {
    setSelectedTemplateForSend(template);
    setSenderEmail('it@brainovision.in');
    setSenderName('Brainovision IT Team');
    setCustomSubject(template.subject);
    setRecipientInputMode('csv');
    setManualText('');
    setCsvFileName('');
    setParsedRecipients([]);
    setSendResult(null);
    setIsSendOpen(true);
  };

  // Parse CSV File
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length === 0) return;

      const firstLine = lines[0].toLowerCase();
      const hasHeader = firstLine.includes('email') || firstLine.includes('mail') || firstLine.includes('name');

      const startIndex = hasHeader ? 1 : 0;
      let emailCol = 0;
      let firstCol = -1;
      let lastCol = -1;

      if (hasHeader) {
        const headers = lines[0].split(/[,;\t]/).map(h => h.trim().toLowerCase().replace(/^["']|["']$/g, ''));
        emailCol = headers.findIndex(h => h.includes('email') || h.includes('mail'));
        if (emailCol === -1) emailCol = 0;
        firstCol = headers.findIndex(h => h.includes('first') || h === 'name');
        lastCol = headers.findIndex(h => h.includes('last') || h.includes('surname'));
      }

      const results: ParsedRecipient[] = [];
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const seen = new Set<string>();

      for (let i = startIndex; i < lines.length; i++) {
        const parts = lines[i].split(/[,;\t]/).map(p => p.trim().replace(/^["']|["']$/g, ''));
        const email = parts[emailCol]?.trim().toLowerCase();
        if (email && emailRegex.test(email) && !seen.has(email)) {
          seen.add(email);
          results.push({
            email,
            firstName: firstCol >= 0 && parts[firstCol] ? parts[firstCol].trim() : '',
            lastName: lastCol >= 0 && parts[lastCol] ? parts[lastCol].trim() : ''
          });
        }
      }

      setParsedRecipients(results);
    };
    reader.readAsText(file);
  };

  // Parse Manual Text on Change
  const handleManualTextChange = (text: string) => {
    setManualText(text);
    const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
    const results: ParsedRecipient[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const seen = new Set<string>();

    for (const line of lines) {
      const parts = line.split(/[,;\t]/).map(p => p.trim().replace(/^["']|["']$/g, ''));
      for (let pIdx = 0; pIdx < parts.length; pIdx++) {
        const candidate = parts[pIdx].toLowerCase();
        if (emailRegex.test(candidate) && !seen.has(candidate)) {
          seen.add(candidate);
          const firstName = parts[pIdx + 1] && !emailRegex.test(parts[pIdx + 1]) ? parts[pIdx + 1] : '';
          const lastName = parts[pIdx + 2] && !emailRegex.test(parts[pIdx + 2]) ? parts[pIdx + 2] : '';
          results.push({ email: candidate, firstName, lastName });
          break;
        }
      }
    }

    setParsedRecipients(results);
  };

  // Dispatch Email Batch
  const handleDispatchMails = async () => {
    if (!selectedTemplateForSend) return;
    if (parsedRecipients.length === 0) {
      alert('Please enter at least one valid recipient email address.');
      return;
    }

    setIsSending(true);
    setSendResult(null);

    try {
      const response = await api.sendBulkWithTemplate({
        templateId: selectedTemplateForSend.id,
        senderEmail: senderEmail || 'it@brainovision.in',
        senderName: senderName || 'Brainovision IT Team',
        subject: customSubject || selectedTemplateForSend.subject,
        recipients: parsedRecipients
      });

      setSendResult({
        success: true,
        totalSent: response.totalSent,
        senderEmail: response.senderEmail,
        message: response.message
      });
    } catch (err: any) {
      alert(`Failed to send emails: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Email Templates
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, preview, and dispatch bulk emails directly to your audience ({templates.length} templates).
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Template</span>
        </button>
      </div>

      {/* Main Grid: Gallery & Live Interactive Previewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Template Cards */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full glass-input rounded-lg pl-9 pr-3 py-2 text-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {['All', 'Transactional', 'Newsletter', 'Product Launch', 'Marketing'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg font-semibold transition whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
            {filteredTemplates.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
                <FileText className="w-8 h-8 mx-auto text-slate-300 stroke-1 mb-2" />
                <p className="font-semibold text-slate-700 text-xs">No templates found</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Click "New Template" above to compose a reusable email layout.</p>
              </div>
            ) : (
              filteredTemplates.map(tpl => (
                <div
                  key={tpl.id}
                  onClick={() => setActivePreview(tpl)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    activePreview?.id === tpl.id
                      ? 'bg-indigo-50/80 border-indigo-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                        {tpl.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-0.5">{tpl.title}</h3>
                    </div>
                    {tpl.isPopular && <MorphicBadge label="Popular" variant="purple" />}
                  </div>

                  <div className="text-xs text-slate-600 mt-1.5 font-serif italic">
                    Subject: "{tpl.subject}"
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {tpl.previewText}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 mt-3 border-t border-slate-100">
                    <span className="text-slate-500">Updated: {tpl.updatedAt}</span>
                    
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenSend(tpl)}
                        className="px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] flex items-center gap-1 transition"
                        title="Send emails using this template"
                      >
                        <Send className="w-3 h-3" />
                        <span>Choose & Send</span>
                      </button>
                      <button
                        onClick={() => handleOpenEdit(tpl)}
                        className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                        title="Edit template"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setTemplateToDelete(tpl)}
                        className="p-1 rounded-md bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition"
                        title="Delete template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Right Column: Live Interactive Device Frame */}
        <div className="lg:col-span-7">
          {activePreview ? (
            <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
              
              {/* Preview Bar Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{activePreview.title}</h3>
                  <div className="text-xs text-slate-500 font-serif italic">"{activePreview.subject}"</div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Action Buttons: Send, Edit, Delete */}
                  <button
                    onClick={() => handleOpenSend(activePreview)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send with Template</span>
                  </button>

                  <button
                    onClick={() => handleOpenEdit(activePreview)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition border border-slate-200 flex items-center gap-1.5"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setTemplateToDelete(activePreview)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition border border-slate-200"
                    title="Delete Template"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Visual vs Code */}
                  <div className="flex p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold">
                    <button
                      onClick={() => setViewMode('visual')}
                      className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                        viewMode === 'visual' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Visual</span>
                    </button>
                    <button
                      onClick={() => setViewMode('code')}
                      className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                        viewMode === 'code' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>HTML</span>
                    </button>
                  </div>

                  {/* Device toggle */}
                  {viewMode === 'visual' && (
                    <div className="flex p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
                      <button
                        onClick={() => setPreviewDevice('desktop')}
                        className={`p-1.5 rounded-md transition ${
                          previewDevice === 'desktop' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                        }`}
                        title="Desktop View (600px)"
                      >
                        <Monitor className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setPreviewDevice('mobile')}
                        className={`p-1.5 rounded-md transition ${
                          previewDevice === 'mobile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                        }`}
                        title="Mobile Phone View (360px)"
                      >
                        <Smartphone className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic tag hint */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between font-mono">
                <span>Dynamic Tag Test: <code className="text-indigo-600 font-bold">{"{{firstName}}"} &rarr; "Sarah"</code></span>
                <span className="text-[11px] text-emerald-700 font-sans font-bold">Variables Ready</span>
              </div>

              {/* Container */}
              <div className="min-h-[460px] rounded-xl bg-slate-100/70 border border-slate-200 p-4 flex justify-center items-start overflow-auto">
                {viewMode === 'visual' ? (
                  <div
                    className={`transition-all duration-300 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden ${
                      previewDevice === 'desktop' ? 'w-full max-w-[620px]' : 'w-[360px]'
                    }`}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: activePreview.htmlContent.replace(/{{firstName}}/g, 'Sarah')
                      }}
                    />
                  </div>
                ) : (
                  <pre className="w-full text-xs font-mono text-slate-800 p-4 bg-white border border-slate-200 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {activePreview.htmlContent}
                  </pre>
                )}
              </div>

            </div>
          ) : (
            <div className="glass-panel p-16 text-center rounded-2xl bg-white border border-slate-200">
              <FileText className="w-10 h-10 mx-auto text-slate-300 stroke-1 mb-2" />
              <h4 className="font-bold text-slate-800 text-sm">No template selected</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Select any email template from the list to preview mobile and desktop versions, edit layouts, or dispatch bulk emails.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* CREATE TEMPLATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 border border-slate-200 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">Create Email Template</h3>
                <p className="text-xs text-slate-500 mt-0.5">Define a reusable layout with dynamic tags like {"{{firstName}}"}</p>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Template Name *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="e.g. Brainovision Engineering Workshop Invitation"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  >
                    <option value="Transactional">Transactional</option>
                    <option value="Newsletter">Newsletter</option>
                    <option value="Product Launch">Product Launch</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Default Subject Line</label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                    placeholder="Subject line..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">HTML Code</label>
                <textarea
                  rows={9}
                  value={newHtml}
                  onChange={(e) => setNewHtml(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
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
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TEMPLATE MODAL */}
      {isEditOpen && editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 border border-slate-200 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">Edit Template: {editingTemplate.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Modify template content, subject, and responsive HTML layout</p>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTemplate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Template Name *</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  >
                    <option value="Transactional">Transactional</option>
                    <option value="Newsletter">Newsletter</option>
                    <option value="Product Launch">Product Launch</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Line</label>
                  <input
                    type="text"
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preview Text</label>
                <input
                  type="text"
                  value={editPreviewText}
                  onChange={(e) => setEditPreviewText(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="Short inbox snippet..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">HTML Code</label>
                <textarea
                  rows={9}
                  value={editHtml}
                  onChange={(e) => setEditHtml(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {templateToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-full bg-rose-50 border border-rose-100">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Template</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to permanently delete template <strong className="text-slate-900 font-bold">"{templateToDelete.title}"</strong>?
            </p>

            <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setTemplateToDelete(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteTemplate}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-xs"
              >
                Delete Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHOOSE TEMPLATE & SEND MAILS MODAL */}
      {isSendOpen && selectedTemplateForSend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 border border-slate-200 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Template Selected
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Send Mails with: {selectedTemplateForSend.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Upload CSV or enter email addresses manually. Mails will be dispatched directly from <strong className="text-indigo-600 font-bold">{senderEmail}</strong>.
                </p>
              </div>

              <button
                onClick={() => setIsSendOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* If Send Completed: Show Success Panel */}
            {sendResult ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 space-y-4 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <div>
                  <h4 className="text-lg font-bold text-emerald-950">Emails Dispatched Successfully</h4>
                  <p className="text-xs text-emerald-800 mt-1">
                    Sent <strong className="font-bold">{sendResult.totalSent}</strong> email(s) from <strong className="font-bold">{sendResult.senderEmail}</strong>.
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-0.5 font-mono">
                    All delivery events have been logged in MySQL and will display in the Analytics dashboard.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setSendResult(null);
                      setParsedRecipients([]);
                      setManualText('');
                      setCsvFileName('');
                    }}
                    className="px-4 py-2 rounded-lg bg-white border border-emerald-300 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 transition"
                  >
                    Send Another Batch
                  </button>

                  {onNavigate && (
                    <button
                      onClick={() => {
                        setIsSendOpen(false);
                        onNavigate('analytics');
                      }}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-xs flex items-center gap-1.5"
                    >
                      <span>View Analytics & Sent Mails</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Sender and Recipient Input Form */
              <div className="space-y-4">
                
                {/* Sender Email & Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Sender Email Address *</label>
                    <input
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full glass-input rounded-lg px-3 py-2 text-xs font-mono font-medium"
                      placeholder="it@brainovision.in"
                    />
                    <p className="text-[10px] text-slate-500 mt-0.5">Pre-configured sending identity</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Sender Name</label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                      placeholder="Brainovision IT Team"
                    />
                    <p className="text-[10px] text-slate-500 mt-0.5">Display name visible in inbox</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Line</label>
                    <input
                      type="text"
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                      placeholder="Email subject..."
                    />
                  </div>
                </div>

                {/* Recipient Input Mode Selection (CSV vs Manual) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900">Add Recipients</label>
                    
                    <div className="flex p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setRecipientInputMode('csv')}
                        className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
                          recipientInputMode === 'csv'
                            ? 'bg-white text-indigo-600 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload CSV</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRecipientInputMode('manual')}
                        className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
                          recipientInputMode === 'manual'
                            ? 'bg-white text-indigo-600 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Enter Manually</span>
                      </button>
                    </div>
                  </div>

                  {/* Mode 1: CSV Upload */}
                  {recipientInputMode === 'csv' ? (
                    <div className="space-y-2">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="p-6 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/30 text-center cursor-pointer transition space-y-2"
                      >
                        <Upload className="w-8 h-8 mx-auto text-slate-400" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            {csvFileName ? `Selected File: ${csvFileName}` : 'Click to select or drop a CSV file'}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Supports columns: email, firstName, lastName (or simple comma separated emails)
                          </p>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".csv,text/csv"
                          onChange={handleCsvUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  ) : (
                    /* Mode 2: Manual Textarea */
                    <div className="space-y-1">
                      <textarea
                        rows={6}
                        value={manualText}
                        onChange={(e) => handleManualTextChange(e.target.value)}
                        placeholder={`Enter email addresses line by line or comma-separated:\nuser1@example.com, John\nuser2@example.com, Sarah\nstudent@college.edu`}
                        className="w-full glass-input rounded-lg p-3 text-xs font-mono"
                      />
                      <p className="text-[10px] text-slate-500">
                        Type or paste emails. Names will automatically be used for {"{{firstName}}"} tokens.
                      </p>
                    </div>
                  )}

                  {/* Recipient Count & Preview */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span className="font-bold text-slate-800">
                        Recipients Detected: <span className="font-mono text-indigo-600">{parsedRecipients.length}</span>
                      </span>
                    </div>

                    {parsedRecipients.length > 0 && (
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Ready to send
                      </span>
                    )}
                  </div>

                  {/* Preview Table for first 5 recipients */}
                  {parsedRecipients.length > 0 && (
                    <div className="border border-slate-200 rounded-lg overflow-hidden max-h-36 overflow-y-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 text-[11px]">
                          <tr>
                            <th className="px-3 py-1.5 font-bold">Email</th>
                            <th className="px-3 py-1.5 font-bold">First Name</th>
                            <th className="px-3 py-1.5 font-bold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                          {parsedRecipients.slice(0, 5).map((r, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="px-3 py-1 text-slate-900">{r.email}</td>
                              <td className="px-3 py-1 text-slate-600">{r.firstName || '--'}</td>
                              <td className="px-3 py-1 text-emerald-700 font-bold">Valid</td>
                            </tr>
                          ))}
                          {parsedRecipients.length > 5 && (
                            <tr>
                              <td colSpan={3} className="px-3 py-1 text-center text-[10px] text-slate-500 bg-slate-50 italic">
                                + {parsedRecipients.length - 5} more recipient(s)
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                </div>

                {/* Dispatch Controls */}
                <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsSendOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={isSending || parsedRecipients.length === 0}
                    onClick={handleDispatchMails}
                    className={`px-5 py-2.5 rounded-lg text-white font-semibold text-xs transition shadow-xs flex items-center gap-2 ${
                      isSending || parsedRecipients.length === 0
                        ? 'bg-indigo-300 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending {parsedRecipients.length} Emails...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send {parsedRecipients.length > 0 ? `${parsedRecipients.length} ` : ''}Emails from {senderEmail}</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};