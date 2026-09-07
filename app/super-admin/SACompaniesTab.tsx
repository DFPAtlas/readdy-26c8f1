'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { logAuditAction } from '@/lib/auth';
import { useAuth } from '@/lib/AuthContext';

interface Company {
  id: string;
  name: string;
  billing_email: string;
  subscription_plan: string;
  account_status: string;
  created_at: string;
}

interface SACompaniesTabProps {
  companies: Company[];
  loading: boolean;
  onRefresh: () => void;
}

const planColors: Record<string, string> = {
  enterprise: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  professional: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  starter: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  suspended: 'bg-red-500/20 text-red-300 border-red-500/30',
  trial: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  cancelled: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export default function SACompaniesTab({ companies, loading, onRefresh }: SACompaniesTabProps) {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', billing_email: '', subscription_plan: 'starter' });

  const filtered = companies.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.billing_email.toLowerCase().includes(search.toLowerCase());
    const matchPlan = planFilter === 'all' || c.subscription_plan === planFilter;
    const matchStatus = statusFilter === 'all' || c.account_status === statusFilter;
    return matchSearch && matchPlan && matchStatus;
  });

  const handleSuspend = async (company: Company) => {
    if (!confirm(`Suspend ${company.name}? They will lose access immediately.`)) return;
    setActionLoading(company.id);
    await supabase.from('companies').update({ account_status: 'suspended' }).eq('id', company.id);
    if (user) await logAuditAction(user.id, null, 'suspend_company', 'companies', company.id, { company_name: company.name });
    onRefresh();
    setActionLoading(null);
  };

  const handleActivate = async (company: Company) => {
    setActionLoading(company.id);
    await supabase.from('companies').update({ account_status: 'active' }).eq('id', company.id);
    if (user) await logAuditAction(user.id, null, 'activate_company', 'companies', company.id, { company_name: company.name });
    onRefresh();
    setActionLoading(null);
  };

  const handleChangePlan = async (company: Company, plan: string) => {
    setActionLoading(company.id);
    await supabase.from('companies').update({ subscription_plan: plan }).eq('id', company.id);
    if (user) await logAuditAction(user.id, null, 'change_plan', 'companies', company.id, { company_name: company.name, new_plan: plan });
    onRefresh();
    setActionLoading(null);
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading('create');
    await supabase.from('companies').insert({ ...newCompany, account_status: 'active' });
    if (user) await logAuditAction(user.id, null, 'create_company', 'companies', 'new', { company_name: newCompany.name });
    setShowCreate(false);
    setNewCompany({ name: '', billing_email: '', subscription_plan: 'starter' });
    onRefresh();
    setActionLoading(null);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search companies..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
        <div className="flex items-center space-x-2">
          {['all', 'starter', 'professional', 'enterprise'].map((p) => (
            <button key={p} onClick={() => setPlanFilter(p)} className={`px-3 py-2 rounded-lg text-xs font-medium capitalize cursor-pointer whitespace-nowrap transition-all ${planFilter === p ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'}`}>
              {p === 'all' ? 'All Plans' : p}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          {['all', 'active', 'trial', 'suspended'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-lg text-xs font-medium capitalize cursor-pointer whitespace-nowrap transition-all ${statusFilter === s ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'}`}>
              {s === 'all' ? 'All Status' : s}
            </button>
          ))}
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-medium cursor-pointer whitespace-nowrap">
          <i className="ri-add-line"></i><span>New Company</span>
        </button>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowCreate(false)}></div>
          <div className="relative bg-[#0a1628] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-white font-bold text-lg mb-4">Create Company Account</h3>
            <form onSubmit={handleCreateCompany} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Company Name</label>
                <input type="text" value={newCompany.name} onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })} required className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500/50" placeholder="Acme Facilities Ltd" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Billing Email</label>
                <input type="email" value={newCompany.billing_email} onChange={(e) => setNewCompany({ ...newCompany, billing_email: e.target.value })} required className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500/50" placeholder="billing@company.com" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Plan</label>
                <div className="grid grid-cols-3 gap-2">
                  {['starter', 'professional', 'enterprise'].map((p) => (
                    <button key={p} type="button" onClick={() => setNewCompany({ ...newCompany, subscription_plan: p })} className={`py-2 rounded-xl text-xs font-medium capitalize cursor-pointer whitespace-nowrap transition-all ${newCompany.subscription_plan === p ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300' : 'bg-white/5 border border-white/10 text-gray-400'}`}>{p}</button>
                  ))}
                </div>
              </div>
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-2.5 border border-white/10 text-gray-400 rounded-xl text-sm cursor-pointer whitespace-nowrap hover:text-white">Cancel</button>
                <button type="submit" disabled={actionLoading === 'create'} className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-medium cursor-pointer whitespace-nowrap disabled:opacity-60">
                  {actionLoading === 'create' ? 'Creating...' : 'Create Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {['Company', 'Billing Email', 'Plan', 'Status', 'Created', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-4"><div className="h-4 bg-white/5 rounded animate-pulse"></div></td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-500">No companies found</td></tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-cyan-300 font-bold text-sm">{c.name[0]}</span>
                      </div>
                      <span className="font-medium text-white text-sm">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-400">{c.billing_email}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${planColors[c.subscription_plan] || planColors.starter}`}>{c.subscription_plan}</span>
                      <div className="relative group">
                        <button className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-300 cursor-pointer">
                          <i className="ri-edit-line text-xs"></i>
                        </button>
                        <div className="absolute left-0 top-full mt-1 bg-[#0a1628] border border-white/10 rounded-xl shadow-xl z-10 hidden group-hover:block w-36">
                          {['starter', 'professional', 'enterprise'].map((p) => (
                            <button key={p} onClick={() => handleChangePlan(c, p)} className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 capitalize cursor-pointer first:rounded-t-xl last:rounded-b-xl">{p}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${statusColors[c.account_status] || statusColors.active}`}>{c.account_status}</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">{new Date(c.created_at).toLocaleDateString('en-GB')}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      {c.account_status === 'suspended' ? (
                        <button onClick={() => handleActivate(c)} disabled={actionLoading === c.id} className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs cursor-pointer whitespace-nowrap hover:bg-emerald-500/30 disabled:opacity-60">
                          Activate
                        </button>
                      ) : (
                        <button onClick={() => handleSuspend(c)} disabled={actionLoading === c.id} className="px-3 py-1.5 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg text-xs cursor-pointer whitespace-nowrap hover:bg-red-500/30 disabled:opacity-60">
                          Suspend
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}