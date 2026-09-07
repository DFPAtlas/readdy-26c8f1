'use client';

import { useState } from 'react';
import { ComplianceStatusBadge, CategoryBadge, getDaysUntilExpiry } from './ComplianceStatusBadge';
import { supabase } from '@/lib/supabase';

const STATUSES = ['compliant', 'due_soon', 'overdue', 'failed'];

export default function ComplianceDetailModal({ record, onClose, onUpdate }: { record: any; onClose: () => void; onUpdate: (r: any) => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...record });
  const [saving, setSaving] = useState(false);

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
  const days = getDaysUntilExpiry(record.expiry_date);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('compliance_records').update(form).eq('id', record.id);
      if (!error) onUpdate(form);
    } catch {}
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CategoryBadge category={record.category} />
              <ComplianceStatusBadge status={form.status} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">{record.title}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
            <i className="ri-close-line"></i>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {(record.status === 'overdue' || record.status === 'failed') && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <i className="ri-alarm-warning-line text-red-500 text-lg mt-0.5"></i>
              <div>
                <p className="text-sm font-semibold text-red-700">Action Required</p>
                <p className="text-xs text-red-600 mt-0.5">
                  {record.status === 'overdue' ? `This item expired ${Math.abs(days)} days ago. Immediate action required.` : 'This compliance item has failed. Review and remediate urgently.'}
                </p>
              </div>
            </div>
          )}

          {editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                  <div className="relative">
                    <select value={form.status} onChange={e => setForm((f: any) => ({ ...f, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 appearance-none pr-8 bg-white">
                      {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                    <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Contractor</label>
                  <input value={form.contractor_name || ''} onChange={e => setForm((f: any) => ({ ...f, contractor_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Inspection Date</label>
                  <input type="date" value={form.inspection_date || ''} onChange={e => setForm((f: any) => ({ ...f, inspection_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Expiry Date</label>
                  <input type="date" value={form.expiry_date || ''} onChange={e => setForm((f: any) => ({ ...f, expiry_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Next Inspection</label>
                  <input type="date" value={form.next_inspection_date || ''} onChange={e => setForm((f: any) => ({ ...f, next_inspection_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Reminder (days before)</label>
                  <input type="number" value={form.reminder_days || 30} onChange={e => setForm((f: any) => ({ ...f, reminder_days: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
                <textarea value={form.notes || ''} onChange={e => setForm((f: any) => ({ ...f, notes: e.target.value }))} rows={3} maxLength={500}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer disabled:opacity-50 whitespace-nowrap">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => setEditing(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 cursor-pointer whitespace-nowrap">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Last Inspection', value: formatDate(record.inspection_date) },
                  { label: 'Expiry Date', value: formatDate(record.expiry_date) },
                  { label: 'Next Inspection', value: formatDate(record.next_inspection_date) },
                  { label: 'Contractor', value: record.contractor_name || '—' },
                  { label: 'Reminder', value: record.reminder_days ? `${record.reminder_days} days before` : '—' },
                  { label: 'Days Until Expiry', value: days < 0 ? `${Math.abs(days)} days overdue` : `${days} days` },
                ].map(row => (
                  <div key={row.label} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-0.5">{row.label}</p>
                    <p className="text-sm font-medium text-gray-800">{row.value}</p>
                  </div>
                ))}
              </div>
              {record.notes && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-xs font-medium text-blue-600 mb-1">Notes</p>
                  <p className="text-sm text-gray-700">{record.notes}</p>
                </div>
              )}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-medium text-gray-500 mb-2">Certificates & Documents</p>
                <div className="bg-gray-50 rounded-lg p-4 border border-dashed border-gray-200 text-center">
                  <i className="ri-file-upload-line text-2xl text-gray-300 block mb-1"></i>
                  <p className="text-xs text-gray-400">Upload certificates and compliance documents</p>
                  <button className="mt-2 text-xs text-blue-600 hover:text-blue-700 cursor-pointer font-medium">Upload Document</button>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setEditing(true)} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 cursor-pointer whitespace-nowrap">
                  <i className="ri-edit-line mr-1.5"></i>Edit Record
                </button>
                <button className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 cursor-pointer whitespace-nowrap">
                  <i className="ri-download-line mr-1.5"></i>Download Report
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}