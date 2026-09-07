'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const DEMO_TIMESHEETS = [
  { id: 1, engineer_name: 'Mike Johnson', clock_in: '2026-05-09T09:00:00Z', clock_out: '2026-05-09T12:30:00Z', hours_worked: 3.5, travel_time: 0.5, notes: 'Initial inspection and diagnosis' },
];

export default function WOTimesheetTab({ workOrderId }: { workOrderId: number }) {
  const [timesheets, setTimesheets] = useState(DEMO_TIMESHEETS);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ engineer_name: '', clock_in: '', clock_out: '', travel_time: '0', notes: '' });

  const totalHours = timesheets.reduce((sum, t) => sum + (t.hours_worked || 0), 0);
  const totalTravel = timesheets.reduce((sum, t) => sum + (t.travel_time || 0), 0);

  const calcHours = (cin: string, cout: string) => {
    if (!cin || !cout) return 0;
    return Math.max(0, (new Date(cout).getTime() - new Date(cin).getTime()) / 3600000);
  };

  const handleAdd = async () => {
    if (!form.engineer_name || !form.clock_in) return;
    const hours = calcHours(form.clock_in, form.clock_out);
    const item = { work_order_id: workOrderId, engineer_name: form.engineer_name, clock_in: form.clock_in, clock_out: form.clock_out || null, hours_worked: hours, travel_time: parseFloat(form.travel_time) || 0, notes: form.notes };
    try {
      const { data, error } = await supabase.from('engineer_timesheets').insert([item]).select().maybeSingle();
      if (!error && data) setTimesheets(prev => [...prev, data]);
      else setTimesheets(prev => [...prev, { ...item, id: Date.now() }]);
    } catch {
      setTimesheets(prev => [...prev, { ...item, id: Date.now() }]);
    }
    setForm({ engineer_name: '', clock_in: '', clock_out: '', travel_time: '0', notes: '' });
    setShowAdd(false);
  };

  const fmt = (d: string) => d ? new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{totalHours.toFixed(1)}h</p>
            <p className="text-xs text-gray-400">Labour Hours</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{totalTravel.toFixed(1)}h</p>
            <p className="text-xs text-gray-400">Travel Time</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{timesheets.length}</p>
            <p className="text-xs text-gray-400">Visits</p>
          </div>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer transition-colors whitespace-nowrap">
          <i className="ri-add-line"></i> Log Time
        </button>
      </div>

      {showAdd && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input value={form.engineer_name} onChange={e => setForm(f => ({ ...f, engineer_name: e.target.value }))} placeholder="Engineer name *"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white" />
            <input value={form.travel_time} onChange={e => setForm(f => ({ ...f, travel_time: e.target.value }))} placeholder="Travel time (hrs)" type="number"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white" />
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Clock In *</label>
              <input type="datetime-local" value={form.clock_in} onChange={e => setForm(f => ({ ...f, clock_in: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Clock Out</label>
              <input type="datetime-local" value={form.clock_out} onChange={e => setForm(f => ({ ...f, clock_out: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <div className="col-span-2">
              <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Notes"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer whitespace-nowrap">Save</button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {timesheets.map(t => (
          <div key={t.id} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{t.engineer_name[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{t.engineer_name}</p>
                  <p className="text-xs text-gray-400">{fmt(t.clock_in)} → {fmt(t.clock_out)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{(t.hours_worked || 0).toFixed(1)}h</p>
                <p className="text-xs text-gray-400">+ {t.travel_time || 0}h travel</p>
              </div>
            </div>
            {t.notes && <p className="text-sm text-gray-500 mt-2 pl-12">{t.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}