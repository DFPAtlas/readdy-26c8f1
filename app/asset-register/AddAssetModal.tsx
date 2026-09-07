'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Props {
  sites: { id: number; name: string }[];
  categories: { id: number; name: string }[];
  companyId: string;
  onClose: () => void;
  onCreated: () => void;
}

export default function AddAssetModal({ sites, categories, companyId, onClose, onCreated }: Props) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', asset_id: '', category_id: '', site_id: '', manufacturer: '',
    model: '', serial_number: '', location: '', floor_level: '',
    install_date: '', warranty_expiry: '', service_interval_days: '365',
    last_service_date: '', next_service_date: '', status: 'Operational',
    compliance_status: 'Compliant', notes: ''
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        tenant_id: 'default',
        company_id: companyId,
        name: form.name,
        asset_id: form.asset_id || undefined,
        category_id: form.category_id ? Number(form.category_id) : null,
        site_id: form.site_id ? Number(form.site_id) : null,
        manufacturer: form.manufacturer || null,
        model: form.model || null,
        serial_number: form.serial_number || null,
        location: form.location || null,
        floor_level: form.floor_level || null,
        install_date: form.install_date || null,
        warranty_expiry: form.warranty_expiry || null,
        service_interval_days: Number(form.service_interval_days),
        last_service_date: form.last_service_date || null,
        next_service_date: form.next_service_date || null,
        status: form.status,
        compliance_status: form.compliance_status,
        notes: form.notes || null,
      };
      await supabase.from('assets').insert(payload);
      onCreated();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Add New Asset</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer rounded-lg hover:bg-gray-100">
            <i className="ri-close-line"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name *</label>
              <input required value={form.name} onChange={e => set('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="e.g. Central HVAC Unit A-201" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asset ID</label>
              <input value={form.asset_id} onChange={e => set('asset_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="e.g. AST-00031" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category_id} onChange={e => set('category_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 pr-8">
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site</label>
              <select value={form.site_id} onChange={e => set('site_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 pr-8">
                <option value="">Select site</option>
                {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input value={form.location} onChange={e => set('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="e.g. Mechanical Room" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Floor / Level</label>
              <input value={form.floor_level} onChange={e => set('floor_level', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="e.g. Basement" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
              <input value={form.manufacturer} onChange={e => set('manufacturer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="e.g. Carrier" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <input value={form.model} onChange={e => set('model', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="e.g. AquaForce 30XW" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
              <input value={form.serial_number} onChange={e => set('serial_number', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Install Date</label>
              <input type="date" value={form.install_date} onChange={e => set('install_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warranty Expiry</label>
              <input type="date" value={form.warranty_expiry} onChange={e => set('warranty_expiry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Interval (days)</label>
              <input type="number" value={form.service_interval_days} onChange={e => set('service_interval_days', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Service Date</label>
              <input type="date" value={form.last_service_date} onChange={e => set('last_service_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Next Service Date</label>
              <input type="date" value={form.next_service_date} onChange={e => set('next_service_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 pr-8">
                <option>Operational</option>
                <option>Maintenance Required</option>
                <option>Inspection Due</option>
                <option>Critical</option>
                <option>Out of Service</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compliance Status</label>
              <select value={form.compliance_status} onChange={e => set('compliance_status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 pr-8">
                <option>Compliant</option>
                <option>Due for Review</option>
                <option>Non-Compliant</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
                maxLength={500}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50">
              {saving ? 'Saving...' : 'Add Asset'}
            </button>
            <button type="button" onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}