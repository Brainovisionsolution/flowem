import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Eye, 
  Code, 
  Smartphone, 
  Monitor, 
  X
} from 'lucide-react';
import { MorphicCard, MorphicBadge } from '../common/MorphicCard';
import { EmailTemplate } from '../../types';
import { api } from '../../services/api';

export const TemplatesTab: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePreview, setActivePreview] = useState<EmailTemplate | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New Template Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<EmailTemplate['category']>('Transactional');
  const [newSubject, setNewSubject] = useState('');
  const [newHtml, setNewHtml] = useState('<!DOCTYPE html><html><body><h1>Hello {{firstName}}</h1><p>Welcome to our platform!</p></body></html>');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const data = await api.getTemplates();
    setTemplates(data);
    if (data.length > 0) setActivePreview(data[0]);
  };

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const saved = await api.addTemplate({
      title: newTitle,
      category: newCategory,
      subject: newSubject || 'Important notice',
      previewText: 'A quick update from our team.',
      htmlContent: newHtml
    });

    setTemplates([saved, ...templates]);
    setActivePreview(saved);
    setIsCreateOpen(false);
    setNewTitle('');
    setNewSubject('');
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
            Pick from mobile-friendly email layouts or paste your own HTML ({templates.length} templates).
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
              {['All', 'Transactional', 'Newsletter', 'Product Launch'].map(cat => (
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
                    <span>Updated: {tpl.updatedAt}</span>
                    <span className="text-indigo-600 font-semibold">Click to preview &rarr;</span>
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

                <div className="flex items-center gap-2">
                  {/* Visual vs Code */}
                  <div className="flex p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold">
                    <button
                      onClick={() => setViewMode('visual')}
                      className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
                        viewMode === 'visual' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Visual</span>
                    </button>
                    <button
                      onClick={() => setViewMode('code')}
                      className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
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
                <span className="text-[11px] text-emerald-700 font-sans font-bold">Variables Working</span>
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
                Select any email template from the list to preview mobile and desktop versions, inspect HTML code, or edit layouts.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Create Template Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Create Email Template</h3>
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
                  placeholder="e.g. End of Year Customer Thank You"
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
                  rows={8}
                  value={newHtml}
                  onChange={(e) => setNewHtml(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs font-mono"
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
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
