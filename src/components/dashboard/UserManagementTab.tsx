import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Trash2, 
  X, 
  CheckCircle2, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { MorphicCard, MorphicBadge } from '../common/MorphicCard';
import { initialTeamMembers } from '../../data/mockData';
import { TeamMember } from '../../types';

export const UserManagementTab: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<TeamMember['role']>('Deliverability Engineer');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    const newMember: TeamMember = {
      id: `usr-${Date.now()}`,
      name: newName || 'Invited Engineer',
      email: newEmail,
      role: newRole,
      twoFactorEnabled: false,
      status: 'Invited',
      lastLogin: 'Pending Acceptance'
    };

    setMembers([...members, newMember]);
    setIsInviteOpen(false);
    setNewName('');
    setNewEmail('');
  };

  const handleRemoveMember = (id: string) => {
    if (confirm('Revoke access credentials for this team member?')) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const permissionsMatrix = [
    { permission: 'Configure Senders & DNS Records', owner: true, admin: true, eng: true, manager: false, analyst: false },
    { permission: 'Create & Launch Campaigns', owner: true, admin: true, eng: false, manager: true, analyst: false },
    { permission: 'Edit Visual & HTML Templates', owner: true, admin: true, eng: false, manager: true, analyst: false },
    { permission: 'Build Automation Workflows', owner: true, admin: true, eng: true, manager: true, analyst: false },
    { permission: 'View Deliverability Analytics', owner: true, admin: true, eng: true, manager: true, analyst: true },
    { permission: 'Manage Suppression & Compliance', owner: true, admin: true, eng: true, manager: false, analyst: false },
    { permission: 'Provision REST API Keys & Webhooks', owner: true, admin: true, eng: true, manager: false, analyst: false },
    { permission: 'Billing & Quota Tier Upgrades', owner: true, admin: false, eng: false, manager: false, analyst: false },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            User Management & Role-Based Access Control
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Maintain team membership, assign least-privilege security roles, and enforce two-factor verification.
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition shadow-glow-indigo flex items-center gap-2 border border-indigo-400/40"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      {/* Team Roster Table */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Active Authorized Operators ({members.length})</h3>
          <span className="text-xs text-slate-400">Security Standard: SOC-2 Type II RBAC</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Operator</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">2FA Enforced</th>
                <th className="py-3.5 px-4">Access Status</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {members.map(member => (
                <tr key={member.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{member.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{member.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-indigo-300 font-medium">{member.role}</span>
                  </td>
                  <td className="py-3 px-4">
                    {member.twoFactorEnabled ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Enabled</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-400">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Pending</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <MorphicBadge
                      label={member.status}
                      variant={
                        member.status === 'Active'
                          ? 'success'
                          : member.status === 'Invited'
                          ? 'info'
                          : 'error'
                      }
                    />
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono">
                    {member.lastLogin}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {member.role !== 'Owner' && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition"
                        title="Revoke Member Access"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-white">Granular Permission Matrix by Role</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Overview of access privileges enforced across FlowEM console modules.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 text-[11px]">
              <tr>
                <th className="py-3 px-4">Permission Capability</th>
                <th className="py-3 px-4 text-center">Owner</th>
                <th className="py-3 px-4 text-center">Admin</th>
                <th className="py-3 px-4 text-center">Deliverability Eng</th>
                <th className="py-3 px-4 text-center">Campaign Mgr</th>
                <th className="py-3 px-4 text-center">Analyst</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/20">
                  <td className="py-2.5 px-4 font-medium text-white">{item.permission}</td>
                  <td className="py-2.5 px-4 text-center">
                    {item.owner && <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {item.admin && <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {item.eng ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-600">-</span>}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {item.manager ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-600">-</span>}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {item.analyst ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-600">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-semibold text-white">Invite Operator to FlowEM</h3>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="Elena Rostova"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Corporate Email Address *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="colleague@flowem-systems.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Assign Security Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs bg-slate-900"
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Deliverability Engineer">Deliverability Engineer</option>
                  <option value="Campaign Manager">Campaign Manager</option>
                  <option value="Analyst">Analyst (Read-Only)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-glow-indigo"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
