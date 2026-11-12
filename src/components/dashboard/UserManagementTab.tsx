import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Trash2, 
  ShieldCheck, 
  CheckCircle2, 
  ShieldAlert, 
  X,
  Info
} from 'lucide-react';
import { MorphicCard, MorphicBadge } from '../common/MorphicCard';
import { TeamMember } from '../../types';
import { api } from '../../services/api';

export const UserManagementTab: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [showInfoNotice, setShowInfoNotice] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await api.getTeam();
      setMembers(data);
    } catch {
      setMembers([
        {
          id: 'admin-master',
          name: 'System Administrator',
          email: 'admin@brainovision.in',
          role: 'Admin',
          status: 'Active',
          twoFactorEnabled: false,
          lastLogin: 'Active'
        }
      ]);
    }
  };

  const permissionsMatrix = [
    { permission: 'Send bulk email campaigns', owner: true, admin: true },
    { permission: 'Import and export contact lists', owner: true, admin: true },
    { permission: 'Authenticate sending domains (SPF / DKIM)', owner: true, admin: true },
    { permission: 'Manage suppression and bounce list', owner: true, admin: true },
    { permission: 'Create and revoke REST API keys', owner: true, admin: true },
    { permission: 'Configure webhook delivery endpoints', owner: true, admin: true },
    { permission: 'View transmission analytics and delivery logs', owner: true, admin: true },
    { permission: 'Upgrade monthly email volume quota', owner: true, admin: true },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Administrator Access
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            FlowEM is currently configured for Single Admin access. Platform operations are managed by the primary Administrator.
          </p>
        </div>

        <button
          onClick={() => setShowInfoNotice(true)}
          className="px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs border border-indigo-200 transition shadow-xs flex items-center gap-2"
        >
          <Info className="w-4 h-4" />
          <span>Single Admin Mode</span>
        </button>
      </div>

      {/* Single Admin Mode Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 text-xs text-indigo-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Single Administrator Model (Phase 2)</h4>
            <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
              Public registration and team invitations are disabled. All administrative rights for campaigns, contacts, templates, and AWS SES settings belong exclusively to the primary Admin account.
            </p>
          </div>
        </div>
        <div className="shrink-0 font-mono text-[11px] font-bold px-3 py-1 rounded bg-white text-indigo-700 border border-indigo-200">
          STATUS: ENFORCED
        </div>
      </div>

      {/* Team Roster Table */}
      <div className="glass-panel rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Active Administrator Account</h3>
          <span className="text-xs text-slate-500 font-medium">Security: JWT + HTTP-Only Session</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-bold text-[11px]">
              <tr>
                <th className="py-3 px-4">Administrator Name</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">2-Factor Security</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Session Type</th>
                <th className="py-3 px-4 text-right">Access Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {members.map(member => (
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
                      <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                        <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                        <span>Optional</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <MorphicBadge
                      label="Active"
                      variant="success"
                    />
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono">
                    HTTP-Only Cookie
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-indigo-700 font-mono">
                    Full Platform Control
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Administrator Authority & Privileges</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of platform capabilities granted to the primary Administrator account.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Platform Capability</th>
                <th className="py-3 px-4 text-center">Owner</th>
                <th className="py-3 px-4 text-center">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {permissionsMatrix.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-medium text-slate-900">{p.permission}</td>
                  <td className="py-2.5 px-4 text-center font-bold text-emerald-700 font-mono">Allowed</td>
                  <td className="py-2.5 px-4 text-center font-bold text-emerald-700 font-mono">Allowed</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Notice Modal */}
      {showInfoNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Single Admin Operation</h3>
              <button
                onClick={() => setShowInfoNotice(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                FlowEM is intentionally configured for single-admin operations during Phase 2.
              </p>
              <p>
                There is only one primary Administrator account (<code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">admin@brainovision.in</code>). Public registration and invitations are disabled at the API level.
              </p>
              <p>
                The underlying MySQL schema has been architected to support multiple user roles (Owner, Admin, Campaign Creator, Analyst, Viewer) in future releases without requiring any schema migrations.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowInfoNotice(false)}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
