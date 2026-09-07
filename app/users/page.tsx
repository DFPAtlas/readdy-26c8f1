'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import AuthGuard from '@/components/AuthGuard';
import UsageBar from '@/components/UsageBar';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthContext';
import { checkUserLimit } from '@/lib/subscription-limits';
import { getRoleLabel, getRoleColor, logAuditAction } from '@/lib/auth';
import type { UserRole } from '@/lib/auth';
import Link from 'next/link';

const ROLES: UserRole[] = ['company_admin', 'fm_manager', 'site_manager', 'engineer', 'client_user', 'finance_user', 'viewer'];

interface UserRow {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  status: string;
  department?: string;
  job_title?: string;
  last_login?: string;
  created_at: string;
}

export default function UsersPage() {
  const { profile, limits, refreshLimits } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showInvite, setShowInvite] = useState(false);
  const [limitBlocked, setLimitBlocked] = useState<{ message: string; upgradeUrl: string } | null>(null);
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [toast, setToast] = useState('');

  const userCheck = limits ? checkUserLimit(limits) : null;

  useEffect(() => {
    if (profile?.company_id) fetchUsers();
  }, [profile]);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('company_id', profile!.company_id)
      .order('created_at', { ascending: false });
    setUsers(data || []);
    setLoading(false);
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleInviteClick = () => {
    if (userCheck && !userCheck.allowed) {
      setLimitBlocked(userCheck);
      setTimeout(() => setLimitBlocked(null), 4000);
      return;
    }
    setShowInvite(true);
  };

  const handleInvited = () => {
    setShowInvite(false);
    showToast('Invitation sent successfully');
    refreshLimits();
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    await supabase.from('user_profiles').update({ role: newRole }).eq('id', userId);
    await logAuditAction(profile!.id, profile!.company_id, 'role_changed', 'user_profiles', userId, { new_role: newRole });
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
    showToast('User role updated');
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    await supabase.from('user_profiles').update({ status: newStatus }).eq('id', userId);
    await logAuditAction(profile!.id, profile!.company_id, 'user_status_changed', 'user_profiles', userId, { new_status: newStatus });
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: newStatus } : u));
    showToast(`User ${newStatus === 'active' ? 'activated' : 'suspended'}`);
  };

  const filtered = users.filter((u) => {
    const matchSearch = !search || u.full_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const initials = (name: string) => name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <AuthGuard allowedRoles={['company_admin', 'super_admin', 'platform_owner', 'fm_manager']}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar title="User Management" />
          <div className="flex-1 p-6 overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
                <p className="text-gray-500 text-sm mt-1">{users.length} users in your organisation</p>
              </div>
              <button
                onClick={handleInviteClick}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 cursor-pointer whitespace-nowrap transition-colors"
              >
                <i className="ri-user-add-line"></i>
                <span>Invite User</span>
              </button>
            </div>

            {limits && userCheck && userCheck.percentage >= 80 && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className="ri-dashboard-3-line text-gray-500"></i>
                  </div>
                  <span className="text-sm font-medium text-gray-700">User Seats</span>
                  <span className="ml-auto text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium capitalize">{limits.plan}</span>
                </div>
                <div className="max-w-sm">
                  <UsageBar label="Users" check={userCheck} icon="ri-team-line" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Users', value: users.length, icon: 'ri-team-line', color: 'text-blue-500' },
                { label: 'Active', value: users.filter((u) => u.status === 'active').length, icon: 'ri-user-follow-line', color: 'text-green-500' },
                { label: 'Admins', value: users.filter((u) => u.role === 'company_admin').length, icon: 'ri-shield-user-line', color: 'text-purple-500' },
                { label: 'Engineers', value: users.filter((u) => u.role === 'engineer').length, icon: 'ri-tools-line', color: 'text-orange-500' },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className={`${s.icon} ${s.color}`}></i>
                    </div>
                    <span className="text-sm text-gray-500">{s.label}</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{s.value}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <div className="flex-1 relative">
                  <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search users..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
                  >
                    <option value="all">All Roles</option>
                    {ROLES.map((r) => <option key={r} value={r}>{getRoleLabel(r)}</option>)}
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm"></i>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <i className="ri-loader-4-line text-3xl text-blue-500 animate-spin"></i>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                  <i className="ri-user-line text-4xl mb-2"></i>
                  <p>No users found</p>
                  <button onClick={handleInviteClick} className="mt-3 text-blue-600 text-sm hover:text-blue-700 cursor-pointer">Invite your first team member</button>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {['User', 'Role', 'Department', 'Status', 'Last Login', 'Actions'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-600 font-semibold text-sm">{initials(u.full_name)}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{u.full_name}</p>
                              <p className="text-xs text-gray-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {u.id === profile?.id ? (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(u.role)}`}>{getRoleLabel(u.role)}</span>
                          ) : (
                            <div className="relative">
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                                className={`pl-2 pr-6 py-0.5 rounded-full text-xs font-medium border-0 appearance-none cursor-pointer ${getRoleColor(u.role)}`}
                              >
                                {ROLES.map((r) => <option key={r} value={r}>{getRoleLabel(r)}</option>)}
                              </select>
                              <i className="ri-arrow-down-s-line absolute right-1 top-1/2 -translate-y-1/2 text-xs pointer-events-none"></i>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{u.department || u.job_title || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400">
                          {u.last_login ? new Date(u.last_login).toLocaleDateString('en-GB') : 'Never'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            {u.id !== profile?.id && (
                              <button
                                onClick={() => handleStatusToggle(u.id, u.status)}
                                className={`text-xs px-2 py-1 rounded cursor-pointer whitespace-nowrap ${u.status === 'active' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                              >
                                {u.status === 'active' ? 'Suspend' : 'Activate'}
                              </button>
                            )}
                            {u.id === profile?.id && (
                              <span className="text-xs text-gray-400 italic">You</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} onInvited={handleInvited} />}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium z-50 flex items-center gap-2">
          <i className="ri-checkbox-circle-line text-green-400"></i>
          {toast}
        </div>
      )}
      {limitBlocked && (
        <div className="fixed bottom-6 right-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl shadow-lg text-sm font-medium z-50 flex flex-col gap-3 max-w-sm">
          <div className="flex items-center gap-2">
            <i className="ri-alert-line text-red-500"></i>
            <span>{limitBlocked.message}</span>
          </div>
          <Link
            href={limitBlocked.upgradeUrl}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 cursor-pointer transition-colors whitespace-nowrap"
          >
            <span>Upgrade Plan</span>
            <div className="w-3 h-3 flex items-center justify-center">
              <i className="ri-arrow-right-up-line"></i>
            </div>
          </Link>
        </div>
      )}
    </AuthGuard>
  );
}

function InviteModal({ onClose, onInvited }: { onClose: () => void; onInvited: () => void }) {
  const { profile } = useAuth();
  const [form, setForm] = useState({ full_name: '', email: '', role: 'engineer' as UserRole, department: '', job_title: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const tempPassword = Math.random().toString(36).slice(-10) + 'A1!';
      const { createClient } = await import('@supabase/supabase-js');
      const adminSb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: authData, error: authErr } = await adminSb.auth.signUp({
        email: form.email,
        password: tempPassword,
        options: { data: { full_name: form.full_name } }
      });
      if (authErr) throw authErr;
      if (authData.user) {
        await adminSb.from('user_profiles').insert({
          id: authData.user.id,
          company_id: profile!.company_id,
          full_name: form.full_name,
          email: form.email,
          role: form.role,
          status: 'active',
          department: form.department,
          job_title: form.job_title,
          permissions: [],
        });
        await logAuditAction(profile!.id, profile!.company_id, 'user_invited', 'user_profiles', authData.user.id, { email: form.email, role: form.role });
      }
      onInvited();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to invite user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Invite Team Member</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer">
            <i className="ri-close-line"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
            <input type="text" value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Smith" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
            <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="john@company.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Role *</label>
            <div className="relative">
              <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8 bg-white cursor-pointer">
                {ROLES.map((r) => <option key={r} value={r}>{getRoleLabel(r)}</option>)}
              </select>
              <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm"></i>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
              <input type="text" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Engineering" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title</label>
              <input type="text" value={form.job_title} onChange={(e) => setForm((f) => ({ ...f, job_title: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. FM Engineer" />
            </div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">A confirmation email will be sent to the user. They will be asked to set their own password on first login.</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 cursor-pointer whitespace-nowrap disabled:opacity-60 flex items-center justify-center space-x-2">
              {loading ? <><i className="ri-loader-4-line animate-spin"></i><span>Inviting...</span></> : <span>Send Invitation</span>}
            </button>
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 cursor-pointer whitespace-nowrap">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}