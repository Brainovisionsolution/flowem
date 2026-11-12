import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Eye, 
  Code, 
  Smartphone, 
  Monitor, 
  Copy, 
  CheckCircle2, 
  X, 
  Layers, 
  Tag, 
  ArrowUpRight 
} from 'lucide-react';
import { MorphicCard, MorphicBadge } from '../common/MorphicCard';
import { initialTemplates } from '../../data/mockData';
import { EmailTemplate } from '../../types';

export const TemplatesTab: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePreview, setActivePreview] = useState<EmailTemplate | null>(initialTemplates[0]);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New Template Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<EmailTemplate['category']>('Transactional');
  const [newSubject, setNewSubject] = useState('');
  const [newHtml, setNewHtml] = useState('<!DOCTYPE html><html><body><h1>Hello {{firstName}}</h1></body></html>');

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newTpl: EmailTemplate = {
      id: `tpl-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      subject: newSubject || 'Important notification from FlowEM',
      previewText: 'Review details regarding this automated delivery.',
      htmlContent: newHtml,
      thumbnail: 'transactional',
      updatedAt: new Date().toISOString().split('T')[0],
      isPopular: false
    };

    setTemplates([newTpl, ...templates]);
    setActivePreview(newTpl);
    setIsCreateOpen(false);
    setNewTitle('');
    setNewSubject('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Responsive Email Template Library
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pixel-perfect HTML layouts tested across Outlook, Apple Mail, and Gmail dark/light modes.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition shadow-glow-indigo flex items-center gap-2 border border-indigo-400/40"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Template</span>
        </button>
      </div>

      {/* Main Grid: Gallery & Live Interactive Previewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Template Gallery Cards */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Search & Category Pills */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full glass-input rounded-lg pl-9 pr-3 py-2 text-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {['All', 'Transactional', 'System Alerts', 'Newsletter', 'Product Launch'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg transition whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {filteredTemplates.map(tpl => (
              <div
                key={tpl.id}
                onClick={() => setActivePreview(tpl)}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  activePreview?.id === tpl.id
                    ? 'bg-indigo-600/20 border-indigo-500 shadow-glow-indigo'
                    : 'glass-card hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400">
                      {tpl.category}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{tpl.title}</h3>
                  </div>
                  {tpl.isPopular && <MorphicBadge label="Production Standard" variant="purple" />}
                </div>

                <div className="text-xs text-slate-400 mt-2 font-serif italic">
                  Subject: "{tpl.subject}"
                </div>

                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {tpl.previewText}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 mt-3 border-t border-slate-800/80">
                  <span>Updated: {tpl.updatedAt}</span>
                  <span className="text-indigo-400 font-medium">Inspect Preview &rarr;</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Live Interactive Device Frame */}
        <div className="lg:col-span-7">
          {activePreview ? (
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
              
              {/* Preview Bar Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">{activePreview.title}</h3>
                  <div className="text-xs text-slate-400 font-serif italic">"{activePreview.subject}"</div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Visual vs Code switch */}
                  <div className="flex p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                    <button
                      onClick={() => setViewMode('visual')}
                      className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
                        viewMode === 'visual' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Visual</span>
                    </button>
                    <button
                      onClick={() => setViewMode('code')}
                      className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
                        viewMode === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>HTML</span>
                    </button>
                  </div>

                  {/* Device toggle */}
                  {viewMode === 'visual' && (
                    <div className="flex p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                      <button
                        onClick={() => setPreviewDevice('desktop')}
                        className={`p-1.5 rounded-md transition ${
                          previewDevice === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="Desktop Preview (600px)"
                      >
                        <Monitor className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setPreviewDevice('mobile')}
                        className={`p-1.5 rounded-md transition ${
                          previewDevice === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="Mobile Preview (360px)"
                      >
                        <Smartphone className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Variable Tester bar */}
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-between font-mono">
                <span>Testing Dynamic Variable: <code className="text-cyan-300">{"{{firstName}}"} &rarr; "Sarah"</code></span>
                <span className="text-[11px] text-emerald-400">Liquid / Jinja Syntax Valid</span>
              </div>

              {/* View Container */}
              <div className="min-h-[480px] rounded-xl bg-slate-950 border border-slate-800/80 p-4 flex justify-center items-start overflow-auto">
                {viewMode === 'visual' ? (
                  <div
                    className={`transition-all duration-300 bg-slate-900 rounded-lg shadow-2xl border border-slate-800 overflow-hidden ${
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
                  <pre className="w-full text-xs font-mono text-slate-300 p-4 bg-slate-900 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {activePreview.htmlContent}
                  </pre>
                )}
              </div>

            </div>
          ) : (
            <div className="glass-panel p-12 text-center text-slate-400 rounded-2xl">
              Select a template to inspect details.
            </div>
          )}
        </div>

      </div>

      {/* Create Template Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-semibold text-white">Create Custom Email Template</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Template Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="e.g. Monthly Deliverability Digest"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full glass-input rounded-lg px-3 py-2 text-xs bg-slate-900"
                  >
                    <option value="Transactional">Transactional</option>
                    <option value="System Alerts">System Alerts</option>
                    <option value="Newsletter">Newsletter</option>
                    <option value="Product Launch">Product Launch</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Default Subject</label>
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
                <label className="block text-xs font-medium text-slate-300 mb-1">HTML Content</label>
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
                  className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-glow-indigo"
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
