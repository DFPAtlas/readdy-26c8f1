'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

function ReceptionContent() {
  const [activeTab, setActiveTab] = useState('visitors');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  const receptionLocations = [
    { id: 'all', name: 'All Locations', icon: 'ri-building-line' }, { id: 'main-lobby', name: 'Main Lobby', icon: 'ri-door-open-line' }, { id: 'north-entrance', name: 'North Entrance', icon: 'ri-compass-line' }, { id: 'south-entrance', name: 'South Entrance', icon: 'ri-compass-line' }, { id: 'east-wing', name: 'East Wing Reception', icon: 'ri-building-2-line' }, { id: 'west-wing', name: 'West Wing Reception', icon: 'ri-building-3-line' }, { id: 'executive-floor', name: 'Executive Floor', icon: 'ri-vip-crown-line' }
  ];

  const currentVisitors = [
    { id: 1, name: 'Sarah Johnson', company: 'Tech Solutions Inc.', host: 'Michael Chen', purpose: 'Business Meeting', checkIn: '09:30 AM', badge: 'V-001', status: 'checked-in', location: 'main-lobby', locationName: 'Main Lobby', photo: 'https://readdy.ai/api/search-image?query=professional%20business%20woman%20in%20office%20attire%20smiling%20confidently%20with%20clean%20modern%20background&width=60&height=60&seq=visitor1&orientation=squarish' },
    { id: 2, name: 'David Martinez', company: 'Global Partners', host: 'Lisa Wang', purpose: 'Project Review', checkIn: '10:15 AM', badge: 'V-002', status: 'with-host', location: 'north-entrance', locationName: 'North Entrance', photo: 'https://readdy.ai/api/search-image?query=professional%20business%20man%20in%20suit%20smiling%20warmly%20with%20clean%20modern%20background&width=60&height=60&seq=visitor2&orientation=squarish' },
    { id: 3, name: 'Emily Rodriguez', company: 'Design Studio', host: 'John Smith', purpose: 'Consultation', checkIn: '11:00 AM', badge: 'V-003', status: 'checked-in', location: 'south-entrance', locationName: 'South Entrance', photo: 'https://readdy.ai/api/search-image?query=creative%20professional%20woman%20designer%20with%20modern%20office%20background%20clean%20and%20bright&width=60&height=60&seq=visitor3&orientation=squarish' },
    { id: 4, name: 'James Wilson', company: 'Executive Consulting', host: 'CEO Office', purpose: 'Board Meeting', checkIn: '08:45 AM', badge: 'V-004', status: 'with-host', location: 'executive-floor', locationName: 'Executive Floor', photo: 'https://readdy.ai/api/search-image?query=professional%20executive%20businessman%20in%20premium%20suit%20confident%20expression%20modern%20corporate%20background&width=60&height=60&seq=visitor4&orientation=squarish' },
    { id: 5, name: 'Maria Garcia', company: 'Legal Associates', host: 'Legal Department', purpose: 'Contract Review', checkIn: '10:30 AM', badge: 'V-005', status: 'checked-in', location: 'east-wing', locationName: 'East Wing Reception', photo: 'https://readdy.ai/api/search-image?query=professional%20legal%20professional%20woman%20in%20business%20attire%20confident%20smile%20modern%20office%20background&width=60&height=60&seq=visitor5&orientation=squarish' }
  ];

  const expectedVisitors = [
    { id: 6, name: 'Robert Thompson', company: 'Legal Associates', host: 'Jennifer Lee', purpose: 'Contract Review', expectedTime: '02:00 PM', status: 'expected', location: 'main-lobby', locationName: 'Main Lobby' },
    { id: 7, name: 'Amanda Wilson', company: 'Marketing Group', host: 'Tom Johnson', purpose: 'Campaign Planning', expectedTime: '03:30 PM', status: 'expected', location: 'north-entrance', locationName: 'North Entrance' },
    { id: 8, name: "Patrick O'Connor", company: 'Investment Partners', host: 'CFO Office', purpose: 'Financial Review', expectedTime: '04:00 PM', status: 'expected', location: 'executive-floor', locationName: 'Executive Floor' }
  ];

  const deliveries = [
    { id: 1, carrier: 'FedEx', tracking: 'FX123456789', recipient: 'IT Department', status: 'delivered', time: '08:45 AM', packages: 3, signature: 'Mike Chen', location: 'main-lobby', locationName: 'Main Lobby' },
    { id: 2, carrier: 'UPS', tracking: 'UPS987654321', recipient: 'HR Department', status: 'pending', time: '10:30 AM', packages: 1, signature: null, location: 'north-entrance', locationName: 'North Entrance' },
    { id: 3, carrier: 'DHL', tracking: 'DHL456789123', recipient: 'Finance Team', status: 'delivered', time: '11:15 AM', packages: 2, signature: 'Sarah Davis', location: 'south-entrance', locationName: 'South Entrance' },
    { id: 4, carrier: 'USPS', tracking: 'USPS789123456', recipient: 'Executive Office', status: 'delivered', time: '09:20 AM', packages: 1, signature: 'Executive Assistant', location: 'executive-floor', locationName: 'Executive Floor' }
  ];

  const locationStats: any = {
    'main-lobby': { totalVisitors: 18, currentlyIn: 8, deliveries: 5, badges: 18 }, 'north-entrance': { totalVisitors: 12, currentlyIn: 5, deliveries: 3, badges: 12 }, 'south-entrance': { totalVisitors: 9, currentlyIn: 4, deliveries: 4, badges: 9 }, 'east-wing': { totalVisitors: 6, currentlyIn: 3, deliveries: 2, badges: 6 }, 'west-wing': { totalVisitors: 4, currentlyIn: 2, deliveries: 1, badges: 4 }, 'executive-floor': { totalVisitors: 8, currentlyIn: 1, deliveries: 2, badges: 8 }
  };

  const getLocationIcon = (lid: string) => receptionLocations.find((l: any) => l.id === lid)?.icon || 'ri-map-pin-line';
  const getLocationName = (lid: string) => receptionLocations.find((l: any) => l.id === lid)?.name || lid;
  const getTotalStats = () => {
    if (selectedLocation === 'all') return { totalVisitors: Object.values(locationStats).reduce((s: number, x: any) => s + x.totalVisitors, 0), currentlyIn: Object.values(locationStats).reduce((s: number, x: any) => s + x.currentlyIn, 0), deliveries: Object.values(locationStats).reduce((s: number, x: any) => s + x.deliveries, 0), badges: Object.values(locationStats).reduce((s: number, x: any) => s + x.badges, 0) };
    return locationStats[selectedLocation] || { totalVisitors: 0, currentlyIn: 0, deliveries: 0, badges: 0 };
  };
  const gf = (data: any[]) => selectedLocation === 'all' ? data : data.filter((item: any) => item.location === selectedLocation);
  const cs = getTotalStats();

  return (
    <div className="flex min-h-screen bg-[#030912]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Reception Management" />
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Multi-Location Reception Management</h1>
            <div className="flex items-center space-x-4">
              <button onClick={() => setShowCheckInModal(true)} className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-cyan-400 transition-colors whitespace-nowrap cursor-pointer"><i className="ri-user-add-line mr-2"></i>Check In Visitor</button>
              <button onClick={() => setShowDeliveryModal(true)} className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-400 transition-colors whitespace-nowrap cursor-pointer"><i className="ri-truck-line mr-2"></i>Log Delivery</button>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-white">Reception Locations</h2><div className="flex items-center space-x-2"><i className="ri-filter-line text-gray-500"></i><span className="text-sm text-gray-500">Filter by location</span></div></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
              {receptionLocations.map((loc: any) => (
                <div key={loc.id} className="relative">
                  <button onClick={() => setSelectedLocation(loc.id)} className={`w-full p-3 rounded-lg border transition-all duration-200 ${selectedLocation===loc.id?'border-cyan-500 bg-cyan-500/10 text-cyan-400':'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10'} cursor-pointer`}>
                    <div className="flex flex-col items-center space-y-2"><i className={`${loc.icon} text-xl`}></i><span className="text-sm font-medium text-center">{loc.name}</span>{loc.id!=='all'&&locationStats[loc.id]&&<div className="flex items-center space-x-2 text-xs text-gray-500"><span>{locationStats[loc.id].currentlyIn} active</span></div>}</div>
                  </button>
                  {loc.id!=='all'&&<Link href={`/reception/${loc.id}`} className="absolute bottom-1 right-1 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-400 transition-colors cursor-pointer"><i className="ri-external-link-line text-white text-xs"></i></Link>}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[{icon:'ri-user-line',color:'bg-cyan-500',label:'Total Visitors',val:cs.totalVisitors},{icon:'ri-building-line',color:'bg-emerald-500',label:'In Building',val:cs.currentlyIn},{icon:'ri-truck-line',color:'bg-amber-500',label:"Today's Deliveries",val:cs.deliveries},{icon:'ri-vip-crown-line',color:'bg-violet-500',label:'Badges Issued',val:cs.badges}].map((s:any,i:number)=>(<div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6"><div className="flex items-center justify-between mb-4"><div className={`w-12 h-12 ${s.color} rounded-lg flex items-center justify-center`}><i className={`${s.icon} text-white`}></i></div></div><h3 className="text-sm text-gray-400 mb-1">{s.label}</h3><p className="text-2xl font-bold text-white">{s.val}</p></div>))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl mb-8">
            <div className="border-b border-white/10"><nav className="flex space-x-8 px-6">{['visitors','expected','deliveries'].map((t:string)=>(<button key={t} onClick={()=>setActiveTab(t)} className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${activeTab===t?'border-cyan-500 text-cyan-400':'border-transparent text-gray-500 hover:text-gray-300'}`}>{t==='visitors'?`Current Visitors (${gf(currentVisitors).length})`:t==='expected'?`Expected Visitors (${gf(expectedVisitors).length})`:`Deliveries (${gf(deliveries).length})`}</button>))}</nav></div>
            <div className="p-6">
              {activeTab==='visitors'&&<div className="space-y-4">{gf(currentVisitors).map((v:any)=>(<div key={v.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg"><div className="flex items-center space-x-4"><img src={v.photo} alt={v.name} className="w-12 h-12 rounded-full object-cover object-top" /><div><h4 className="font-medium text-white">{v.name}</h4><p className="text-sm text-gray-400">{v.company}</p><p className="text-xs text-gray-500">Host: {v.host} • {v.purpose}</p></div></div><div className="flex items-center space-x-4"><div className="text-center"><div className="flex items-center justify-center space-x-1 mb-1"><i className={`${getLocationIcon(v.location)} text-gray-500`}></i><span className="text-xs text-gray-500">{v.locationName}</span></div><p className="text-sm font-medium text-gray-300">Badge: {v.badge}</p><p className="text-xs text-gray-500">Check-in: {v.checkIn}</p></div><span className={`px-2 py-1 text-xs font-semibold rounded-full ${v.status==='checked-in'?'bg-emerald-100 text-emerald-700':'bg-cyan-100 text-cyan-700'}`}>{v.status==='checked-in'?'In Lobby':'With Host'}</span><button className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-400 transition-colors whitespace-nowrap cursor-pointer">Check Out</button></div></div>))}</div>}
              {activeTab==='expected'&&<div className="space-y-4">{gf(expectedVisitors).map((v:any)=>(<div key={v.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg"><div className="flex items-center space-x-4"><div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center"><i className="ri-user-line text-cyan-400"></i></div><div><h4 className="font-medium text-white">{v.name}</h4><p className="text-sm text-gray-400">{v.company}</p><p className="text-xs text-gray-500">Host: {v.host} • {v.purpose}</p></div></div><div className="flex items-center space-x-4"><div className="text-center"><div className="flex items-center justify-center space-x-1 mb-1"><i className={`${getLocationIcon(v.location)} text-gray-500`}></i><span className="text-xs text-gray-500">{v.locationName}</span></div><p className="text-sm font-medium text-gray-300">Expected: {v.expectedTime}</p></div><button className="bg-cyan-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-cyan-400 transition-colors whitespace-nowrap cursor-pointer">Check In</button></div></div>))}</div>}
              {activeTab==='deliveries'&&<div className="space-y-4">{gf(deliveries).map((d:any)=>(<div key={d.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg"><div className="flex items-center space-x-4"><div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center"><i className="ri-truck-line text-amber-400"></i></div><div><h4 className="font-medium text-white">{d.carrier}</h4><p className="text-sm text-gray-400">Tracking: {d.tracking}</p><p className="text-xs text-gray-500">For: {d.recipient}</p></div></div><div className="flex items-center space-x-4"><div className="text-center"><div className="flex items-center justify-center space-x-1 mb-1"><i className={`${getLocationIcon(d.location)} text-gray-500`}></i><span className="text-xs text-gray-500">{d.locationName}</span></div><p className="text-sm font-medium text-gray-300">{d.packages} package(s)</p><p className="text-xs text-gray-500">Time: {d.time}</p>{d.signature&&<p className="text-xs text-gray-500">Signed: {d.signature}</p>}</div><span className={`px-2 py-1 text-xs font-semibold rounded-full ${d.status==='delivered'?'bg-emerald-100 text-emerald-700':'bg-amber-100 text-amber-700'}`}>{d.status==='delivered'?'Delivered':'Pending'}</span></div></div>))}</div>}
            </div>
          </div>
        </div>

        {showCheckInModal&&(<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"><div className="bg-[#080f20] border border-white/10 rounded-xl p-6 w-full max-w-md mx-4"><div className="flex items-center justify-between mb-6"><h3 className="text-lg font-semibold text-white">Visitor Check-In</h3><button onClick={()=>setShowCheckInModal(false)} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"><i className="ri-close-line text-gray-400"></i></button></div><form className="space-y-4"><div><label className="block text-sm font-medium text-gray-400 mb-1">Reception Location</label><select className="w-full pr-8 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white">{receptionLocations.filter((l:any)=>l.id!=='all').map((l:any)=>(<option key={l.id} value={l.id}>{l.name}</option>))}</select></div><div><label className="block text-sm font-medium text-gray-400 mb-1">Visitor Name</label><input type="text" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white" placeholder="Enter visitor name" /></div><div><label className="block text-sm font-medium text-gray-400 mb-1">Company</label><input type="text" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white" placeholder="Enter company name" /></div><div><label className="block text-sm font-medium text-gray-400 mb-1">Host Employee</label><input type="text" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white" placeholder="Enter host name" /></div><div><label className="block text-sm font-medium text-gray-400 mb-1">Purpose of Visit</label><input type="text" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white" placeholder="Enter purpose" /></div><div className="flex space-x-3 pt-4"><button type="button" onClick={()=>setShowCheckInModal(false)} className="flex-1 bg-white/10 text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors whitespace-nowrap cursor-pointer">Cancel</button><button type="submit" className="flex-1 bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-cyan-400 transition-colors whitespace-nowrap cursor-pointer">Check In</button></div></form></div></div>)}

        {showDeliveryModal&&(<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"><div className="bg-[#080f20] border border-white/10 rounded-xl p-6 w-full max-w-md mx-4"><div className="flex items-center justify-between mb-6"><h3 className="text-lg font-semibold text-white">Log Delivery</h3><button onClick={()=>setShowDeliveryModal(false)} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"><i className="ri-close-line text-gray-400"></i></button></div><form className="space-y-4"><div><label className="block text-sm font-medium text-gray-400 mb-1">Reception Location</label><select className="w-full pr-8 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white">{receptionLocations.filter((l:any)=>l.id!=='all').map((l:any)=>(<option key={l.id} value={l.id}>{l.name}</option>))}</select></div><div><label className="block text-sm font-medium text-gray-400 mb-1">Carrier</label><select className="w-full pr-8 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white"><option value="">Select carrier</option><option value="fedex">FedEx</option><option value="ups">UPS</option><option value="dhl">DHL</option><option value="usps">USPS</option><option value="other">Other</option></select></div><div><label className="block text-sm font-medium text-gray-400 mb-1">Tracking Number</label><input type="text" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white" placeholder="Enter tracking number" /></div><div><label className="block text-sm font-medium text-gray-400 mb-1">Recipient Department</label><input type="text" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white" placeholder="Enter recipient department" /></div><div><label className="block text-sm font-medium text-gray-400 mb-1">Number of Packages</label><input type="number" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white" placeholder="Enter number of packages" min="1" /></div><div className="flex space-x-3 pt-4"><button type="button" onClick={()=>setShowDeliveryModal(false)} className="flex-1 bg-white/10 text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors whitespace-nowrap cursor-pointer">Cancel</button><button type="submit" className="flex-1 bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-400 transition-colors whitespace-nowrap cursor-pointer">Log Delivery</button></div></form></div></div>)}
      </div>
    </div>
  );
}

export default function ReceptionPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="flex min-h-screen bg-[#030912] items-center justify-center"><i className="ri-loader-4-line animate-spin text-cyan-400 text-3xl"></i></div>}>
        <ReceptionContent />
      </Suspense>
    </AuthGuard>
  );
}