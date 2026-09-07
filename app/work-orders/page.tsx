'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import AuthGuard from '@/components/AuthGuard';
import { supabase } from '@/lib/supabase';
import WOStatsBar from './WOStatsBar';
import WOKanban from './WOKanban';
import WOTable from './WOTable';
import CreateWOModal from './CreateWOModal';

const DEMO_ORDERS = [
  { id: 1, job_id: 'WO-2026-001', title: 'HVAC Unit A-201 Fault - Unusual Noise', description: 'Loud rattling noise from rooftop HVAC unit during operation.', type: 'reactive', priority: 'high', status: 'in_progress', assigned_engineer: 'Mike Johnson', due_date: '2026-05-15', client_name: 'Acme Corp', client_email: 'facilities@acme.com', labour_hours: 3.5, materials_cost: 120, created_at: '2026-05-09' },
  { id: 2, job_id: 'WO-2026-002', title: 'Lobby Emergency Lighting Test', description: 'Monthly emergency lighting test and battery check.', type: 'inspection', priority: 'medium', status: 'completed', assigned_engineer: 'Sarah Chen', due_date: '2026-05-10', client_name: 'Acme Corp', client_email: 'facilities@acme.com', labour_hours: 2.0, materials_cost: 0, created_at: '2026-05-05' },
  { id: 3, job_id: 'WO-2026-003', title: 'Boiler Room Annual Service', description: 'Annual service and inspection of main boiler system.', type: 'planned', priority: 'high', status: 'assigned', assigned_engineer: 'Tom Wilson', due_date: '2026-05-20', client_name: 'Acme Corp', client_email: 'facilities@acme.com', labour_hours: 0, materials_cost: 350, created_at: '2026-05-10' },
  { id: 4, job_id: 'WO-2026-004', title: 'Emergency - Water Leak Floor 3', description: 'Major water leak from burst pipe in 3rd floor server room.', type: 'emergency', priority: 'emergency', status: 'in_progress', assigned_engineer: 'Alex Davis', due_date: '2026-05-12', client_name: 'TechHub Ltd', client_email: 'ops@techhub.com', labour_hours: 5.0, materials_cost: 890, created_at: '2026-05-11' },
  { id: 5, job_id: 'WO-2026-005', title: 'Fire Alarm Panel Fault - Zone 4', description: 'Fire alarm panel showing fault on Zone 4.', type: 'reactive', priority: 'high', status: 'awaiting_parts', assigned_engineer: 'Mike Johnson', due_date: '2026-05-14', client_name: 'TechHub Ltd', client_email: 'ops@techhub.com', labour_hours: 1.5, materials_cost: 245, created_at: '2026-05-08' },
  { id: 6, job_id: 'WO-2026-006', title: 'Lift B Quarterly Maintenance', description: 'Quarterly maintenance service for passenger lift B.', type: 'planned', priority: 'medium', status: 'new', assigned_engineer: null, due_date: '2026-05-25', client_name: 'City Tower', client_email: 'mgmt@citytower.com', labour_hours: 0, materials_cost: 0, created_at: '2026-05-11' },
  { id: 7, job_id: 'WO-2026-007', title: 'CCTV Camera Replacement - Car Park', description: 'Replace 3 faulty CCTV cameras in underground car park.', type: 'reactive', priority: 'medium', status: 'completed', assigned_engineer: 'Sarah Chen', due_date: '2026-05-08', client_name: 'City Tower', client_email: 'mgmt@citytower.com', labour_hours: 4.0, materials_cost: 680, created_at: '2026-05-02' },
  { id: 8, job_id: 'WO-2026-008', title: 'Access Control System Update', description: 'Update access control firmware and reprogram door schedules.', type: 'planned', priority: 'low', status: 'in_progress', assigned_engineer: 'Alex Davis', due_date: '2026-05-18', client_name: 'Riverside Office', client_email: 'admin@riverside.com', labour_hours: 2.5, materials_cost: 0, created_at: '2026-05-10' },
  { id: 9, job_id: 'WO-2026-009', title: 'Generator Monthly Test Run', description: 'Monthly test run of emergency generator.', type: 'inspection', priority: 'medium', status: 'new', assigned_engineer: null, due_date: '2026-05-15', client_name: 'Riverside Office', client_email: 'admin@riverside.com', labour_hours: 0, materials_cost: 0, created_at: '2026-05-12' },
  { id: 10, job_id: 'WO-2026-010', title: 'Roof Drainage Blockage', description: 'Standing water on flat roof section B. Drain appears blocked.', type: 'reactive', priority: 'high', status: 'assigned', assigned_engineer: 'Tom Wilson', due_date: '2026-05-13', client_name: 'Acme Corp', client_email: 'facilities@acme.com', labour_hours: 0, materials_cost: 80, created_at: '2026-05-11' },
  { id: 11, job_id: 'WO-2026-011', title: 'Plumbing - Restroom Faucet Repair', description: 'Multiple faucets dripping in 2nd floor male restroom.', type: 'reactive', priority: 'low', status: 'completed', assigned_engineer: 'Mike Johnson', due_date: '2026-05-05', client_name: 'TechHub Ltd', client_email: 'ops@techhub.com', labour_hours: 1.5, materials_cost: 45, created_at: '2026-04-30' },
  { id: 12, job_id: 'WO-2026-012', title: 'Solar Panel Inspection', description: 'Annual inspection of rooftop solar array.', type: 'inspection', priority: 'low', status: 'on_hold', assigned_engineer: 'Sarah Chen', due_date: '2026-05-30', client_name: 'City Tower', client_email: 'mgmt@citytower.com', labour_hours: 0, materials_cost: 0, created_at: '2026-05-07' },
  { id: 13, job_id: 'WO-2026-013', title: 'Electrical Distribution Board Service', description: 'Annual service of main electrical distribution boards.', type: 'planned', priority: 'high', status: 'new', assigned_engineer: null, due_date: '2026-05-22', client_name: 'Acme Corp', client_email: 'facilities@acme.com', labour_hours: 0, materials_cost: 0, created_at: '2026-05-12' },
  { id: 14, job_id: 'WO-2026-014', title: 'Window Cleaning - External', description: 'External window cleaning for all floors. High-rise access required.', type: 'planned', priority: 'low', status: 'assigned', assigned_engineer: 'Tom Wilson', due_date: '2026-05-28', client_name: 'City Tower', client_email: 'mgmt@citytower.com', labour_hours: 0, materials_cost: 1200, created_at: '2026-05-09' },
  { id: 15, job_id: 'WO-2026-015', title: 'Emergency Exit Door Fault', description: 'East wing emergency exit door not latching properly. Security risk.', type: 'reactive', priority: 'emergency', status: 'in_progress', assigned_engineer: 'Alex Davis', due_date: '2026-05-12', client_name: 'Riverside Office', client_email: 'admin@riverside.com', labour_hours: 1.0, materials_cost: 180, created_at: '2026-05-12' },
];

export default function WorkOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'kanban' | 'table'>('table');
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('work_orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data && data.length > 0 ? data : DEMO_ORDERS);
    } catch {
      setOrders(DEMO_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: any) => {
    try {
      const { error } = await supabase.from('work_orders').insert([data]);
      if (error) throw error;
      setShowCreate(false);
      fetchOrders();
    } catch {
      setOrders(prev => [{ ...data, id: Date.now() }, ...prev]);
      setShowCreate(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this work order?')) return;
    try {
      await supabase.from('work_orders').delete().eq('id', id);
    } catch {}
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await supabase.from('work_orders').update({ status }).eq('id', id);
    } catch {}
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.title.toLowerCase().includes(search.toLowerCase()) || o.job_id?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchPriority = filterPriority === 'all' || o.priority === filterPriority;
    const matchType = filterType === 'all' || o.type === filterType;
    return matchSearch && matchStatus && matchPriority && matchType;
  });

  return (
    <AuthGuard>
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <TopBar title="Work Orders" />
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Work Orders</h1>
              <p className="text-sm text-gray-500 mt-1">Manage reactive, planned, inspection & emergency jobs</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/work-orders/engineer" className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap">
                <i className="ri-smartphone-line"></i> Engineer View
              </Link>
              <Link href="/work-orders/client-portal" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
                <i className="ri-user-line"></i> Client Portal
              </Link>
              <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap">
                <i className="ri-add-line"></i> New Work Order
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <i className="ri-loader-4-line text-4xl text-blue-500 animate-spin block mb-3"></i>
                <p className="text-gray-500">Loading work orders...</p>
              </div>
            </div>
          ) : (
            <>
              <WOStatsBar orders={orders} />

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-48 relative">
                    <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs..."
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div className="relative">
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                      className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer">
                      <option value="all">All Statuses</option>
                      <option value="new">New</option>
                      <option value="assigned">Assigned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="awaiting_parts">Awaiting Parts</option>
                      <option value="on_hold">On Hold</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm"></i>
                  </div>
                  <div className="relative">
                    <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
                      className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer">
                      <option value="all">All Priorities</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="emergency">Emergency</option>
                    </select>
                    <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm"></i>
                  </div>
                  <div className="relative">
                    <select value={filterType} onChange={e => setFilterType(e.target.value)}
                      className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer">
                      <option value="all">All Types</option>
                      <option value="reactive">Reactive</option>
                      <option value="planned">Planned</option>
                      <option value="inspection">Inspection</option>
                      <option value="emergency">Emergency</option>
                    </select>
                    <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm"></i>
                  </div>
                  <div className="ml-auto flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button onClick={() => setView('table')} className={`px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer transition-colors ${view === 'table' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                      <i className="ri-list-check mr-1.5"></i>Table
                    </button>
                    <button onClick={() => setView('kanban')} className={`px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer transition-colors ${view === 'kanban' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                      <i className="ri-layout-column-line mr-1.5"></i>Kanban
                    </button>
                  </div>
                </div>
              </div>

              {view === 'table' ? (
                <WOTable orders={filtered} onDelete={handleDelete} />
              ) : (
                <WOKanban orders={filtered} onStatusChange={handleStatusChange} />
              )}
            </>
          )}
        </div>
      </div>
      {showCreate && <CreateWOModal onClose={() => setShowCreate(false)} onSave={handleCreate} />}
    </div>
    </AuthGuard>
  );
}