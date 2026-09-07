'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ServiceRecord {
  id: number;
  service_type: string;
  description: string;
  performed_by: string;
  company: string;
  service_date: string;
  next_service_date: string;
  cost: number;
  status: string;
  notes: string;
}

interface Props {
  assetId: number;
  records: ServiceRecord[];
  onRefresh: () => void;
}

function fmt(d: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ServiceHistoryTab({ assetId, records, onRefresh }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    service_type: 'Preventive Maintenance', description: '', performed_by: '',
    company: '', service_date: '', next_service_date: '', cost: '', status: 'Completed', notes: ''
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('asset_service_history').insert({
      asset_id: assetId,
      service_type: form.service_type,
      description: form.description,
      performed_by: form.performed_by || null,
      company: form.company || null,
      service_date: form.service_date,
      next_service_date: form.next_service_date || null,
      cost: form.cost ? Number(form.cost) : null,
      status: form.status,
      notes: form.notes || null,
    });
    setSaving(false);
    setShowForm(false);
    setForm({ service_type: 'Preventive Maintenance', description: '', performed_by: '', company: '', service_date: '', next_service_date: '', cost: '', status: 'Completed', notes: '' });
    onRefresh();
  };

  const typeColor: Record<string, string> = {
    'Preventive Maintenance': 'bg-blue-100 text-blue-700',
    'Corrective Maintenance': 'bg-orange-100 text-orange-700',
    'Emergency Repair': 'bg-red-100 text-red-700',
    'Annual Service': 'bg-green-100 text-green-700',
    'LOLER Inspection': 'bg-purple-100 text-purple-700',
    'Bi-Annual Inspection': 'bg-teal-100 text-teal-700',
    'Battery Inspection': 'bg-yellow-100 text-yellow-700',
    'Quarterly Service': 'bg-indigo-100 text-indigo-700',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Service History ({records.length})</h3>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 cursor-pointer whitespace-nowrap">
          <i className="ri-add-line"></i> Log Service
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Service Type</label>
              <select value={form.service_type} onChange={e => set('service_type', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm bg-white pr-8">
                {['Preventive Maintenance','Corrective Maintenance','Emergency Repair','Annual Service','LOLER Inspection','Bi-Annual Inspection','Battery Inspection','Quarterly Service'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Service Date *</label>
              <input required type="date" value={form.service_date} onChange={e => set('service_date', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm bg-white" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Description *</label>
              <input required value={form.description} onChange={e => set('description', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm bg-white" placeholder="What was done?" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Performed By</label>
              <input value={form.performed_by} onChange={e => set('performed_by', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Company</label>
              <input value={form.company} onChange={e => set('company', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Next Service Date</label>
              <input type="date" value={form.next_service_date} onChange={e => set('next_service_date', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Cost (£)</label>
              <input type="number" value={form.cost} onChange={e => set('cost', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm bg-white" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving}
              className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Record'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-4 py-1.5 bg-white text-gray-600 border border-gray-200 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap">
              Cancel
            </button>
          </div>
        </form>
      )}

      {records.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <i className="ri-history-line text-3xl mb-2 block"></i>
          <p className="text-sm">No service records yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map(r => (
            <div key={r.id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColor[r.service_type] || 'bg-gray-100 text-gray-600'}`}>{r.service_type}</span>
                    <span className="text-xs text-gray-400">{fmt(r.service_date)}</span>
                  </div>
                  <p className="text-sm text-gray-800 font-medium">{r.description}</p>
                  {r.performed_by && <p className="text-xs text-gray-500 mt-1">By: {r.performed_by}{r.company ? ` · ${r.company}` : ''}</p>}
                  {r.notes && <p className="text-xs text-gray-400 mt-1 italic">{r.notes}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  {r.cost && <div className="text-sm font-semibold text-gray-800">£{Number(r.cost).toLocaleString()}</div>}
                  {r.next_service_date && <div className="text-xs text-gray-400 mt-1">Next: {fmt(r.next_service_date)}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}