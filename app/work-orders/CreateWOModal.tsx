'use client';

import { useState } from 'react';

const ENGINEERS = ['Mike Johnson', 'Sarah Chen', 'Tom Wilson', 'Alex Davis', 'Emma Roberts', 'James Lee'];

export default function CreateWOModal({ onClose, onSave }: { onClose: () => void; onSave: (data: any) => void }) {
  const [form, setForm] = useState({
    title: '', description: '', type: 'reactive', priority: 'medium',
    status: 'new', assigned_engineer: '', due_date: '',
    client_name: '', client_email: '', sla_hours: '',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const jobId = `WO-${now.getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;
    onSave({ ...form, job_id: jobId, tenant_id: 'demo', created_by: 'admin' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Create Work Order</h2>
            <p className="text-sm text-gray-500 mt-0.5">Fill in the job details below</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
            <i className="ri-close-line"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. HVAC Unit Fault - Building A" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Describe the issue or task..." maxLength={500} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Type</label>
              <div className="grid grid-cols-2 gap-2">
                {['reactive','planned','inspection','emergency'].map(t => (
                  <button key={t} type="button" onClick={() => set('type', t)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border cursor-pointer capitalize transition-colors ${form.type === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { k: 'low', color: 'bg-gray-500' }, { k: 'medium', color: 'bg-blue-500' },
                  { k: 'high', color: 'bg-orange-500' }, { k: 'emergency', color: 'bg-red-500' }
                ].map(({ k, color }) => (
                  <button key={k} type="button" onClick={() => set('priority', k)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border cursor-pointer capitalize transition-colors flex items-center gap-1.5 ${form.priority === k ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                    <span className={`w-2 h-2 rounded-full ${form.priority === k ? 'bg-white' : color}`}></span>
                    {k}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Assign Engineer</label>
              <div className="relative">
                <select value={form.assigned_engineer} onChange={e => set('assigned_engineer', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 pr-8 appearance-none bg-white">
                  <option value="">Unassigned</option>
                  {ENGINEERS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Due Date</label>
              <input type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Client Name</label>
              <input value={form.client_name} onChange={e => set('client_name', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="Company or contact name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Client Email</label>
              <input type="email" value={form.client_email} onChange={e => set('client_email', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="client@company.com" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap">
              Create Work Order
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}