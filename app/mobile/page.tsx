'use client';

import { useState, Suspense } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

function MobileContent() {
  const [selectedDevice, setSelectedDevice] = useState('all');

  const mobileFeatures = [
    { category: 'Core Features', features: [{ name: 'Work Order Management', description: 'Create, update, and track work orders on mobile', status: 'Active' },{ name: 'Asset Scanning', description: 'QR code and barcode scanning for asset identification', status: 'Active' },{ name: 'Photo Documentation', description: 'Capture and attach photos to work orders', status: 'Active' },{ name: 'Offline Capability', description: 'Work offline and sync when connected', status: 'Active' }] },
    { category: 'Location Services', features: [{ name: 'GPS Tracking', description: 'Track technician locations and work sites', status: 'Active' },{ name: 'Location-based Tasks', description: 'Assign tasks based on proximity', status: 'Active' },{ name: 'Route Optimization', description: 'Optimize routes for maintenance tasks', status: 'Active' },{ name: 'Geofencing', description: 'Automatic check-in/out based on location', status: 'Beta' }] },
    { category: 'Communication', features: [{ name: 'Push Notifications', description: 'Real-time alerts for urgent tasks', status: 'Active' },{ name: 'In-app Messaging', description: 'Communication between team members', status: 'Active' },{ name: 'Voice Notes', description: 'Record voice memos for work orders', status: 'Active' },{ name: 'Video Calls', description: 'Video support for complex issues', status: 'Coming Soon' }] }
  ];

  const deviceStats = [
    { device: 'iOS', users: 156, version: '2.1.3', lastUpdate: '2024-01-20' },{ device: 'Android', users: 234, version: '2.1.2', lastUpdate: '2024-01-18' },{ device: 'Tablet', users: 42, version: '2.1.1', lastUpdate: '2024-01-15' },{ device: 'Web Mobile', users: 89, version: '2.1.3', lastUpdate: '2024-01-22' }
  ];

  const mobileWorkOrders = [
    { id: 'WO-456', title: 'HVAC Filter Replacement', technician: 'John Smith', location: 'Building A - Floor 2', status: 'In Progress', priority: 'Medium', photos: 3, startTime: '09:30 AM', device: 'iOS' },
    { id: 'WO-457', title: 'Electrical Outlet Repair', technician: 'Sarah Johnson', location: 'Building B - Room 305', status: 'Completed', priority: 'High', photos: 5, startTime: '08:15 AM', device: 'Android' },
    { id: 'WO-458', title: 'Plumbing Leak Fix', technician: 'Mike Davis', location: 'Building C - Basement', status: 'In Progress', priority: 'High', photos: 2, startTime: '10:45 AM', device: 'Android' }
  ];

  const gs = (s: string) => { switch(s){case 'Active':case 'Completed':return 'bg-emerald-100 text-emerald-700';case 'Beta':case 'In Progress':return 'bg-cyan-100 text-cyan-700';case 'Coming Soon':return 'bg-amber-100 text-amber-700';default:return 'bg-gray-100 text-gray-700';} };
  const gpr = (p: string) => { switch(p){case 'High':return 'bg-red-100 text-red-700';case 'Medium':return 'bg-amber-100 text-amber-700';case 'Low':return 'bg-emerald-100 text-emerald-700';default:return 'bg-gray-100 text-gray-700';} };

  return (
    <div className="flex min-h-screen bg-[#030912]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Mobile Management" />
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Mobile Management</h1>
            <div className="flex items-center space-x-4">
              <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-cyan-400 transition-colors whitespace-nowrap cursor-pointer"><i className="ri-download-line mr-2"></i>Download App</button>
              <button className="bg-white/10 text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors whitespace-nowrap cursor-pointer"><i className="ri-settings-line mr-2"></i>App Settings</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[{icon:'ri-smartphone-line',color:'bg-cyan-500',label:'Active Users',val:'521'},{icon:'ri-file-list-line',color:'bg-emerald-500',label:'Mobile Work Orders',val:'347'},{icon:'ri-camera-line',color:'bg-violet-500',label:'Photos Captured',val:'1,247'},{icon:'ri-refresh-line',color:'bg-amber-500',label:'Offline Syncs',val:'89'}].map((s:any,i:number)=>(<div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-400 mb-1">{s.label}</p><p className="text-2xl font-bold text-white">{s.val}</p></div><div className={`w-12 h-12 ${s.color} rounded-lg flex items-center justify-center`}><i className={`${s.icon} text-white`}></i></div></div></div>))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl mb-8">
            <div className="p-6 border-b border-white/10"><h3 className="text-lg font-semibold text-white">Device Statistics</h3></div>
            <div className="p-6"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{deviceStats.map((s:any,i:number)=>(<div key={i} className="text-center p-4 bg-white/5 rounded-lg"><div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-3"><i className="ri-device-line text-white"></i></div><h4 className="font-medium text-white mb-1">{s.device}</h4><p className="text-2xl font-bold text-cyan-400 mb-2">{s.users}</p><div className="text-sm text-gray-500"><p>Version: {s.version}</p><p>Updated: {s.lastUpdate}</p></div></div>))}</div></div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl mb-8">
            <div className="p-6 border-b border-white/10"><h3 className="text-lg font-semibold text-white">Mobile Features</h3></div>
            <div className="p-6"><div className="space-y-8">{mobileFeatures.map((cat:any,i:number)=>(<div key={i}><h4 className="font-medium text-white mb-4">{cat.category}</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{cat.features.map((f:any,j:number)=>(<div key={j} className="p-4 bg-white/5 border border-white/10 rounded-lg"><div className="flex items-start justify-between mb-2"><h5 className="font-medium text-white">{f.name}</h5><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${gs(f.status)}`}>{f.status}</span></div><p className="text-sm text-gray-400">{f.description}</p></div>))}</div></div>))}</div></div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-white/10"><div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-white">Recent Mobile Work Orders</h3><select value={selectedDevice} onChange={(e:any)=>setSelectedDevice(e.target.value)} className="pr-8 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-white"><option value="all">All Devices</option><option value="ios">iOS</option><option value="android">Android</option><option value="tablet">Tablet</option></select></div></div>
            <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-white/10">{['Work Order','Technician','Location','Status','Priority','Photos','Device','Actions'].map((h:string)=>(<th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>))}</tr></thead><tbody className="divide-y divide-white/5">{mobileWorkOrders.map((o:any)=>(<tr key={o.id} className="hover:bg-white/5"><td className="px-6 py-4 whitespace-nowrap"><div><div className="text-sm font-medium text-white">{o.title}</div><div className="text-sm text-gray-500">{o.id}</div></div></td><td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-400">{o.technician}</div><div className="text-sm text-gray-500">{o.startTime}</div></td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{o.location}</td><td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${gs(o.status)}`}>{o.status}</span></td><td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${gpr(o.priority)}`}>{o.priority}</span></td><td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center space-x-2"><i className="ri-camera-line text-gray-500"></i><span className="text-sm text-gray-400">{o.photos}</span></div></td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{o.device}</td><td className="px-6 py-4 whitespace-nowrap text-sm"><div className="flex space-x-2"><button className="text-cyan-400 hover:text-cyan-300 cursor-pointer"><i className="ri-eye-line"></i></button><button className="text-gray-500 hover:text-gray-300 cursor-pointer"><i className="ri-download-line"></i></button></div></td></tr>))}</tbody></table></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MobilePage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="flex min-h-screen bg-[#030912] items-center justify-center"><i className="ri-loader-4-line animate-spin text-cyan-400 text-3xl"></i></div>}>
        <MobileContent />
      </Suspense>
    </AuthGuard>
  );
}