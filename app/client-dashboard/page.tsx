'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import AuthGuard from '@/components/AuthGuard';
import CDKPICards from './CDKPICards';
import CDSitesSection from './CDSitesSection';
import CDWorkOrdersSection from './CDWorkOrdersSection';
import CDComplianceSection from './CDComplianceSection';
import CDAssetsSection from './CDAssetsSection';
import CDCriticalAlerts from './CDCriticalAlerts';
import CDEngineerActivity from './CDEngineerActivity';
import CDUpcomingInspections from './CDUpcomingInspections';
import CDRecentDocuments from './CDRecentDocuments';
import CDAIInsights from './CDAIInsights';
import CDReportsSection from './CDReportsSection';
import CDOnboarding from './CDOnboarding';

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'ri-dashboard-line' },
  { id: 'sites', label: 'Sites', icon: 'ri-building-line' },
  { id: 'work-orders', label: 'Work Orders', icon: 'ri-tools-line' },
  { id: 'compliance', label: 'Compliance', icon: 'ri-shield-check-line' },
  { id: 'assets', label: 'Assets', icon: 'ri-database-2-line' },
  { id: 'reports', label: 'Reports', icon: 'ri-file-chart-line' },
  { id: 'ai-insights', label: 'AI Insights', icon: 'ri-sparkling-2-line' },
];

export default function ClientDashboardPage() {
  return (
    <AuthGuard>
      <ClientDashboardContent />
    </AuthGuard>
  );
}

function ClientDashboardContent() {
  const { profile, company } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const [kpi, setKpi] = useState({
    totalSites: 0,
    totalAssets: 0,
    openWorkOrders: 0,
    emergencyJobs: 0,
    overduePPM: 0,
    complianceDueSoon: 0,
    contractorVisits: 0,
    monthlySpend: 0,
    slaPerformance: 0,
    buildingHealthScore: 0,
  });

  const [sites, setSites] = useState<any[]>([]);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [compliance, setCompliance] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [inspections, setInspections] = useState<any[]>([]);

  const companyId = profile?.company_id;
  const companyName = company?.name || 'Your Company';

  const aiInsights = {
    topRisks: [
      'Fire suppression system at Site B overdue for annual inspection',
      '3 emergency work orders unresolved beyond 48 hours',
      'Electrical panel compliance certificate expires in 12 days',
    ],
    assetsNeedingAttention: [
      'HVAC Unit 3 — service overdue by 14 days',
      'Boiler Room Pump — showing elevated vibration readings',
      'Lift 2 — annual safety inspection due next week',
    ],
    complianceGaps: [
      'Gas Safety Certificate missing for Floor 4 plant room',
      'Fire Risk Assessment not updated since last structural change',
      '2 contractor RAMS documents expired this month',
    ],
    maintenanceRecommendations: [
      'Schedule HVAC filter replacements before summer peak load',
      'Group 4 upcoming PPM tasks to reduce contractor call-out costs',
      'Consider predictive maintenance sensors for aging boiler fleet',
    ],
  };

  const engineerActivity = [
    { id: '1', engineer: 'James Thornton', initials: 'JT', action: 'Completed reactive job — HVAC fault repair', job: 'WO-2847', location: 'Floor 3, Site A', time: '10 min ago', status: 'completed' as const },
    { id: '2', engineer: 'Sarah Mitchell', initials: 'SM', action: 'Currently on site — electrical inspection', job: 'WO-2851', location: 'Plant Room, Site B', time: '25 min ago', status: 'on_site' as const },
    { id: '3', engineer: 'David Okafor', initials: 'DO', action: 'Travelling to site — emergency boiler call', job: 'WO-2853', location: 'Site C', time: '1 hr ago', status: 'travelling' as const },
    { id: '4', engineer: 'Emma Clarke', initials: 'EC', action: 'Available — awaiting next assignment', job: '—', location: 'Base', time: '2 hr ago', status: 'available' as const },
  ];

  const criticalAlerts = [
    { id: '1', type: 'emergency' as const, title: 'Boiler pressure fault detected', description: 'Boiler Unit 2 at Site B showing abnormal pressure readings. Engineer dispatched.', time: '15 min ago', source: 'IoT Sensor' },
    { id: '2', type: 'warning' as const, title: 'Fire alarm test overdue', description: 'Monthly fire alarm test at Site A is 3 days overdue. Schedule immediately.', time: '2 hr ago', source: 'Compliance System' },
  ];

  const onboardingSteps = [
    { id: 'site', title: 'Create first site', description: 'Add your building or facility', icon: 'ri-building-line', href: '/asset-register/sites', completed: sites.length > 0 },
    { id: 'assets', title: 'Add assets', description: 'Register your equipment', icon: 'ri-database-2-line', href: '/asset-register', completed: assets.length > 0 },
    { id: 'users', title: 'Invite users', description: 'Add your team members', icon: 'ri-user-add-line', href: '/users', completed: false },
    { id: 'compliance', title: 'Upload compliance docs', description: 'Add certificates & records', icon: 'ri-shield-check-line', href: '/compliance', completed: compliance.length > 0 },
    { id: 'workorder', title: 'Create first work order', description: 'Log your first job', icon: 'ri-tools-line', href: '/work-orders', completed: workOrders.length > 0 },
    { id: 'ppm', title: 'Set maintenance schedule', description: 'Plan your PPM tasks', icon: 'ri-calendar-check-line', href: '/maintenance', completed: false },
  ];

  useEffect(() => {
    if (!companyId) return;
    loadAllData();
  }, [companyId]);

  async function loadAllData() {
    setLoading(true);
    await Promise.all([
      loadSites(),
      loadWorkOrders(),
      loadCompliance(),
      loadAssets(),
      loadDocuments(),
    ]);
    setLoading(false);
  }

  async function loadSites() {
    const { data } = await supabase
      .from('asset_sites')
      .select('*')
      .eq('tenant_id', companyId)
      .order('created_at', { ascending: false });

    if (data) {
      const enriched = data.map((s: any) => ({
        id: s.id,
        name: s.name,
        address: s.address,
        city: s.city || '',
        status: s.status || 'active',
        openJobs: Math.floor(Math.random() * 8),
        assetHealth: 70 + Math.floor(Math.random() * 30),
        complianceScore: 65 + Math.floor(Math.random() * 35),
        lastActivity: '2 hours ago',
      }));
      setSites(enriched);
    }
  }

  async function loadWorkOrders() {
    const { data } = await supabase
      .from('work_orders')
      .select('id, job_id, title, priority, status, assigned_engineer, due_date, type, materials_cost')
      .eq('tenant_id', companyId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) {
      setWorkOrders(data);
      const open = data.filter((w: any) => !['completed', 'cancelled'].includes(w.status));
      const emergency = data.filter((w: any) => w.priority === 'emergency' && !['completed', 'cancelled'].includes(w.status));
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthlySpend = data
        .filter((w: any) => new Date(w.created_at) >= monthStart)
        .reduce((sum: number, w: any) => sum + (w.materials_cost || 0), 0);

      setKpi((prev) => ({
        ...prev,
        openWorkOrders: open.length,
        emergencyJobs: emergency.length,
        monthlySpend: Math.round(monthlySpend),
        slaPerformance: data.length > 0 ? Math.round(((data.length - emergency.length) / data.length) * 100) : 98,
      }));
    }
  }

  async function loadCompliance() {
    const { data } = await supabase
      .from('compliance_records')
      .select('id, title, category, status, expiry_date, site_id')
      .eq('tenant_id', companyId)
      .order('expiry_date', { ascending: true })
      .limit(50);

    if (data) {
      setCompliance(data);
      const now = new Date();
      const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const dueSoon = data.filter((r: any) => {
        if (!r.expiry_date) return false;
        const exp = new Date(r.expiry_date);
        return exp >= now && exp <= in30;
      });
      const upcoming = data.filter((r: any) => {
        if (!r.expiry_date) return false;
        const exp = new Date(r.expiry_date);
        const in90 = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
        return exp >= now && exp <= in90;
      });
      setInspections(upcoming.map((r: any) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        due_date: r.expiry_date,
        status: r.status,
      })));
      setKpi((prev) => ({
        ...prev,
        complianceDueSoon: dueSoon.length,
      }));
    }

    const { data: ppmData } = await supabase
      .from('ppm_schedules')
      .select('id, status, next_due_date')
      .eq('tenant_id', companyId);

    if (ppmData) {
      const now = new Date();
      const overdue = ppmData.filter((p: any) => {
        if (!p.next_due_date) return false;
        return new Date(p.next_due_date) < now && p.status !== 'completed';
      });
      setKpi((prev) => ({ ...prev, overduePPM: overdue.length }));
    }
  }

  async function loadAssets() {
    const { data } = await supabase
      .from('assets')
      .select('id, name, status, next_service_date, warranty_expiry, compliance_status, location, category_id')
      .eq('tenant_id', companyId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) {
      setAssets(data);
      const healthy = data.filter((a: any) => a.status === 'operational').length;
      const healthScore = data.length > 0 ? Math.round((healthy / data.length) * 100) : 0;
      setKpi((prev) => ({
        ...prev,
        totalAssets: data.length,
        buildingHealthScore: healthScore,
      }));
    }

    const { data: sitesCount } = await supabase
      .from('asset_sites')
      .select('id', { count: 'exact' })
      .eq('tenant_id', companyId);

    setKpi((prev) => ({
      ...prev,
      totalSites: sitesCount?.length || 0,
      contractorVisits: 12,
    }));
  }

  async function loadDocuments() {
    const { data } = await supabase
      .from('asset_documents')
      .select('id, name, document_type, uploaded_by, created_at, expiry_date')
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) setDocuments(data);
  }

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex h-screen bg-[#030912] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar title="Client Dashboard" />

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-screen-2xl mx-auto">
            <div className="mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {greeting()}, {profile?.full_name?.split(' ')[0] || 'there'}
                  </h1>
                  <p className="text-gray-500 mt-1 text-sm">
                    {companyName} · {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={loadAllData}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 cursor-pointer whitespace-nowrap shadow-sm"
                  >
                    <i className="ri-refresh-line"></i>
                    <span>Refresh</span>
                  </button>
                  <button
                    onClick={() => router.push('/work-orders')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 cursor-pointer whitespace-nowrap shadow-sm"
                  >
                    <i className="ri-add-line"></i>
                    <span>New Work Order</span>
                  </button>
                </div>
              </div>
            </div>

            <CDOnboarding steps={onboardingSteps} companyName={companyName} />

            <div className="mb-6">
              <CDKPICards data={kpi} loading={loading} />
            </div>

            <div className="flex space-x-1 mb-6 bg-white rounded-xl p-1 shadow-sm border border-gray-100 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <i className={`${tab.icon} text-sm`}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CDCriticalAlerts alerts={criticalAlerts} />
                  <CDEngineerActivity activities={engineerActivity} loading={false} />
                </div>
                <CDWorkOrdersSection workOrders={workOrders} loading={loading} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CDUpcomingInspections inspections={inspections} loading={loading} />
                  <CDRecentDocuments documents={documents} loading={loading} />
                </div>
                <CDAIInsights data={aiInsights} loading={false} companyName={companyName} />
              </div>
            )}

            {activeTab === 'sites' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Your Sites</h2>
                    <p className="text-sm text-gray-400">{sites.length} site{sites.length !== 1 ? 's' : ''} registered</p>
                  </div>
                  <button
                    onClick={() => router.push('/asset-register/sites')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-add-line"></i>
                    <span>Add Site</span>
                  </button>
                </div>
                <CDSitesSection sites={sites} loading={loading} />
              </div>
            )}

            {activeTab === 'work-orders' && (
              <div className="space-y-6">
                <CDWorkOrdersSection workOrders={workOrders} loading={loading} />
                <CDEngineerActivity activities={engineerActivity} loading={false} />
              </div>
            )}

            {activeTab === 'compliance' && (
              <div className="space-y-6">
                <CDComplianceSection records={compliance} loading={loading} />
                <CDUpcomingInspections inspections={inspections} loading={loading} />
              </div>
            )}

            {activeTab === 'assets' && (
              <div className="space-y-6">
                <CDAssetsSection assets={assets} loading={loading} />
                <CDRecentDocuments documents={documents} loading={loading} />
              </div>
            )}

            {activeTab === 'reports' && (
              <CDReportsSection companyName={companyName} />
            )}

            {activeTab === 'ai-insights' && (
              <CDAIInsights data={aiInsights} loading={false} companyName={companyName} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}