'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import AuthGuard from '@/components/AuthGuard';
import { supabase } from '@/lib/supabase';
import ComplianceDashboardWidgets from './ComplianceDashboardWidgets';
import ComplianceTable from './ComplianceTable';
import ComplianceDetailModal from './ComplianceDetailModal';
import PPMScheduleTable from './PPMScheduleTable';
import PPMCalendar from './PPMCalendar';
import AIComplianceTools from './AIComplianceTools';
import { CategoryBadge } from './ComplianceStatusBadge';

const DEMO_COMPLIANCE = [
  { id: 1, title: 'Fire Risk Assessment - Building A', category: 'fire_safety', contractor_name: 'FireSafe Solutions Ltd', status: 'compliant', inspection_date: '2025-11-15', expiry_date: '2026-11-15', next_inspection_date: '2026-10-15', reminder_days: 30, notes: 'Annual fire risk assessment completed. Minor recommendations actioned.' },
  { id: 2, title: 'Fire Alarm System Test - Building A', category: 'fire_safety', contractor_name: 'FireSafe Solutions Ltd', status: 'compliant', inspection_date: '2026-04-01', expiry_date: '2026-07-01', next_inspection_date: '2026-06-15', reminder_days: 14, notes: 'Quarterly test passed. All zones operational.' },
  { id: 3, title: 'Emergency Lighting Test - All Sites', category: 'emergency_lighting', contractor_name: 'FireSafe Solutions Ltd', status: 'due_soon', inspection_date: '2026-02-01', expiry_date: '2026-05-20', next_inspection_date: '2026-05-20', reminder_days: 30, notes: 'Monthly function test due. Annual duration test scheduled.' },
  { id: 4, title: 'Gas Safety Certificate - Building B', category: 'gas_safety', contractor_name: 'GasSafe Engineers', status: 'compliant', inspection_date: '2025-12-10', expiry_date: '2026-12-10', next_inspection_date: '2026-11-10', reminder_days: 30, notes: 'Annual gas safety inspection passed. All appliances certified.' },
  { id: 5, title: 'Electrical Installation Condition Report', category: 'electrical', contractor_name: 'ElecTest Pro', status: 'overdue', inspection_date: '2021-06-01', expiry_date: '2026-06-01', next_inspection_date: '2026-05-01', reminder_days: 60, notes: 'EICR due for renewal. 5-year cycle. Book immediately.' },
  { id: 6, title: 'Water Risk Assessment - Legionella', category: 'water_hygiene', contractor_name: 'AquaHygiene Services', status: 'compliant', inspection_date: '2026-01-15', expiry_date: '2027-01-15', next_inspection_date: '2026-12-15', reminder_days: 30, notes: 'Annual Legionella risk assessment completed.' },
  { id: 7, title: 'Water Temperature Monitoring', category: 'water_hygiene', contractor_name: 'AquaHygiene Services', status: 'due_soon', inspection_date: '2026-04-01', expiry_date: '2026-05-15', next_inspection_date: '2026-05-15', reminder_days: 14, notes: 'Monthly temperature checks due.' },
  { id: 8, title: 'Asbestos Management Survey', category: 'asbestos', contractor_name: 'AsbestosCheck Ltd', status: 'compliant', inspection_date: '2024-03-20', expiry_date: '2029-03-20', next_inspection_date: '2028-12-20', reminder_days: 90, notes: '5-year management survey. No ACMs found.' },
  { id: 9, title: 'HVAC Annual Service - All Units', category: 'hvac', contractor_name: 'HVAC Specialists UK', status: 'compliant', inspection_date: '2026-02-28', expiry_date: '2027-02-28', next_inspection_date: '2026-12-01', reminder_days: 60, notes: 'Annual service completed on all 12 HVAC units.' },
  { id: 10, title: 'Lift Thorough Examination - Lift A', category: 'lift_inspection', contractor_name: 'LiftTech Inspections', status: 'compliant', inspection_date: '2026-03-15', expiry_date: '2026-09-15', next_inspection_date: '2026-08-15', reminder_days: 30, notes: '6-monthly thorough examination. No defects.' },
  { id: 11, title: 'Lift Thorough Examination - Lift B', category: 'lift_inspection', contractor_name: 'LiftTech Inspections', status: 'due_soon', inspection_date: '2025-11-20', expiry_date: '2026-05-20', next_inspection_date: '2026-05-20', reminder_days: 30, notes: '6-monthly examination due. Book with LiftTech.' },
  { id: 12, title: 'PAT Testing - Office Equipment', category: 'pat_testing', contractor_name: 'PAT Testing Direct', status: 'compliant', inspection_date: '2025-10-01', expiry_date: '2026-10-01', next_inspection_date: '2026-09-01', reminder_days: 30, notes: '247 items tested, 3 failed and replaced.' },
  { id: 13, title: 'Health & Safety Policy Review', category: 'health_safety', contractor_name: null, status: 'compliant', inspection_date: '2026-01-01', expiry_date: '2027-01-01', next_inspection_date: '2026-12-01', reminder_days: 60, notes: 'Annual H&S policy review completed.' },
  { id: 14, title: 'Employers Liability Insurance', category: 'insurance', contractor_name: null, status: 'compliant', inspection_date: '2026-01-01', expiry_date: '2027-01-01', next_inspection_date: '2026-11-01', reminder_days: 60, notes: 'Policy renewed. £10M cover.' },
  { id: 15, title: 'Risk Assessment - Manual Handling', category: 'risk_assessment', contractor_name: null, status: 'failed', inspection_date: '2024-06-01', expiry_date: '2025-06-01', next_inspection_date: '2026-05-15', reminder_days: 30, notes: 'OVERDUE - Annual review not completed. Action required immediately.' },
  { id: 16, title: 'Fire Extinguisher Annual Service', category: 'fire_safety', contractor_name: 'FireSafe Solutions Ltd', status: 'compliant', inspection_date: '2026-03-01', expiry_date: '2027-03-01', next_inspection_date: '2026-12-01', reminder_days: 60, notes: 'All 24 extinguishers serviced and tagged.' },
];

const DEMO_PPM = [
  { id: 1, title: 'HVAC Filter Replacement - Building A', description: 'Replace all air filters and clean grilles', category: 'hvac', asset_name: 'HVAC Unit A-201', frequency: 'monthly', assigned_engineer: 'Mike Johnson', estimated_hours: 2.0, last_completed: '2026-04-12', next_due: '2026-05-12', status: 'active', checklist: ['Replace air filters','Clean grilles and diffusers','Check belt tension','Log readings'] },
  { id: 2, title: 'Boiler Annual Service', description: 'Full annual service of main boiler system', category: 'gas_safety', asset_name: 'Main Boiler System', frequency: 'annual', assigned_engineer: 'Tom Wilson', estimated_hours: 6.0, last_completed: '2025-11-20', next_due: '2026-11-20', status: 'active', checklist: ['Check burner operation','Clean heat exchanger','Test safety valves','Check flue'] },
  { id: 3, title: 'Fire Alarm Weekly Test', description: 'Weekly manual call point test', category: 'fire_safety', asset_name: 'Fire Alarm Panel', frequency: 'weekly', assigned_engineer: 'Sarah Chen', estimated_hours: 0.5, last_completed: '2026-05-05', next_due: '2026-05-12', status: 'active', checklist: ['Activate manual call point','Verify panel response','Check all zones','Reset system','Log in fire log book'] },
  { id: 4, title: 'Emergency Lighting Monthly Test', description: 'Monthly function test of all emergency lights', category: 'emergency_lighting', asset_name: 'Emergency Lighting System', frequency: 'monthly', assigned_engineer: 'Sarah Chen', estimated_hours: 1.5, last_completed: '2026-04-01', next_due: '2026-05-01', status: 'overdue', checklist: ['Test all luminaires','Check battery indicators','Record any failures','Replace failed units','Update log'] },
  { id: 5, title: 'Lift Quarterly Maintenance', description: 'Quarterly maintenance service for all lifts', category: 'lift_inspection', asset_name: 'Passenger Lift A & B', frequency: 'quarterly', assigned_engineer: 'Alex Davis', estimated_hours: 4.0, last_completed: '2026-02-15', next_due: '2026-05-15', status: 'active', checklist: ['Lubricate guide rails','Check door operation','Test safety devices','Inspect ropes/belts','Clean pit'] },
  { id: 6, title: 'Water Temperature Checks', description: 'Monthly Legionella control temperature monitoring', category: 'water_hygiene', asset_name: 'Water System', frequency: 'monthly', assigned_engineer: 'Mike Johnson', estimated_hours: 1.0, last_completed: '2026-04-01', next_due: '2026-05-01', status: 'overdue', checklist: ['Check hot water >50°C','Check cold water <20°C','Flush infrequently used outlets','Record all readings'] },
  { id: 7, title: 'Generator Monthly Test', description: 'Monthly test run of emergency generator', category: 'electrical', asset_name: 'Emergency Generator', frequency: 'monthly', assigned_engineer: 'Tom Wilson', estimated_hours: 1.5, last_completed: '2026-04-10', next_due: '2026-05-10', status: 'active', checklist: ['Start generator','Run under load for 30 mins','Check fuel level','Check oil level','Record output readings'] },
  { id: 8, title: 'CCTV System Check', description: 'Quarterly CCTV system health check', category: 'security', asset_name: 'CCTV System', frequency: 'quarterly', assigned_engineer: 'Alex Davis', estimated_hours: 2.0, last_completed: '2026-02-01', next_due: '2026-05-01', status: 'overdue', checklist: ['Check all camera feeds','Clean camera lenses','Verify recording','Check storage capacity'] },
  { id: 9, title: 'Electrical Distribution Board Inspection', description: 'Annual inspection of all distribution boards', category: 'electrical', asset_name: 'Main Distribution Boards', frequency: 'annual', assigned_engineer: 'ElecTest Pro', estimated_hours: 8.0, last_completed: '2025-06-01', next_due: '2026-06-01', status: 'active', checklist: ['Visual inspection','Thermal imaging','Test RCDs','Check connections'] },
  { id: 10, title: 'Roof Drainage Inspection', description: 'Quarterly inspection and clearance of roof drains', category: 'building', asset_name: 'Roof Drainage System', frequency: 'quarterly', assigned_engineer: 'Mike Johnson', estimated_hours: 3.0, last_completed: '2026-02-20', next_due: '2026-05-20', status: 'active', checklist: ['Clear all gutters','Check downpipes','Inspect flat roof areas','Clear drain covers'] },
];

const TABS = [
  { k: 'compliance', label: 'Compliance Register', icon: 'ri-shield-check-line' },
  { k: 'ppm', label: 'PPM Schedules', icon: 'ri-settings-line' },
  { k: 'calendar', label: 'Calendar', icon: 'ri-calendar-line' },
  { k: 'ai', label: 'AI Tools', icon: 'ri-sparkling-line' },
];

const CATEGORIES = ['all','fire_safety','emergency_lighting','gas_safety','electrical','water_hygiene','asbestos','hvac','lift_inspection','pat_testing','risk_assessment','insurance','health_safety'];

export default function CompliancePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [ppmSchedules, setPpmSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('compliance');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [{ data: comp }, { data: ppm }] = await Promise.all([
        supabase.from('compliance_records').select('*').order('expiry_date', { ascending: true }),
        supabase.from('ppm_schedules').select('*').order('next_due', { ascending: true }),
      ]);
      setRecords(comp && comp.length > 0 ? comp : DEMO_COMPLIANCE);
      setPpmSchedules(ppm && ppm.length > 0 ? ppm : DEMO_PPM);
    } catch {
      setRecords(DEMO_COMPLIANCE);
      setPpmSchedules(DEMO_PPM);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleGenerateJob = (schedule: any) => {
    showToast(`Work order generated for: ${schedule.title}`);
  };

  const handleRecordUpdate = (updated: any) => {
    setRecords(prev => prev.map(r => r.id === updated.id ? updated : r));
    setSelectedRecord(null);
    showToast('Compliance record updated');
  };

  const filteredRecords = records.filter(r => {
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchCat = filterCategory === 'all' || r.category === filterCategory;
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.contractor_name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchCat && matchSearch;
  });

  const filteredPPM = ppmSchedules.filter(s => {
    const matchSearch = !search || s.title.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <AuthGuard>
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <TopBar title="Compliance & PPM" />
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Compliance & PPM</h1>
              <p className="text-sm text-gray-500 mt-1">Building compliance, planned preventive maintenance & certificates</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => showToast('Reminder notifications sent to all relevant parties')}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 cursor-pointer transition-colors whitespace-nowrap">
                <i className="ri-notification-line"></i> Send Reminders
              </button>
              <button onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 cursor-pointer transition-colors whitespace-nowrap">
                <i className="ri-add-line"></i> Add Record
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <i className="ri-loader-4-line text-4xl text-blue-500 animate-spin block mb-3"></i>
                <p className="text-gray-500">Loading compliance data...</p>
              </div>
            </div>
          ) : (
            <>
              <ComplianceDashboardWidgets records={records} ppmSchedules={ppmSchedules} />

              <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1 mb-5 shadow-sm">
                {TABS.map(t => (
                  <button key={t.k} onClick={() => setTab(t.k)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors whitespace-nowrap ${tab === t.k ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                    <i className={t.icon}></i>{t.label}
                  </button>
                ))}
              </div>

              {(tab === 'compliance' || tab === 'ppm') && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-48 relative">
                      <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                    </div>
                    {tab === 'compliance' && (
                      <>
                        <div className="relative">
                          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                            className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer">
                            <option value="all">All Statuses</option>
                            <option value="compliant">Compliant</option>
                            <option value="due_soon">Due Soon</option>
                            <option value="overdue">Overdue</option>
                            <option value="failed">Failed</option>
                          </select>
                          <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm"></i>
                        </div>
                        <div className="relative">
                          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                            className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer">
                            <option value="all">All Categories</option>
                            {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                          </select>
                          <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm"></i>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {tab === 'compliance' && (
                <ComplianceTable records={filteredRecords} onView={setSelectedRecord} />
              )}
              {tab === 'ppm' && (
                <PPMScheduleTable schedules={filteredPPM} onGenerateJob={handleGenerateJob} />
              )}
              {tab === 'calendar' && (
                <PPMCalendar schedules={ppmSchedules} complianceRecords={records} />
              )}
              {tab === 'ai' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <AIComplianceTools />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selectedRecord && (
        <ComplianceDetailModal record={selectedRecord} onClose={() => setSelectedRecord(null)} onUpdate={handleRecordUpdate} />
      )}

      {showAddModal && (
        <AddComplianceModal onClose={() => setShowAddModal(false)} onSave={(data) => {
          setRecords(prev => [{ ...data, id: Date.now() }, ...prev]);
          setShowAddModal(false);
          showToast('Compliance record added');
        }} />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium z-50 flex items-center gap-2">
          <i className="ri-checkbox-circle-line text-green-400"></i>
          {toast}
        </div>
      )}
    </div>
    </AuthGuard>
  );
}

function AddComplianceModal({ onClose, onSave }: { onClose: () => void; onSave: (d: any) => void }) {
  const [form, setForm] = useState({ title: '', category: 'fire_safety', contractor_name: '', status: 'compliant', inspection_date: '', expiry_date: '', next_inspection_date: '', reminder_days: 30, notes: '' });
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('compliance_records').insert([{ ...form, tenant_id: 'demo' }]).select().maybeSingle();
      if (!error && data) { onSave(data); return; }
    } catch {}
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Add Compliance Record</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
            <i className="ri-close-line"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="e.g. Fire Risk Assessment - Building A" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <div className="relative">
                <select value={form.category} onChange={e => set('category', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 appearance-none pr-8 bg-white">
                  {['fire_safety','emergency_lighting','gas_safety','electrical','water_hygiene','asbestos','hvac','lift_inspection','pat_testing','risk_assessment','insurance','health_safety'].map(c => (
                    <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
                  ))}
                </select>
                <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <div className="relative">
                <select value={form.status} onChange={e => set('status', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 appearance-none pr-8 bg-white">
                  <option value="compliant">Compliant</option>
                  <option value="due_soon">Due Soon</option>
                  <option value="overdue">Overdue</option>
                  <option value="failed">Failed</option>
                </select>
                <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Contractor</label>
            <input value={form.contractor_name} onChange={e => set('contractor_name', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="Contractor name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Inspection Date</label>
              <input type="date" value={form.inspection_date} onChange={e => set('inspection_date', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
              <input type="date" value={form.expiry_date} onChange={e => set('expiry_date', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Next Inspection</label>
              <input type="date" value={form.next_inspection_date} onChange={e => set('next_inspection_date', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Reminder (days before)</label>
              <input type="number" value={form.reminder_days} onChange={e => set('reminder_days', parseInt(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} maxLength={500}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 cursor-pointer whitespace-nowrap">Add Record</button>
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 cursor-pointer whitespace-nowrap">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}