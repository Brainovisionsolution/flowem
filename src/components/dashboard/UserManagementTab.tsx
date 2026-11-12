import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Trash2, 
  X, 
  CheckCircle2, 
  ShieldAlert
} from 'lucide-react';
import { MorphicBadge } from '../common/MorphicCard';
import { TeamMember } from '../../types';
import { api } from '../../services/api';

export const UserManagementTab: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<TeamMember['role']>('Campaign Manager');

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    const data = await api.getTeam();
    setMembers(data);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    const saved = await api.inviteTeamMember({
      name: newName,
      email: newEmail,
      role: newRole
    });

    setMembers([...members, saved]);
    setIsInviteOpen(false);
    setNewName('');
    setNewEmail('');
  };

  const handleRemoveMember = async (id: string) => {
    if (confirm('Remove access for this team member?')) {
      await api.removeTeamMember(id);
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const permissionsMatrix = [
    { permission: 'Add domains and check DNS', owner: true, admin: true, eng: true, manager: false, analyst: false },
    { permission: 'Send and schedule campaigns', owner: true, admin: true, eng: false, manager: true, analyst: false },
    { permission: 'Create and edit email templates', owner: true, admin: true, eng: false, manager: true, analyst: false },
    { permission: 'Create automated email flows', owner: true, admin: true, eng: true, manager: true, analyst: false },
    { permission: 'View email delivery reports', owner: true, admin: true, eng: true, manager: true, analyst: true },
    { permission: 'Manage unsubscribed & blocked list', owner: true, admin: true, eng: true, manager: false, analyst: false },
    { permission: 'Generate API sending keys', owner: true, admin: true, eng: true, manager: false, analyst: false },
    { permission: 'Upgrade monthly email plans', owner: true, admin: false, eng: false, manager: false, analyst: false },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Team Members
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Invite coworkers and choose what each person is allowed to do in FlowEM ({members.length} members).
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-xs flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Teammate</span>
        </button>
      </div>

      {/* Team Roster Table */}
      <div className="glass-panel rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Current Team Members</h3>
          <span className="text-xs text-slate-500 font-medium">Security: Two-Factor Login Supported</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-bold text-[11px]">
              <tr>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">2-Factor Security</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <UserPlus className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-1" />
                    <p className="font-semibold text-slate-700">No team members invited yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Invite teammates with role-based permissions (Admin, Campaign Creator, Analyst, Viewer).</p>
                  </td>
                </tr>
              ) : (
                members.map(member => (
                  <tr key={member.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{member.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{member.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-indigo-700">{member.role}</span>
                    </td>
                    <td className="py-3 px-4">
                      {member.twoFactorEnabled ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Enabled</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                          <span>Not Set</span>
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
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {member.lastLogin}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {member.role !== 'Owner' && (
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-1.5 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                          title="Remove Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">What Each Role is Allowed to Do</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Clear overview of permissions for each team role.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-bold text-[11px]">
              <tr>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4 text-center">Owner</th>
                <th className="py-3 px-4 text-center">Admin</th>
                <th className="py-3 px-4 text-center">Engineer</th>
                <th className="py-3 px-4 text-center">Campaign Manager</th>
                <th className="py-3 px-4 text-center">Viewer / Analyst</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-4 font-semibold text-slate-900">{item.permission}</td>
                  <td className="py-2.5 px-4 text-center">
                    {item.owner && <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {item.admin && <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {item.eng ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">-</span>}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {item.manager ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">-</span>}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {item.analyst ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Invite Coworker</h3>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="Elena Rostova"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email Address *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                  placeholder="teammate@company.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Choose Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                >
                  <option value="Administrator">Administrator (Full control)</option>
                  <option value="Campaign Manager">Campaign Manager (Create & send campaigns)</option>
                  <option value="Deliverability Engineer">Deliverability Engineer (Domains & DNS)</option>
                  <option value="Analyst">Analyst (View-only reports)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs"
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
