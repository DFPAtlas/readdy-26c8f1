'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

// ... existing code ... (workOrderData, demoWOs, demoAssets, getPriorityColor, getStatusBadge all stay the same)

function DashboardContent() {
  const searchParams = useSearchParams();
  const checkoutSuccess = searchParams.get('checkout') === 'success';
  const checkoutPlan = searchParams.get('plan') || '';

  const { profile, company } = useAuth();
  const [showSuccess, setShowSuccess] = useState(checkoutSuccess);
  const [timeframe, setTimeframe] = useState('Week');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, pmTasks: 8, criticalAssets: 5 });
  const [recentWOs, setRecentWOs] = useState<typeof demoWOs>([]);
  const [criticalAssets, setCriticalAssets] = useState<typeof demoAssets>([]);

  useEffect(() => {
    if (!profile?.company_id) return;
    fetchData();
  }, [profile]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: wos } = await supabase.from('work_orders').select('*').eq('company_id', profile!.company_id).order('created_at', { ascending: false }).limit(5);
      const { data: allWOs } = await supabase.from('work_orders').select('status').eq('company_id', profile!.company_id);
      const { data: assets } = await supabase.from('assets').select('*').eq('company_id', profile!.company_id).in('status', ['Critical', 'Maintenance Required', 'Inspection Due']).limit(5);
      const pending = allWOs?.filter((w) => w.status === 'Pending' || w.status === 'new').length || 0;
      const inProgress = allWOs?.filter((w) => w.status === 'In Progress' || w.status === 'in_progress').length || 0;
      setStats({ total: allWOs?.length || 0, pending, inProgress, pmTasks: 8, criticalAssets: assets?.length || 0 });
      setRecentWOs(wos && wos.length > 0 ? wos : demoWOs);
      setCriticalAssets(assets && assets.length > 0 ? assets : demoAssets);
    } catch {
      setRecentWOs(demoWOs);
      setCriticalAssets(demoAssets);
    } finally {
      setLoading(false);
    }
  };

  const planNames: Record<string, string> = { starter: 'Starter', professional: 'Professional', enterprise: 'Enterprise' };

  return (
    <div className="flex min-h-screen bg-[#030912]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Dashboard" />
        <div className="flex-1 p-6 overflow-auto">

          {showSuccess && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="ri-checkbox-circle-line text-emerald-400 text-lg"></i>
                </div>
                <div>
                  <p className="text-emerald-300 font-semibold">Subscription activated!</p>
                  <p className="text-emerald-400/70 text-sm">
                    {checkoutPlan ? `You're now on the ${planNames[checkoutPlan] || checkoutPlan} plan. ` : ''}
                    Your 14-day free trial has started. Explore everything Synqoro has to offer.
                  </p>
                </div>
              </div>
              <button onClick={() => setShowSuccess(false)} className="text-emerald-400/60 hover:text-emerald-300 cursor-pointer transition-colors">
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">{company?.name} · {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>

          {/* ... rest of the dashboard content stays the same ... */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 rounded-xl p-5 flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">Asset Register</h3>
                <p className="text-cyan-300/70 text-sm mt-1">QR codes, service history, compliance</p>
              </div>
              <Link href="/asset-register" className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg font-semibold text-sm hover:bg-cyan-400 cursor-pointer whitespace-nowrap transition-colors">
                <i className="ri-database-2-line"></i> Open
              </Link>
            </div>
            <div className="bg-gradient-to-r from-emerald-500/20 to-teal-600/20 border border-emerald-500/20 rounded-xl p-5 flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">Compliance & PPM</h3>
                <p className="text-emerald-300/70 text-sm mt-1">Certificates, inspections, planned maintenance</p>
              </div>
              <Link href="/compliance" className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold text-sm hover:bg-emerald-400 cursor-pointer whitespace-nowrap transition-colors">
                <i className="ri-shield-check-line"></i> Open
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-violet-500/20 to-indigo-600/20 border border-violet-500/20 rounded-xl p-5 flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">Digital Twin</h3>
                <p className="text-violet-300/70 text-sm mt-1">Interactive live building maps</p>
              </div>
              <Link href="/digital-twin" className="flex items-center gap-2 px-4 py-2 bg-violet-500 text-white rounded-lg font-semibold text-sm hover:bg-violet-400 cursor-pointer whitespace-nowrap transition-colors">
                <i className="ri-building-3-line"></i> Open
              </Link>
            </div>
            <div className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 border border-pink-500/20 rounded-xl p-5 flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">AI Intelligence Hub</h3>
                <p className="text-pink-300/70 text-sm mt-1">AI insights, fault diagnosis, scheduling</p>
              </div>
              <Link href="/ai-dashboard" className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg font-semibold text-sm hover:bg-pink-400 cursor-pointer whitespace-nowrap transition-colors">
                <i className="ri-sparkling-2-line"></i> Open
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <i className="ri-loader-4-line text-3xl text-cyan-500 animate-spin"></i>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { icon: 'ri-tools-line', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', label: 'Work Orders', value: stats.total, sub: `${stats.pending} pending, ${stats.inProgress} in progress` },
                  { icon: 'ri-calendar-check-line', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'PM Tasks', value: stats.pmTasks, sub: 'Due this week' },
                  { icon: 'ri-alert-line', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', label: 'Critical Assets', value: stats.criticalAssets, sub: 'Requiring attention' },
                  { icon: 'ri-shield-check-line', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20', label: 'Compliance', value: 94, sub: '% health score' },
                ].map((s) => (
                  <div key={s.label} className={`border rounded-xl p-5 ${s.bg}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <i className={`${s.icon} ${s.color}`}></i>
                      </div>
                      <span className={`text-sm ${s.color}`}>{s.label}</span>
                    </div>
                    <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-xs text-gray-500 mt-1">{s.sub}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-white/3 border border-white/8 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Work Order Trends</h3>
                    <div className="flex bg-white/5 border border-white/10 rounded-lg p-1">
                      {['Day', 'Week', 'Month'].map((p) => (
                        <button key={p} onClick={() => setTimeframe(p)} className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer whitespace-nowrap transition-all ${timeframe === p ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>{p}</button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-end justify-between h-32 space-x-1.5">
                    {workOrderData.map((item) => (
                      <div key={item.day} className="flex-1 flex flex-col items-center group">
                        <div
                          className="w-full bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t opacity-80 group-hover:opacity-100 transition-opacity"
                          style={{ height: `${(item.value / 50) * 100}%` }}
                        ></div>
                        <span className="text-xs text-gray-600 mt-1.5">{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/3 border border-white/8 rounded-xl p-6">
                  <h3 className="font-semibold text-white mb-4">Maintenance Types</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Preventive', pct: 44, color: 'from-cyan-500 to-blue-500' },
                      { label: 'Corrective', pct: 29, color: 'from-amber-500 to-orange-500' },
                      { label: 'Emergency', pct: 15, color: 'from-red-500 to-rose-500' },
                      { label: 'Inspection', pct: 12, color: 'from-emerald-500 to-teal-500' },
                    ].map((t) => (
                      <div key={t.label}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-gray-400">{t.label}</span>
                          <span className="font-medium text-white">{t.pct}%</span>
                        </div>
                        <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                          <div className={`h-1.5 bg-gradient-to-r ${t.color} rounded-full`} style={{ width: `${t.pct}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/3 border border-white/8 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-semibold text-white">Recent Work Orders</h3>
                    <Link href="/work-orders" className="text-cyan-400 text-sm hover:text-cyan-300 cursor-pointer">View All</Link>
                  </div>
                  <div className="divide-y divide-white/5">
                    {recentWOs.slice(0, 5).map((wo) => (
                      <div key={wo.id} className="px-4 py-3 flex items-center justify-between hover:bg-white/3 transition-colors">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white truncate">{wo.title}</p>
                          <p className={`text-xs font-medium mt-0.5 ${getPriorityColor(wo.priority)}`}>● {wo.priority}</p>
                        </div>
                        <span className={`ml-3 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusBadge(wo.status)}`}>{wo.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/3 border border-white/8 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-semibold text-white">Critical Assets</h3>
                    <Link href="/asset-register" className="text-cyan-400 text-sm hover:text-cyan-300 cursor-pointer">View All</Link>
                  </div>
                  <div className="divide-y divide-white/5">
                    {criticalAssets.slice(0, 5).map((a) => (
                      <div key={a.id} className="px-4 py-3 flex items-center justify-between hover:bg-white/3 transition-colors">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white truncate">{a.name}</p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{a.location}</p>
                        </div>
                        <span className={`ml-3 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusBadge(a.status)}`}>{a.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <Suspense fallback={
        <div className="flex min-h-screen bg-[#030912] items-center justify-center">
          <i className="ri-loader-4-line animate-spin text-cyan-400 text-3xl"></i>
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </AuthGuard>
  );
}