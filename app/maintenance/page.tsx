'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

function MaintenanceContent() {
  const [selectedView, setSelectedView] = useState('calendar');

  const maintenanceSchedules = [
    { id: 'MS-001', assetName: 'Central Air Conditioning Unit', type: 'Preventive', frequency: 'Quarterly', nextDue: '2024-01-28', lastCompleted: '2024-01-15', assignee: 'Mike Johnson', status: 'Scheduled', priority: 'High', estimatedDuration: '4 hours', checklist: ['Check filters', 'Inspect belts', 'Test thermostat', 'Clean coils'] },
    { id: 'MS-002', assetName: 'Fire Safety Panel', type: 'Preventive', frequency: 'Monthly', nextDue: '2024-02-10', lastCompleted: '2024-01-10', assignee: 'Sarah Chen', status: 'Scheduled', priority: 'High', estimatedDuration: '2 hours', checklist: ['Test all zones', 'Check battery backup', 'Verify alarms', 'Update log'] },
    { id: 'MS-003', assetName: 'Emergency Generator', type: 'Preventive', frequency: 'Monthly', nextDue: '2024-02-05', lastCompleted: '2024-01-05', assignee: 'Tom Wilson', status: 'In Progress', priority: 'High', estimatedDuration: '3 hours', checklist: ['Test start sequence', 'Check fuel levels', 'Inspect connections', 'Load test'] },
    { id: 'MS-004', assetName: 'Conference Room Projector', type: 'Preventive', frequency: 'Bi-Annual', nextDue: '2024-07-20', lastCompleted: '2024-01-20', assignee: 'Alex Davis', status: 'Completed', priority: 'Medium', estimatedDuration: '1 hour', checklist: ['Clean lens', 'Check lamp hours', 'Test connections', 'Update firmware'] }
  ];

  const getStatusColor = (s: string) => { switch(s) { case 'Scheduled': return 'bg-cyan-100 text-cyan-700'; case 'In Progress': return 'bg-amber-100 text-amber-700'; case 'Completed': return 'bg-emerald-100 text-emerald-700'; case 'Overdue': return 'bg-red-100 text-red-700'; default: return 'bg-gray-100 text-gray-700'; } };
  const getPriorityColor = (p: string) => { switch(p) { case 'High': return 'bg-red-100 text-red-700'; case 'Medium': return 'bg-amber-100 text-amber-700'; case 'Low': return 'bg-emerald-100 text-emerald-700'; default: return 'bg-gray-100 text-gray-700'; } };

  return (
    <div className="flex min-h-screen bg-[#030912]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Preventive Maintenance" />
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Preventive Maintenance</h1>
            <div className="flex items-center space-x-4">
              <Link href="/maintenance/schedule" className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-cyan-400 transition-colors whitespace-nowrap cursor-pointer"><i className="ri-calendar-line mr-2"></i>Schedule Maintenance</Link>
              <button className="bg-white/10 text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors whitespace-nowrap cursor-pointer"><i className="ri-download-line mr-2"></i>Export</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[{ icon: 'ri-calendar-check-line', color: 'bg-cyan-500', label: 'Scheduled Tasks', val: '24' },{ icon: 'ri-alarm-warning-line', color: 'bg-amber-500', label: 'Due This Week', val: '8' },{ icon: 'ri-check-line', color: 'bg-emerald-500', label: 'Completed', val: '156' },{ icon: 'ri-award-line', color: 'bg-violet-500', label: 'Compliance Rate', val: '94%' }].map((s: any, i: number) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between"><div><p className="text-sm text-gray-400 mb-1">{s.label}</p><p className="text-2xl font-bold text-white">{s.val}</p></div><div className={`w-12 h-12 ${s.color} rounded-lg flex items-center justify-center`}><i className={`${s.icon} text-white`}></i></div></div>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-white">Maintenance Schedule</h2>
              <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                {['calendar','list'].map((v: string)=>(<button key={v} onClick={()=>setSelectedView(v)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${selectedView===v?'bg-cyan-500 text-white':'text-gray-400 hover:text-gray-300'}`}>{v==='calendar'?'Calendar View':'List View'}</button>))}
              </div>
            </div>
          </div>

          {selectedView === 'calendar' ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
              <div className="grid grid-cols-7 gap-4 mb-6">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d: string)=>(<div key={d} className="text-center text-sm font-medium text-gray-400 p-2">{d}</div>))}</div>
              <div className="grid grid-cols-7 gap-4">
                {Array.from({length:35},(_,i)=>{const d=new Date();d.setDate(d.getDate()-d.getDay()+i);const dn=d.getDate();const isToday=d.toDateString()===new Date().toDateString();const has=[5,10,15,20,25,28].includes(dn);return(<div key={i} className={`min-h-[80px] p-2 border rounded-lg ${isToday?'bg-cyan-500/10 border-cyan-500/30':'bg-white/5 border-white/10'}`}><div className={`text-sm font-medium mb-1 ${isToday?'text-cyan-400':'text-gray-400'}`}>{dn}</div>{has&&<div className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full mb-1">Maintenance</div>}</div>);})}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {maintenanceSchedules.map((s: any) => (
                <div key={s.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3"><span className="text-sm font-medium text-gray-500">{s.id}</span><span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(s.priority)}`}>{s.priority}</span><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(s.status)}`}>{s.status}</span></div>
                    <div className="flex space-x-2"><Link href={`/maintenance/${s.id}`} className="text-cyan-400 hover:text-cyan-300 cursor-pointer"><i className="ri-eye-line"></i></Link><Link href={`/maintenance/${s.id}/edit`} className="text-gray-500 hover:text-gray-300 cursor-pointer"><i className="ri-edit-line"></i></Link></div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{s.assetName}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-400"><i className="ri-repeat-line mr-2"></i><span>{s.frequency}</span></div>
                    <div className="flex items-center text-sm text-gray-400"><i className="ri-user-line mr-2"></i><span>{s.assignee}</span></div>
                    <div className="flex items-center text-sm text-gray-400"><i className="ri-time-line mr-2"></i><span>{s.estimatedDuration}</span></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-400"><i className="ri-calendar-line mr-2"></i><span>Next Due: {s.nextDue}</span></div>
                    <div className="flex items-center text-sm text-gray-400"><i className="ri-calendar-check-line mr-2"></i><span>Last Completed: {s.lastCompleted}</span></div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4"><h4 className="text-sm font-medium text-gray-400 mb-2">Maintenance Checklist</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-2">{s.checklist.map((item: string, i: number)=>(<div key={i} className="flex items-center text-sm text-gray-400"><i className="ri-checkbox-line mr-2"></i><span>{item}</span></div>))}</div></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MaintenancePage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="flex min-h-screen bg-[#030912] items-center justify-center"><i className="ri-loader-4-line animate-spin text-cyan-400 text-3xl"></i></div>}>
        <MaintenanceContent />
      </Suspense>
    </AuthGuard>
  );
}