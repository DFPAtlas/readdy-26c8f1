'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabase';
import { AssetStatusBadge, ComplianceBadge } from '../AssetStatusBadge';
import AssetQRCode from './AssetQRCode';
import ServiceHistoryTab from './ServiceHistoryTab';
import DocumentsTab from './DocumentsTab';

function fmt(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function daysUntil(d: string | null) {
  if (!d) return null;
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
}

export default function AssetDetailClient({ id }: { id: string }) {
  const [asset, setAsset] = useState<any>(null);
  const [serviceHistory, setServiceHistory] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editNotes, setEditNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchAsset = async () => {
    const { data } = await supabase
      .from('assets')
      .select('*, asset_categories(name, icon, color), asset_sites(name, address, city)')
      .eq('id', id)
      .maybeSingle();
    setAsset(data);
    setNotes(data?.notes || '');
  };

  const fetchHistory = async () => {
    const { data } = await supabase
      .from('asset_service_history')
      .select('*')
      .eq('asset_id', id)
      .order('service_date', { ascending: false });
    setServiceHistory(data || []);
  };

  const fetchDocs = async () => {
    const { data } = await supabase
      .from('asset_documents')
      .select('*')
      .eq('asset_id', id)
      .order('created_at', { ascending: false });
    setDocuments(data || []);
  };

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchAsset(), fetchHistory(), fetchDocs()]);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, [id]);

  const saveNotes = async () => {
    setSavingNotes(true);
    await supabase.from('assets').update({ notes }).eq('id', id);
    setSavingNotes(false);
    setEditNotes(false);
    setAsset((prev: any) => ({ ...prev, notes }));
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'ri-information-line' },
    { id: 'service', label: 'Service History', icon: 'ri-history-line' },
    { id: 'documents', label: 'Documents', icon: 'ri-file-list-3-line' },
    { id: 'notes', label: 'Engineer Notes', icon: 'ri-sticky-note-line' },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <i className="ri-loader-4-line text-4xl text-blue-500 animate-spin"></i>
            <p className="mt-4 text-gray-500">Loading asset...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <i className="ri-error-warning-line text-4xl text-gray-400"></i>
            <p className="mt-4 text-gray-500">Asset not found</p>
            <Link href="/asset-register" className="mt-4 inline-block text-blue-600 hover:underline text-sm">Back to Asset Register</Link>
          </div>
        </div>
      </div>
    );
  }

  const warrantyDays = daysUntil(asset.warranty_expiry);
  const serviceDays = daysUntil(asset.next_service_date);
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

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
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-gray-900">{asset.name}</h1>
                <AssetStatusBadge status={asset.status} />
                <ComplianceBadge status={asset.compliance_status} />
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{asset.asset_id} · {asset.asset_categories?.name} · {asset.asset_sites?.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex border-b border-gray-100">
                  {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium cursor-pointer whitespace-nowrap transition-colors border-b-2 -mb-px ${
                        activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}>
                      <i className={tab.icon}></i>
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="p-6">
                  {activeTab === 'overview' && (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      {[
                        { label: 'Asset ID', value: asset.asset_id },
                        { label: 'Category', value: asset.asset_categories?.name },
                        { label: 'Manufacturer', value: asset.manufacturer },
                        { label: 'Model', value: asset.model },
                        { label: 'Serial Number', value: asset.serial_number },
                        { label: 'Site', value: asset.asset_sites?.name },
                        { label: 'Location', value: asset.location },
                        { label: 'Floor / Level', value: asset.floor_level },
                        { label: 'Install Date', value: fmt(asset.install_date) },
                        { label: 'Warranty Expiry', value: fmt(asset.warranty_expiry) },
                        { label: 'Service Interval', value: asset.service_interval_days ? `${asset.service_interval_days} days` : '—' },
                        { label: 'Last Service', value: fmt(asset.last_service_date) },
                        { label: 'Next Service', value: fmt(asset.next_service_date) },
                        { label: 'Status', value: asset.status },
                        { label: 'Compliance', value: asset.compliance_status },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{label}</div>
                          <div className="text-sm text-gray-800 font-medium">{value || '—'}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === 'service' && (
                    <ServiceHistoryTab assetId={asset.id} records={serviceHistory} onRefresh={fetchHistory} />
                  )}
                  {activeTab === 'documents' && (
                    <DocumentsTab assetId={asset.id} documents={documents} onRefresh={fetchDocs} />
                  )}
                  {activeTab === 'notes' && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-700">Engineer Notes</h3>
                        {!editNotes && (
                          <button onClick={() => setEditNotes(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 cursor-pointer whitespace-nowrap">
                            <i className="ri-edit-line"></i> Edit
                          </button>
                        )}
                      </div>
                      {editNotes ? (
                        <div>
                          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={8} maxLength={500}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 resize-none" />
                          <div className="flex gap-2 mt-3">
                            <button onClick={saveNotes} disabled={savingNotes}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap disabled:opacity-50">
                              {savingNotes ? 'Saving...' : 'Save Notes'}
                            </button>
                            <button onClick={() => { setEditNotes(false); setNotes(asset.notes || ''); }}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-xl p-4 min-h-32">
                          {notes ? (
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{notes}</p>
                          ) : (
                            <p className="text-sm text-gray-400 italic">No engineer notes yet. Click Edit to add notes.</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <AssetQRCode assetId={asset.asset_id || String(asset.id)} assetName={asset.name} url={pageUrl} />

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">Key Dates</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Next Service</span>
                    <span className={`text-xs font-semibold ${serviceDays !== null && serviceDays < 0 ? 'text-red-600' : serviceDays !== null && serviceDays <= 30 ? 'text-yellow-600' : 'text-gray-700'}`}>
                      {fmt(asset.next_service_date)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Warranty Expiry</span>
                    <span className={`text-xs font-semibold ${warrantyDays !== null && warrantyDays < 0 ? 'text-red-600' : warrantyDays !== null && warrantyDays <= 90 ? 'text-yellow-600' : 'text-gray-700'}`}>
                      {fmt(asset.warranty_expiry)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Install Date</span>
                    <span className="text-xs font-semibold text-gray-700">{fmt(asset.install_date)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">Summary</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Service Records</span>
                    <span className="text-xs font-bold text-gray-800">{serviceHistory.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Documents</span>
                    <span className="text-xs font-bold text-gray-800">{documents.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Total Service Cost</span>
                    <span className="text-xs font-bold text-gray-800">
                      £{serviceHistory.reduce((s, r) => s + (Number(r.cost) || 0), 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}