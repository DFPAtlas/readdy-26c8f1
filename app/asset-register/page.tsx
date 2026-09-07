'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import AuthGuard from '@/components/AuthGuard';
import UsageBar from '@/components/UsageBar';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthContext';
import { checkAssetLimit, checkSiteLimit } from '@/lib/subscription-limits';
import AssetDashboardWidgets from './AssetDashboardWidgets';
import AssetFilters from './AssetFilters';
import AssetTable from './AssetTable';
import AddAssetModal from './AddAssetModal';

export default function AssetRegisterPage() {
  const { limits, refreshLimits, company } = useAuth();
  const [assets, setAssets] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [limitBlocked, setLimitBlocked] = useState<{ message: string; upgradeUrl: string } | null>(null);
  const [search, setSearch] = useState('');
  const [siteFilter, setSiteFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [complianceFilter, setComplianceFilter] = useState('');
  const [warrantyFilter, setWarrantyFilter] = useState('');

  const assetCheck = limits ? checkAssetLimit(limits) : null;
  const siteCheck = limits ? checkSiteLimit(limits) : null;

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: a }, { data: s }, { data: c }] = await Promise.all([
      supabase.from('assets').select('*, asset_categories(name, icon, color), asset_sites(name)').eq('tenant_id', 'default').order('created_at', { ascending: false }),
      supabase.from('asset_sites').select('id, name').eq('tenant_id', 'default').order('name'),
      supabase.from('asset_categories').select('id, name').order('sort_order'),
    ]);
    setAssets(a || []);
    setSites(s || []);
    setCategories(c || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleAddClick = () => {
    if (assetCheck && !assetCheck.allowed) {
      setLimitBlocked(assetCheck);
      setTimeout(() => setLimitBlocked(null), 4000);
      return;
    }
    setShowAdd(true);
  };

  const handleCreated = () => { setShowAdd(false); fetchAll(); refreshLimits(); };

  const filtered = useMemo(() => {
    const now = Date.now();
    return assets.filter(a => {
      if (search && !a.name.toLowerCase().includes(search.toLowerCase()) &&
        !a.asset_id?.toLowerCase().includes(search.toLowerCase()) &&
        !a.manufacturer?.toLowerCase().includes(search.toLowerCase())) return false;
      if (siteFilter && String(a.site_id) !== siteFilter) return false;
      if (categoryFilter && String(a.category_id) !== categoryFilter) return false;
      if (statusFilter && a.status !== statusFilter) return false;
      if (complianceFilter && a.compliance_status !== complianceFilter) return false;
      if (warrantyFilter) {
        const exp = a.warranty_expiry ? new Date(a.warranty_expiry).getTime() : null;
        if (warrantyFilter === 'expired') {
          if (!exp || exp >= now) return false;
        } else {
          const days = Number(warrantyFilter);
          if (!exp || exp < now || (exp - now) > days * 86400000) return false;
        }
      }
      return true;
    });
  }, [assets, search, siteFilter, categoryFilter, statusFilter, complianceFilter, warrantyFilter]);

  const widgets = useMemo(() => {
    const now = Date.now();
    const in90 = now + 90 * 86400000;
    const overdueServices = assets.filter(a => a.next_service_date && new Date(a.next_service_date).getTime() < now).length;
    const expiringWarranties = assets.filter(a => a.warranty_expiry && new Date(a.warranty_expiry).getTime() > now && new Date(a.warranty_expiry).getTime() < in90).length;
    const failedAssets = assets.filter(a => a.status === 'Critical' || a.status === 'Out of Service').length;
    const siteMap: Record<string, number> = {};
    assets.forEach(a => {
      const sn = a.asset_sites?.name || 'Unknown';
      siteMap[sn] = (siteMap[sn] || 0) + 1;
    });
    const assetsBySite = Object.entries(siteMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
    return { overdueServices, expiringWarranties, failedAssets, assetsBySite };
  }, [assets]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this asset? This cannot be undone.')) return;
    await supabase.from('assets').delete().eq('id', id);
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AuthGuard>
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <TopBar title="Asset Register" />
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Asset Register</h1>
              <p className="text-sm text-gray-500 mt-1">Full FM asset management across all sites</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/asset-register/sites"
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors">
                <i className="ri-building-2-line"></i>
                Manage Sites
              </Link>
              <button onClick={handleAddClick}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer whitespace-nowrap transition-colors">
                <i className="ri-add-line"></i>
                Add Asset
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <i className="ri-loader-4-line text-4xl text-blue-500 animate-spin"></i>
                <p className="mt-4 text-gray-500">Loading asset register...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {limits && (
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-dashboard-3-line text-gray-500"></i>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Plan Usage</span>
                    <span className="ml-auto text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium capitalize">{limits.plan}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    {assetCheck && <UsageBar label="Assets" check={assetCheck} icon="ri-database-2-line" />}
                    <UsageBar label="Users" check={limits ? { allowed: limits.currentUsers < limits.maxUsers, current: limits.currentUsers, max: limits.maxUsers, percentage: limits.maxUsers > 0 ? Math.round((limits.currentUsers / limits.maxUsers) * 100) : 0, message: '' } : { allowed: true, current: 0, max: 0, percentage: 0, message: '' }} icon="ri-team-line" />
                    {siteCheck && <UsageBar label="Sites" check={siteCheck} icon="ri-building-2-line" />}
                  </div>
                </div>
              )}
              <AssetDashboardWidgets
                totalAssets={assets.length}
                overdueServices={widgets.overdueServices}
                expiringWarranties={widgets.expiringWarranties}
                failedAssets={widgets.failedAssets}
                assetsBySite={widgets.assetsBySite}
              />
              <AssetFilters
                search={search} onSearch={setSearch}
                siteFilter={siteFilter} onSiteFilter={setSiteFilter}
                categoryFilter={categoryFilter} onCategoryFilter={setCategoryFilter}
                statusFilter={statusFilter} onStatusFilter={setStatusFilter}
                complianceFilter={complianceFilter} onComplianceFilter={setComplianceFilter}
                warrantyFilter={warrantyFilter} onWarrantyFilter={setWarrantyFilter}
                sites={sites} categories={categories}
              />
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{filtered.length} of {assets.length} assets</p>
              </div>
              <AssetTable assets={filtered} onDelete={handleDelete} />
            </div>
          )}
        </div>
      </div>
      {showAdd && (
        <AddAssetModal
          sites={sites}
          categories={categories}
          companyId={company?.id || ''}
          onClose={() => setShowAdd(false)}
          onCreated={handleCreated}
        />
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
    </div>
    </AuthGuard>
  );
}