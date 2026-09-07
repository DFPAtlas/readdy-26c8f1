'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import SAKPIBar from './SAKPIBar';
import SACompaniesTab from './SACompaniesTab';
import SAPlansTab from './SAPlansTab';
import SAAuditTab from './SAAuditTab';
import SASystemHealth from './SASystemHealth';

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'ri-dashboard-line' },
  { id: 'companies', label: 'Companies', icon: 'ri-building-line' },
  { id: 'users', label: 'Users', icon: 'ri-team-line' },
  { id: 'plans', label: 'Plans & Pricing', icon: 'ri-price-tag-3-line' },
  { id: 'subscriptions', label: 'Subscriptions', icon: 'ri-repeat-line' },
  { id: 'payments', label: 'Payments', icon: 'ri-bank-card-line' },
  { id: 'support', label: 'Support', icon: 'ri-customer-service-line' },
  { id: 'health', label: 'System Health', icon: 'ri-pulse-line' },
  { id: 'audit', label: 'Audit Logs', icon: 'ri-file-list-3-line' },
];

export default function SuperAdminPage() {
  return (
    <AuthGuard allowedRoles={['platform_owner', 'super_admin']}>
      <SuperAdminContent />
    </AuthGuard>
  );
}

function SuperAdminContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);

  const [stats, setStats] = useState({
    totalCompanies: 0,
    activeSubscriptions: 0,
    trialAccounts: 0,
    suspendedAccounts: 0,
    mrr: 0,
    totalUsers: 0,
    totalWorkOrders: 0,
    newSignups: 0,
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [compsRes, usersRes, logsRes, subsRes, paymentsRes, ticketsRes, woRes] = await Promise.all([
      supabase.from('companies').select('*').order('created_at', { ascending: false }),
      supabase.from('user_profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('subscriptions').select('*').order('created_at', { ascending: false }),
      supabase.from('payments').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('support_tickets').select('*').order('created_at', { ascending: false }),
      supabase.from('work_orders').select('id', { count: 'exact' }),
    ]);

    const comps = compsRes.data || [];
    const allUsers = usersRes.data || [];
    const subs = subsRes.data || [];

    setCompanies(comps);
    setUsers(allUsers);
    setAuditLogs(logsRes.data || []);
    setSubscriptions(subs);
    setPayments(paymentsRes.data || []);
    setTickets(ticketsRes.data || []);

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const newSignups = comps.filter((c: any) => new Date(c.created_at) >= thirtyDaysAgo).length;

    const planPrices: Record<string, number> = { starter: 99, professional: 299, enterprise: 799 };
    const mrr = comps
      .filter((c: any) => c.account_status === 'active')
      .reduce((sum: number, c: any) => sum + (planPrices[c.subscription_plan] || 0), 0);

    setStats({
      totalCompanies: comps.length,
      activeSubscriptions: comps.filter((c: any) => c.account_status === 'active').length,
      trialAccounts: subs.filter((s: any) => s.status === 'trial').length,
      suspendedAccounts: comps.filter((c: any) => c.account_status === 'suspended').length,
      mrr,
      totalUsers: allUsers.length,
      totalWorkOrders: woRes.count || 0,
      newSignups,
    });

    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-[#050d1a] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="h-14 bg-[#070f1f] border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <i className="ri-shield-star-line text-white text-sm"></i>
            </div>
            <div>
              <h1 className="text-white font-bold text-sm">Synqoro Super Admin</h1>
              <p className="text-gray-500 text-xs">Platform Administration</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-emerald-400 text-xs font-medium">All Systems Operational</span>
            </div>
            <button onClick={fetchAll} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white bg-white/5 rounded-lg cursor-pointer transition-colors">
              <i className="ri-refresh-line text-sm"></i>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <SAKPIBar stats={stats} loading={loading} />

            <div className="flex space-x-1 mb-6 bg-white/3 border border-white/8 rounded-xl p-1 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <i className={`${tab.icon} text-sm`}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-white font-semibold mb-4">Recent Company Signups</h3>
                      <div className="space-y-3">
                        {companies.slice(0, 5).map((c: any) => (
                          <div key={c.id} className="flex items-center space-x-3 p-3 bg-white/3 rounded-xl">
                            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-cyan-300 font-bold text-sm">{c.name[0]}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-medium truncate">{c.name}</p>
                              <p className="text-gray-500 text-xs">{c.billing_email}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${c.subscription_plan === 'enterprise' ? 'bg-violet-500/20 text-violet-300' : c.subscription_plan === 'professional' ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-400'}`}>{c.subscription_plan}</span>
                              <p className="text-gray-600 text-xs mt-0.5">{new Date(c.created_at).toLocaleDateString('en-GB')}</p>
                            </div>
                          </div>
                        ))}
                        {companies.length === 0 && !loading && <p className="text-gray-500 text-sm text-center py-4">No companies yet</p>}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white font-semibold mb-4">Revenue by Plan</h3>
                      <div className="space-y-3">
                        {[
                          { plan: 'Enterprise', price: 799, color: 'bg-violet-400', count: companies.filter((c: any) => c.subscription_plan === 'enterprise' && c.account_status === 'active').length },
                          { plan: 'Professional', price: 299, color: 'bg-blue-400', count: companies.filter((c: any) => c.subscription_plan === 'professional' && c.account_status === 'active').length },
                          { plan: 'Starter', price: 99, color: 'bg-gray-400', count: companies.filter((c: any) => c.subscription_plan === 'starter' && c.account_status === 'active').length },
                        ].map((p) => (
                          <div key={p.plan} className="p-4 bg-white/3 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${p.color}`}></span>
                                <span className="text-white text-sm font-medium">{p.plan}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-white font-bold">£{(p.count * p.price).toLocaleString()}</span>
                                <span className="text-gray-500 text-xs">/mo</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <span>{p.count} active accounts</span>
                              <span>£{p.price}/mo each</span>
                            </div>
                          </div>
                        ))}
                        <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-xl">
                          <div className="flex items-center justify-between">
                            <span className="text-cyan-300 font-semibold">Total MRR</span>
                            <span className="text-white font-black text-xl">£{stats.mrr.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-4">Recent Audit Activity</h3>
                    <div className="space-y-2">
                      {auditLogs.slice(0, 6).map((log: any) => (
                        <div key={log.id} className="flex items-center space-x-3 p-3 bg-white/3 rounded-xl">
                          <div className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                            <i className="ri-file-list-line text-gray-400 text-xs"></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm">{log.action?.replace(/_/g, ' ')}</p>
                            <p className="text-gray-500 text-xs">{log.user_email || log.user_id?.slice(0, 12)}</p>
                          </div>
                          <span className="text-gray-600 text-xs whitespace-nowrap">{new Date(log.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'companies' && (
                <SACompaniesTab companies={companies} loading={loading} onRefresh={fetchAll} />
              )}

              {activeTab === 'users' && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-white font-semibold">All Platform Users</h3>
                      <p className="text-gray-500 text-sm">{users.length} total users across all companies</p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/5">
                          {['User', 'Email', 'Role', 'Company', 'Status', 'Last Login'].map((h) => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {loading ? (
                          Array.from({ length: 6 }).map((_, i) => (
                            <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-white/5 rounded animate-pulse"></div></td>)}</tr>
                          ))
                        ) : users.length === 0 ? (
                          <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-500">No users found</td></tr>
                        ) : (
                          users.slice(0, 20).map((u: any) => {
                            const company = companies.find((c: any) => c.id === u.company_id);
                            return (
                              <tr key={u.id} className="hover:bg-white/3 transition-colors">
                                <td className="px-4 py-3">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-7 h-7 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 rounded-full flex items-center justify-center flex-shrink-0">
                                      <span className="text-cyan-300 text-xs font-bold">{u.full_name?.[0] || '?'}</span>
                                    </div>
                                    <span className="text-white text-sm">{u.full_name}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-400">{u.email}</td>
                                <td className="px-4 py-3">
                                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs capitalize">{u.role?.replace(/_/g, ' ')}</span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-400">{company?.name || '—'}</td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-0.5 rounded-full text-xs ${u.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-500/20 text-gray-400'}`}>{u.status}</span>
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-500">
                                  {u.last_login ? new Date(u.last_login).toLocaleDateString('en-GB') : 'Never'}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'plans' && <SAPlansTab />}

              {activeTab === 'subscriptions' && (
                <div>
                  <h3 className="text-white font-semibold mb-4">All Subscriptions</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/5">
                          {['Company', 'Plan', 'Status', 'Billing Cycle', 'Price/mo', 'Trial Ends', 'Created'].map((h) => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {loading ? (
                          Array.from({ length: 5 }).map((_, i) => <tr key={i}>{Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-white/5 rounded animate-pulse"></div></td>)}</tr>)
                        ) : subscriptions.length === 0 ? (
                          <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-500">No subscriptions found</td></tr>
                        ) : (
                          subscriptions.map((s: any) => {
                            const company = companies.find((c: any) => c.id === s.company_id);
                            return (
                              <tr key={s.id} className="hover:bg-white/3 transition-colors">
                                <td className="px-4 py-3 text-sm text-white">{company?.name || '—'}</td>
                                <td className="px-4 py-3"><span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs capitalize">{s.plan}</span></td>
                                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs capitalize ${s.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : s.status === 'trial' ? 'bg-amber-500/20 text-amber-300' : 'bg-gray-500/20 text-gray-400'}`}>{s.status}</span></td>
                                <td className="px-4 py-3 text-sm text-gray-400 capitalize">{s.billing_cycle}</td>
                                <td className="px-4 py-3 text-sm text-white">£{s.price_per_month || 0}</td>
                                <td className="px-4 py-3 text-xs text-gray-500">{s.trial_ends_at ? new Date(s.trial_ends_at).toLocaleDateString('en-GB') : '—'}</td>
                                <td className="px-4 py-3 text-xs text-gray-500">{new Date(s.created_at).toLocaleDateString('en-GB')}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'payments' && (
                <div>
                  <h3 className="text-white font-semibold mb-4">Payment History</h3>
                  {payments.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <i className="ri-bank-card-line text-gray-500 text-2xl"></i>
                      </div>
                      <p className="text-gray-400 font-medium">No payments yet</p>
                      <p className="text-gray-600 text-sm mt-1">Payments will appear here once Stripe is connected</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/5">
                            {['Company', 'Amount', 'Status', 'Method', 'Date'].map((h) => (
                              <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {payments.map((p: any) => {
                            const company = companies.find((c: any) => c.id === p.company_id);
                            return (
                              <tr key={p.id} className="hover:bg-white/3">
                                <td className="px-4 py-3 text-sm text-white">{company?.name || '—'}</td>
                                <td className="px-4 py-3 text-sm text-white font-medium">£{p.amount}</td>
                                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${p.status === 'paid' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>{p.status}</span></td>
                                <td className="px-4 py-3 text-sm text-gray-400">{p.payment_method || '—'}</td>
                                <td className="px-4 py-3 text-xs text-gray-500">{new Date(p.created_at).toLocaleDateString('en-GB')}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'support' && (
                <div>
                  <h3 className="text-white font-semibold mb-4">Support Tickets</h3>
                  {tickets.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <i className="ri-customer-service-line text-gray-500 text-2xl"></i>
                      </div>
                      <p className="text-gray-400 font-medium">No support tickets</p>
                      <p className="text-gray-600 text-sm mt-1">All clear — no open tickets</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tickets.map((t: any) => (
                        <div key={t.id} className="p-4 bg-white/3 border border-white/8 rounded-xl flex items-start space-x-4">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${t.priority === 'high' ? 'bg-red-500/20' : t.priority === 'medium' ? 'bg-amber-500/20' : 'bg-gray-500/20'}`}>
                            <i className={`ri-ticket-line text-sm ${t.priority === 'high' ? 'text-red-400' : t.priority === 'medium' ? 'text-amber-400' : 'text-gray-400'}`}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm">{t.subject}</p>
                            <p className="text-gray-400 text-xs mt-0.5">{t.description}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${t.status === 'open' ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-400'}`}>{t.status}</span>
                            <p className="text-gray-600 text-xs mt-1">{new Date(t.created_at).toLocaleDateString('en-GB')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'health' && <SASystemHealth />}

              {activeTab === 'audit' && <SAAuditTab logs={auditLogs} loading={loading} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}