'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import UsageBar from '@/components/UsageBar';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthContext';
import { checkSiteLimit } from '@/lib/subscription-limits';

interface Site {
  id: number;
  name: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
  site_manager: string;
  phone: string;
  email: string;
  status: string;
  created_at: string;
  asset_count?: number;
}

export default function SitesPage() {
  const { limits, refreshLimits } = useAuth();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [limitBlocked, setLimitBlocked] = useState<{ message: string; upgradeUrl: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', city: '', postcode: '', country: 'UK', site_manager: '', phone: '', email: '', status: 'active' });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const siteCheck = limits ? checkSiteLimit(limits) : null;

  const fetchSites = async () => {
    setLoading(true);
    const { data: sitesData } = await supabase.from('asset_sites').select('*').eq('tenant_id', 'default').order('name');
    const { data: assets } = await supabase.from('assets').select('site_id').eq('tenant_id', 'default');
    const countMap: Record<number, number> = {};
    assets?.forEach(a => { if (a.site_id) countMap[a.site_id] = (countMap[a.site_id] || 0) + 1; });
    setSites((sitesData || []).map(s => ({ ...s, asset_count: countMap[s.id] || 0 })));
    setLoading(false);
  };

  useEffect(() => { fetchSites(); }, []);

  const handleAddClick = () => {
    if (siteCheck && !siteCheck.allowed) {
      setLimitBlocked(siteCheck);
      setTimeout(() => setLimitBlocked(null), 4000);
      return;
    }
    setShowAdd(true);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('asset_sites').insert({ ...form, tenant_id: 'default' });
    setSaving(false);
    setShowAdd(false);
    setForm({ name: '', address: '', city: '', postcode: '', country: 'UK', site_manager: '', phone: '', email: '', status: 'active' });
    fetchSites();
    refreshLimits();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/asset-register" className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
              <i className="ri-arrow-left-line"></i>
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Sites & Buildings</h1>
              <p className="text-sm text-gray-500 mt-0.5">Manage your client sites and buildings</p>
            </div>
            <button onClick={handleAddClick}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer whitespace-nowrap transition-colors">
              <i className="ri-add-line"></i> Add Site
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <i className="ri-loader-4-line text-4xl text-blue-500 animate-spin"></i>
            </div>
          ) : (
            <div className="space-y-6">
              {limits && siteCheck && (
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-dashboard-3-line text-gray-500"></i>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Sites Usage</span>
                    <span className="ml-auto text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium capitalize">{limits.plan}</span>
                  </div>
                  <div className="max-w-sm">
                    <UsageBar label="Sites" check={siteCheck} icon="ri-building-2-line" />
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {sites.map(site => (
                  <div key={site.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-xl">
                          <i className="ri-building-2-line text-blue-600 text-lg"></i>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{site.name}</h3>
                          <p className="text-xs text-gray-400">{site.city}, {site.country}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${site.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {site.status}
                        </span>
                        <div className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          {site.asset_count} assets
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-xs text-gray-400 block">Address</span>
                        <span className="text-gray-700">{site.address}, {site.postcode}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 block">Site Manager</span>
                        <span className="text-gray-700">{site.site_manager || '—'}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 block">Phone</span>
                        <span className="text-gray-700">{site.phone || '—'}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 block">Email</span>
                        <span className="text-gray-700 truncate block">{site.email || '—'}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50">
                      <Link href={`/asset-register?site=${site.id}`}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
                        View {site.asset_count} assets →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Add New Site</h2>
              <button onClick={() => setShowAdd(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer rounded-lg hover:bg-gray-100">
                <i className="ri-close-line"></i>
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Name *</label>
                <input required value={form.name} onChange={e => set('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="e.g. Headquarters - Tower A" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input value={form.address} onChange={e => set('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input value={form.city} onChange={e => set('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
                  <input value={form.postcode} onChange={e => set('postcode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Manager</label>
                  <input value={form.site_manager} onChange={e => set('site_manager', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input value={form.phone} onChange={e => set('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 cursor-pointer whitespace-nowrap disabled:opacity-50">
                  {saving ? 'Saving...' : 'Add Site'}
                </button>
                <button type="button" onClick={() => setShowAdd(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 cursor-pointer whitespace-nowrap">
                  Cancel
                </button>
              </div>
            </form>
          </div>
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
    </div>
  );
}