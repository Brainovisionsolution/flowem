import React, { useState } from 'react';
import { 
  Zap, 
  Clock, 
  Send, 
  GitBranch, 
  Tag, 
  Webhook, 
  Plus, 
  Play, 
  Pause, 
  CheckCircle2, 
  Sliders, 
  Trash2, 
  X,
  ChevronDown,
  ArrowDown
} from 'lucide-react';
import { MorphicCard, MorphicBadge } from '../common/MorphicCard';
import { initialWorkflows } from '../../data/mockData';
import { AutomationWorkflow, AutomationStep } from '../../types';

export const AutomationTab: React.FC = () => {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>(initialWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<AutomationWorkflow>(initialWorkflows[0]);
  const [isAddStepOpen, setIsAddStepOpen] = useState(false);
  const [newStepType, setNewStepType] = useState<AutomationStep['type']>('delay');
  const [newStepTitle, setNewStepTitle] = useState('');
  const [testTriggerFired, setTestTriggerFired] = useState(false);

  const toggleStatus = (workflowId: string) => {
    setWorkflows(prev => prev.map(w => {
      if (w.id === workflowId) {
        const nextStatus = w.status === 'Active' ? 'Paused' : 'Active';
        return { ...w, status: nextStatus };
      }
      return w;
    }));
    if (selectedWorkflow.id === workflowId) {
      setSelectedWorkflow(prev => ({
        ...prev,
        status: prev.status === 'Active' ? 'Paused' : 'Active'
      }));
    }
  };

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    const newStep: AutomationStep = {
      id: `st-${Date.now()}`,
      type: newStepType,
      title: newStepTitle || `${newStepType.toUpperCase()}: Configured Automation Node`,
      subtitle: `Configured parameters for ${newStepType}`,
      config: {}
    };

    const updatedWorkflow: AutomationWorkflow = {
      ...selectedWorkflow,
      steps: [...selectedWorkflow.steps, newStep]
    };

    setSelectedWorkflow(updatedWorkflow);
    setWorkflows(workflows.map(w => w.id === updatedWorkflow.id ? updatedWorkflow : w));
    setIsAddStepOpen(false);
    setNewStepTitle('');
  };

  const handleFireTest = () => {
    setTestTriggerFired(true);
    setTimeout(() => {
      setTestTriggerFired(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Visual Automation & Multi-Branch Journeys
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Build event-driven pipelines with automated throttling, branch evaluations, and webhook callbacks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleFireTest}
            disabled={testTriggerFired}
            className="px-3.5 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-xs text-cyan-300 border border-cyan-500/30 transition flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>{testTriggerFired ? 'Test Event Emitted!' : 'Fire Test Webhook'}</span>
          </button>
          
          <button
            onClick={() => toggleStatus(selectedWorkflow.id)}
            className={`px-4 py-2 rounded-lg font-medium text-xs transition flex items-center gap-2 ${
              selectedWorkflow.status === 'Active'
                ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30 hover:bg-amber-600/30'
                : 'bg-emerald-600 text-white shadow-glow-emerald hover:bg-emerald-500'
            }`}
          >
            {selectedWorkflow.status === 'Active' ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Workflow</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Activate Workflow</span>
              </>
            )}
          </button>
        </div>
      </div>

      {testTriggerFired && (
        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>Payload received & enrolled: synthetic test subscriber ingested into step 1.</span>
        </div>
      )}

      {/* Workflow Selector Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {workflows.map(wf => (
          <div
            key={wf.id}
            onClick={() => setSelectedWorkflow(wf)}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              selectedWorkflow.id === wf.id
                ? 'bg-indigo-600/20 border-indigo-500 shadow-glow-indigo'
                : 'glass-card hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-indigo-400 uppercase">
                {wf.triggerType}
              </span>
              <MorphicBadge
                label={wf.status}
                variant={wf.status === 'Active' ? 'success' : 'neutral'}
              />
            </div>
            <h3 className="text-sm font-bold text-white">{wf.name}</h3>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{wf.description}</p>
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800 font-mono">
              <span>{wf.totalEnrolled.toLocaleString()} Enrolled</span>
              <span className="text-emerald-400">{wf.avgConversionRate}% Conv</span>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Canvas View */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-white">{selectedWorkflow.name}</h3>
              <MorphicBadge label={selectedWorkflow.status} variant={selectedWorkflow.status === 'Active' ? 'success' : 'neutral'} />
            </div>
            <p className="text-xs text-slate-400 mt-1">{selectedWorkflow.description}</p>
          </div>

          <button
            onClick={() => setIsAddStepOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition shadow-glow-indigo flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Append Journey Node</span>
          </button>
        </div>

        {/* Step Flow Nodes */}
        <div className="max-w-2xl mx-auto py-4 space-y-4">
          {selectedWorkflow.steps.map((step, index) => {
            const isTrigger = step.type === 'trigger';
            const isEmail = step.type === 'email';
            const isDelay = step.type === 'delay';
            const isCondition = step.type === 'condition';
            const isWebhook = step.type === 'webhook';
            const isTag = step.type === 'tag';

            return (
              <React.Fragment key={step.id}>
                <div
                  className={`p-4 rounded-xl border transition relative ${
                    isTrigger
                      ? 'bg-slate-900/90 border-indigo-500/50 shadow-glow-indigo'
                      : isEmail
                      ? 'bg-slate-900/90 border-emerald-500/40'
                      : isDelay
                      ? 'bg-slate-900/90 border-cyan-500/40'
                      : isCondition
                      ? 'bg-slate-900/90 border-purple-500/40'
                      : 'bg-slate-900/90 border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          isTrigger
                            ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                            : isEmail
                            ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                            : isDelay
                            ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'
                            : isCondition
                            ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {isTrigger && <Zap className="w-4 h-4" />}
                        {isEmail && <Send className="w-4 h-4" />}
                        {isDelay && <Clock className="w-4 h-4" />}
                        {isCondition && <GitBranch className="w-4 h-4" />}
                        {isWebhook && <Webhook className="w-4 h-4" />}
                        {isTag && <Tag className="w-4 h-4" />}
                      </div>

                      <div>
                        <div className="text-sm font-semibold text-white">{step.title}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{step.subtitle}</div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                      Node #{index + 1}
                    </span>
                  </div>
                </div>

                {index < selectedWorkflow.steps.length - 1 && (
                  <div className="flex flex-col items-center justify-center my-1">
                    <div className="w-0.5 h-6 bg-slate-700"></div>
                    <ArrowDown className="w-3.5 h-3.5 text-slate-500 -mt-1" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

      </div>

      {/* Add Step Modal */}
      {isAddStepOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-semibold text-white">Add Journey Node</h3>
              <button
                onClick={() => setIsAddStepOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStep} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Node Type</label>
                <select
                  value={newStepType}
                  onChange={(e) => setNewStepType(e.target.value as any)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs bg-slate-900"
                >
                  <option value="delay">Time Delay (Wait N Hours/Days)</option>
                  <option value="email">Send Email Template</option>
                  <option value="condition">Decision Condition / Branch</option>
                  <option value="tag">Apply Subscriber Tag</option>
                  <option value="webhook">Webhook POST Callback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Node Title *</label>
                <input
                  type="text"
                  required
                  value={newStepTitle}
                  onChange={(e) => setNewStepTitle(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="e.g. Action: Dispatch Follow-up Advisory"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddStepOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-glow-indigo"
                >
                  Insert Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
