'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import WODetailHeader from './WODetailHeader';
import WONotesTab from './WONotesTab';
import WOMaterialsTab from './WOMaterialsTab';
import WOTimesheetTab from './WOTimesheetTab';
import WOAITab from './WOAITab';

const DEMO_ORDERS: Record<string, any> = {
  '1': { id: 1, job_id: 'WO-2026-001', title: 'HVAC Unit A-201 Fault - Unusual Noise', description: 'Loud rattling noise from rooftop HVAC unit during operation. Possible bearing failure or debris in fan housing.', type: 'reactive', priority: 'high', status: 'in_progress', assigned_engineer: 'Mike Johnson', due_date: '2026-05-15', client_name: 'Acme Corp', client_email: 'facilities@acme.com', labour_hours: 3.5, materials_cost: 120, created_at: '2026-05-09T08:00:00Z' },
  '2': { id: 2, job_id: 'WO-2026-002', title: 'Lobby Emergency Lighting Test', description: 'Monthly emergency lighting test and battery check for all units in main lobby and corridors.', type: 'inspection', priority: 'medium', status: 'completed', assigned_engineer: 'Sarah Chen', due_date: '2026-05-10', client_name: 'Acme Corp', client_email: 'facilities@acme.com', labour_hours: 2.0, materials_cost: 0, created_at: '2026-05-05T08:00:00Z' },
  '3': { id: 3, job_id: 'WO-2026-003', title: 'Boiler Room Annual Service', description: 'Annual service and inspection of main boiler system.', type: 'planned', priority: 'high', status: 'assigned', assigned_engineer: 'Tom Wilson', due_date: '2026-05-20', client_name: 'Acme Corp', client_email: 'facilities@acme.com', labour_hours: 0, materials_cost: 350, created_at: '2026-05-10T08:00:00Z' },
  '4': { id: 4, job_id: 'WO-2026-004', title: 'Emergency - Water Leak Floor 3', description: 'Major water leak from burst pipe in 3rd floor server room. Immediate response required.', type: 'emergency', priority: 'emergency', status: 'in_progress', assigned_engineer: 'Alex Davis', due_date: '2026-05-12', client_name: 'TechHub Ltd', client_email: 'ops@techhub.com', labour_hours: 5.0, materials_cost: 890, created_at: '2026-05-11T08:00:00Z' },
  '5': { id: 5, job_id: 'WO-2026-005', title: 'Fire Alarm Panel Fault - Zone 4', description: 'Fire alarm panel showing fault on Zone 4. Possible detector failure or wiring issue.', type: 'reactive', priority: 'high', status: 'awaiting_parts', assigned_engineer: 'Mike Johnson', due_date: '2026-05-14', client_name: 'TechHub Ltd', client_email: 'ops@techhub.com', labour_hours: 1.5, materials_cost: 245, created_at: '2026-05-08T08:00:00Z' },
};

const TABS = [
  { k: 'overview', label: 'Overview', icon: 'ri-information-line' },
  { k: 'notes', label: 'Notes & Updates', icon: 'ri-chat-3-line' },
  { k: 'materials', label: 'Materials', icon: 'ri-archive-line' },
  { k: 'timesheet', label: 'Timesheet', icon: 'ri-time-line' },
  { k: 'ai', label: 'AI Insights', icon: 'ri-sparkling-line' },
];

export default function WODetailClient({ workOrderId }: { workOrderId: string }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase.from('work_orders').select('*').eq('id', workOrderId).maybeSingle();
        if (error || !data) throw new Error();
        setOrder(data);
      } catch {
        setOrder(DEMO_ORDERS[workOrderId] || DEMO_ORDERS['1']);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [workOrderId]);

  const handleStatusChange = async (status: string) => {
    try {
      await supabase.from('work_orders').update({ status }).eq('id', workOrderId);
    } catch {}
    setOrder((prev: any) => ({ ...prev, status }));
  };

  if (loading) return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-blue-500 animate-spin block mb-3"></i>
          <p className="text-gray-500">Loading work order...</p>
        </div>
      </div>
    </div>
  );

  if (!order) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <WODetailHeader order={order} onStatusChange={handleStatusChange} />

          <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1 mb-5 shadow-sm">
            {TABS.map(t => (
              <button key={t.k} onClick={() => setTab(t.k)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors whitespace-nowrap ${tab === t.k ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                <i className={t.icon}></i>{t.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {tab === 'overview' && (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800 text-sm border-b border-gray-100 pb-2">Job Details</h3>
                  {[
                    { label: 'Job ID', value: order.job_id },
                    { label: 'Type', value: order.type?.replace('_', ' ') },
                    { label: 'Priority', value: order.priority },
                    { label: 'Status', value: order.status?.replace('_', ' ') },
                    { label: 'Created', value: order.created_at ? new Date(order.created_at).toLocaleDateString('en-GB') : '—' },
                    { label: 'Due Date', value: order.due_date ? new Date(order.due_date).toLocaleDateString('en-GB') : '—' },
                    { label: 'Completed', value: order.completed_at ? new Date(order.completed_at).toLocaleDateString('en-GB') : '—' },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between">
                      <span className="text-sm text-gray-400">{row.label}</span>
                      <span className="text-sm font-medium text-gray-700 capitalize">{row.value || '—'}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800 text-sm border-b border-gray-100 pb-2">Assignment & Client</h3>
                  {[
                    { label: 'Engineer', value: order.assigned_engineer },
                    { label: 'Client', value: order.client_name },
                    { label: 'Client Email', value: order.client_email },
                    { label: 'Labour Hours', value: order.labour_hours ? `${order.labour_hours}h` : '0h' },
                    { label: 'Materials Cost', value: order.materials_cost ? `£${order.materials_cost}` : '£0' },
                    { label: 'SLA Breached', value: order.sla_breached ? 'Yes' : 'No' },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between">
                      <span className="text-sm text-gray-400">{row.label}</span>
                      <span className="text-sm font-medium text-gray-700">{row.value || '—'}</span>
                    </div>
                  ))}
                  {order.description && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-400 mb-1">Description</p>
                      <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{order.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {tab === 'notes' && <WONotesTab workOrderId={order.id} />}
            {tab === 'materials' && <WOMaterialsTab workOrderId={order.id} />}
            {tab === 'timesheet' && <WOTimesheetTab workOrderId={order.id} />}
            {tab === 'ai' && <WOAITab order={order} />}
          </div>
        </div>
      </div>
    </div>
  );
}