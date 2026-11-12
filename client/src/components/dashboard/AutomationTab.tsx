import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Clock, 
  Send, 
  GitBranch, 
  Tag, 
  Plus, 
  Play, 
  Pause, 
  CheckCircle2, 
  X,
  ArrowDown
} from 'lucide-react';
import { MorphicCard, MorphicBadge } from '../common/MorphicCard';
import { AutomationWorkflow, AutomationStep } from '../../types';
import { api } from '../../services/api';

export const AutomationTab: React.FC = () => {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<AutomationWorkflow | null>(null);
  const [isAddStepOpen, setIsAddStepOpen] = useState(false);
  const [newStepType, setNewStepType] = useState<AutomationStep['type']>('delay');
  const [newStepTitle, setNewStepTitle] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    loadAutomations();
  }, []);

  const loadAutomations = async () => {
    const data = await api.getAutomations();
    setWorkflows(data);
    if (data.length > 0) setSelectedWorkflow(data[0]);
  };

  const handleToggleStatus = async (workflowId: string) => {
    const res = await api.toggleAutomation(workflowId);
    setWorkflows(workflows.map(w => w.id === workflowId ? { ...w, status: res.status as any } : w));
    if (selectedWorkflow?.id === workflowId) {
      setSelectedWorkflow({ ...selectedWorkflow, status: res.status as any });
    }
  };

  const handleAddStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkflow) return;

    const res = await api.addAutomationStep(selectedWorkflow.id, {
      type: newStepType,
      title: newStepTitle || `Step: ${newStepType.toUpperCase()}`,
      subtitle: `Configured ${newStepType} action`
    });

    const updated = { ...selectedWorkflow, steps: res.steps };
    setSelectedWorkflow(updated);
    setWorkflows(workflows.map(w => w.id === updated.id ? updated : w));
    setIsAddStepOpen(false);
    setNewStepTitle('');
  };

  const handleRunTest = async () => {
    if (!selectedWorkflow) return;
    const res = await api.testAutomation();
    setTestResult(res.message);
    setTimeout(() => setTestResult(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Automation & Follow-Ups
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Automatically send welcome emails, reminders, and follow-ups based on customer actions.
          </p>
        </div>

        {selectedWorkflow && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleRunTest}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-xs font-semibold text-sky-700 border border-slate-200 shadow-xs transition flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-sky-600" />
              <span>Send Test Trigger</span>
            </button>
            
            <button
              onClick={() => handleToggleStatus(selectedWorkflow.id)}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition flex items-center gap-2 ${
                selectedWorkflow.status === 'Active'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                  : 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
              }`}
            >
              {selectedWorkflow.status === 'Active' ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Flow</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start Flow</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {testResult && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{testResult}</span>
        </div>
      )}

      {/* Main Content: Empty State or Workflows List & Canvas */}
      {workflows.length === 0 ? (
        <div className="glass-panel p-16 text-center rounded-2xl bg-white border border-slate-200">
          <Zap className="w-10 h-10 mx-auto text-slate-300 stroke-1 mb-2" />
          <h3 className="font-bold text-slate-800 text-sm">No automations created yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Build automated email workflows triggered by events like new signups, purchase confirmations, or inactivity alerts.
          </p>
        </div>
      ) : (
        <>
          {/* Workflow Selector Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workflows.map(wf => (
              <div
                key={wf.id}
                onClick={() => setSelectedWorkflow(wf)}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  selectedWorkflow?.id === wf.id
                    ? 'bg-indigo-50/80 border-indigo-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold font-mono text-indigo-700 uppercase">
                    Trigger: {wf.triggerType}
                  </span>
                  <MorphicBadge
                    label={wf.status}
                    variant={wf.status === 'Active' ? 'success' : 'neutral'}
                  />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{wf.name}</h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{wf.description}</p>
                <div className="flex justify-between items-center text-[11px] text-slate-600 mt-3 pt-2 border-t border-slate-100 font-medium">
                  <span>{wf.totalEnrolled.toLocaleString()} People Enrolled</span>
                  <span className="text-emerald-700 font-bold">{wf.avgConversionRate}% Completed</span>
                </div>
              </div>
            ))}
          </div>

          {selectedWorkflow && (
            <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-900">{selectedWorkflow.name}</h3>
                    <MorphicBadge label={selectedWorkflow.status} variant={selectedWorkflow.status === 'Active' ? 'success' : 'neutral'} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{selectedWorkflow.description}</p>
                </div>

                <button
                  onClick={() => setIsAddStepOpen(true)}
                  className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-xs flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Next Step</span>
                </button>
              </div>

              {/* Step Flow Nodes */}
              <div className="max-w-2xl mx-auto py-2 space-y-3">
                {selectedWorkflow.steps.map((step, index) => {
                  const isTrigger = step.type === 'trigger';
                  const isEmail = step.type === 'email';
                  const isDelay = step.type === 'delay';
                  const isCondition = step.type === 'condition';

                  return (
                    <React.Fragment key={step.id}>
                      <div
                        className={`p-4 rounded-xl border transition ${
                          isTrigger
                            ? 'bg-indigo-50/70 border-indigo-200'
                            : isEmail
                            ? 'bg-white border-slate-200 shadow-xs'
                            : isDelay
                            ? 'bg-sky-50/50 border-sky-200'
                            : isCondition
                            ? 'bg-purple-50/50 border-purple-200'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3.5">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                                isTrigger
                                  ? 'bg-indigo-600 text-white'
                                  : isEmail
                                  ? 'bg-emerald-600 text-white'
                                  : isDelay
                                  ? 'bg-sky-600 text-white'
                                  : isCondition
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-slate-200 text-slate-800'
                              }`}
                            >
                              {isTrigger && <Zap className="w-4 h-4" />}
                              {isEmail && <Send className="w-4 h-4" />}
                              {isDelay && <Clock className="w-4 h-4" />}
                              {isCondition && <GitBranch className="w-4 h-4" />}
                              {step.type === 'tag' && <Tag className="w-4 h-4" />}
                            </div>

                            <div>
                              <div className="text-sm font-bold text-slate-900">{step.title}</div>
                              <div className="text-xs text-slate-500 mt-0.5">{step.subtitle}</div>
                            </div>
                          </div>

                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            Step #{index + 1}
                          </span>
                        </div>
                      </div>

                      {index < selectedWorkflow.steps.length - 1 && (
                        <div className="flex flex-col items-center justify-center my-0.5">
                          <div className="w-0.5 h-4 bg-slate-300"></div>
                          <ArrowDown className="w-3.5 h-3.5 text-slate-400 -mt-1" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

            </div>
          )}
        </>
      )}

      {/* Add Step Modal */}
      {isAddStepOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Add Step to Flow</h3>
              <button
                onClick={() => setIsAddStepOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStep} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">What action should happen?</label>
                <select
                  value={newStepType}
                  onChange={(e) => setNewStepType(e.target.value as any)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                >
                  <option value="delay">Wait a number of days</option>
                  <option value="email">Send an email message</option>
                  <option value="condition">Check if they opened the email</option>
                  <option value="tag">Add a tag to contact</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Step Name *</label>
                <input
                  type="text"
                  required
                  value={newStepTitle}
                  onChange={(e) => setNewStepTitle(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="e.g. Wait 3 Days"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddStepOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs"
                >
                  Save Step
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
