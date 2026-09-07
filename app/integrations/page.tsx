'use client';

import { useState, Suspense } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

function IntegrationsContent() {
  const [activeTab, setActiveTab] = useState('connected');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const connectedIntegrations = [
    { name: 'Honeywell Building Management', type: 'Building Automation', status: 'Connected', lastSync: '2024-01-22 14:30', dataPoints: 247, icon: 'ri-building-line', settings: { syncInterval: '5 minutes', endpoint: 'https://api.honeywell.com/v1', apiKey: 'hwy_****_****_****_1234', alertsEnabled: true, dataRetention: '30 days' } },
    { name: 'Schneider Electric HVAC', type: 'HVAC System', status: 'Connected', lastSync: '2024-01-22 14:28', dataPoints: 89, icon: 'ri-temp-cold-line', settings: { syncInterval: '10 minutes', endpoint: 'https://api.schneider-electric.com/v2', apiKey: 'se_****_****_****_5678', alertsEnabled: true, dataRetention: '60 days' } },
    { name: 'Siemens Security Suite', type: 'Security System', status: 'Connected', lastSync: '2024-01-22 14:25', dataPoints: 156, icon: 'ri-shield-check-line', settings: { syncInterval: '1 minute', endpoint: 'https://api.siemens.com/security/v1', apiKey: 'si_****_****_****_9012', alertsEnabled: true, dataRetention: '90 days' } },
    { name: 'SAP ERP Integration', type: 'ERP System', status: 'Connected', lastSync: '2024-01-22 14:20', dataPoints: 1247, icon: 'ri-database-2-line', settings: { syncInterval: '30 minutes', endpoint: 'https://api.sap.com/erp/v3', apiKey: 'sap_****_****_****_3456', alertsEnabled: false, dataRetention: '365 days' } }
  ];

  const availableIntegrations = [
    { name: 'Microsoft Outlook Calendar', type: 'Calendar Application', description: 'Sync maintenance schedules and meeting room bookings', complexity: 'Easy', icon: 'ri-calendar-line' },
    { name: 'Johnson Controls OpenBlue', type: 'Building Automation', description: 'Connect building systems and IoT sensors', complexity: 'Medium', icon: 'ri-building-2-line' },
    { name: 'Oracle NetSuite', type: 'ERP System', description: 'Financial and procurement integration', complexity: 'Complex', icon: 'ri-calculator-line' },
    { name: 'Bosch Security Systems', type: 'Security System', description: 'Access control and surveillance integration', complexity: 'Medium', icon: 'ri-camera-line' }
  ];

  const iotSensors = [
    { id: 'TEMP-001', name: 'Temperature Sensor - Floor 1', type: 'Temperature', location: 'Building A - Floor 1', status: 'Online', lastReading: '22.5°C', battery: '89%' },
    { id: 'HUM-001', name: 'Humidity Sensor - Server Room', type: 'Humidity', location: 'Building A - Server Room', status: 'Online', lastReading: '45%', battery: '76%' },
    { id: 'MOT-001', name: 'Motion Detector - Lobby', type: 'Motion', location: 'Building A - Lobby', status: 'Online', lastReading: 'No Motion', battery: '92%' },
    { id: 'LEAK-001', name: 'Water Leak Detector', type: 'Water Leak', location: 'Building A - Basement', status: 'Offline', lastReading: 'No Leak', battery: '23%' }
  ];

  const gs = (s: string) => { switch(s){case'Connected':case'Online':return'bg-emerald-100 text-emerald-700';case'Disconnected':case'Offline':return'bg-red-100 text-red-700';case'Syncing':return'bg-amber-100 text-amber-700';default:return'bg-gray-100 text-gray-700';} };
  const gc = (c: string) => { switch(c){case'Easy':return'bg-emerald-100 text-emerald-700';case'Medium':return'bg-amber-100 text-amber-700';case'Complex':return'bg-red-100 text-red-700';default:return'bg-gray-100 text-gray-700';} };

  const handleSettingsSubmit = async (e: any) => {
    e.preventDefault(); setIsSubmitting(true); setSubmitStatus(null);
    const fd = new FormData(e.target);
    const fv: any = { syncInterval: fd.get('syncInterval'), endpoint: fd.get('endpoint'), apiKey: fd.get('apiKey'), dataRetention: fd.get('dataRetention'), alertsEnabled: fd.get('alertsEnabled') === 'on' ? 'Yes' : 'No', integrationName: selectedIntegration?.name || '', integrationType: selectedIntegration?.type || '' };
    try {
      const r = await fetch('https://readdy.ai/api/form/d22if9ovuutsmm8o5a7g', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(fv).toString() });
      if (r.ok) { setSubmitStatus('success'); setTimeout(() => { setShowSettingsModal(false); setSelectedIntegration(null); setSubmitStatus(null); }, 2000); } else throw new Error('Failed');
    } catch { setSubmitStatus('error'); }
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen bg-[#030912]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="System Integrations" />
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">System Integrations</h1>
            <div className="flex items-center space-x-4">
              <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-cyan-400 transition-colors whitespace-nowrap cursor-pointer"><i className="ri-refresh-line mr-2"></i>Sync All</button>
              <button className="bg-white/10 text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors whitespace-nowrap cursor-pointer"><i className="ri-settings-line mr-2"></i>Settings</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[{icon:'ri-links-line',color:'bg-emerald-500',label:'Connected Systems',val:'12'},{icon:'ri-radar-line',color:'bg-cyan-500',label:'IoT Sensors',val:'47'},{icon:'ri-bar-chart-line',color:'bg-violet-500',label:'Data Points',val:'1,847'},{icon:'ri-heart-pulse-line',color:'bg-amber-500',label:'System Health',val:'98.5%'}].map((s:any,i:number)=>(<div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-400 mb-1">{s.label}</p><p className="text-2xl font-bold text-white">{s.val}</p></div><div className={`w-12 h-12 ${s.color} rounded-lg flex items-center justify-center`}><i className={`${s.icon} text-white`}></i></div></div></div>))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl mb-8">
            <div className="border-b border-white/10"><nav className="flex space-x-8 px-6">{['connected','available','iot'].map((t:string)=>(<button key={t} onClick={()=>setActiveTab(t)} className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${activeTab===t?'border-cyan-500 text-cyan-400':'border-transparent text-gray-500 hover:text-gray-300'}`}>{t==='connected'?'Connected Systems':t==='available'?'Available Integrations':'IoT Sensors'}</button>))}</nav></div>
            <div className="p-6">
              {activeTab==='connected'&&<div className="space-y-4">{connectedIntegrations.map((int:any,i:number)=>(<div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg"><div className="flex items-center space-x-4"><div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/20 rounded-lg flex items-center justify-center"><i className={`${int.icon} text-cyan-400`}></i></div><div><h3 className="font-medium text-white">{int.name}</h3><p className="text-sm text-gray-500">{int.type}</p></div></div><div className="flex items-center space-x-6"><div className="text-right"><p className="text-sm text-gray-500">Last Sync</p><p className="text-sm font-medium text-gray-400">{int.lastSync}</p></div><div className="text-right"><p className="text-sm text-gray-500">Data Points</p><p className="text-sm font-medium text-gray-400">{int.dataPoints}</p></div><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${gs(int.status)}`}>{int.status}</span><button onClick={()=>{setSelectedIntegration(int);setShowSettingsModal(true);}} className="text-gray-500 hover:text-gray-300 cursor-pointer"><i className="ri-settings-line"></i></button></div></div>))}</div>}
              {activeTab==='available'&&<div className="grid grid-cols-1 md:grid-cols-2 gap-6">{availableIntegrations.map((int:any,i:number)=>(<div key={i} className="p-6 bg-white/5 border border-white/10 rounded-lg"><div className="flex items-center justify-between mb-4"><div className="flex items-center space-x-3"><div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center"><i className={`${int.icon} text-gray-400`}></i></div><div><h3 className="font-medium text-white">{int.name}</h3><p className="text-sm text-gray-500">{int.type}</p></div></div><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${gc(int.complexity)}`}>{int.complexity}</span></div><p className="text-sm text-gray-400 mb-4">{int.description}</p><button className="w-full bg-cyan-500 text-white py-2 rounded-lg font-medium hover:bg-cyan-400 transition-colors cursor-pointer">Connect Integration</button></div>))}</div>}
              {activeTab==='iot'&&<div className="space-y-4">{iotSensors.map((s:any,i:number)=>(<div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg"><div className="flex items-center space-x-4"><div className="w-12 h-12 bg-violet-500/20 border border-violet-500/20 rounded-lg flex items-center justify-center"><i className="ri-sensor-line text-violet-400"></i></div><div><h3 className="font-medium text-white">{s.name}</h3><p className="text-sm text-gray-500">{s.id} • {s.location}</p></div></div><div className="flex items-center space-x-6"><div className="text-right"><p className="text-sm text-gray-500">Type</p><p className="text-sm font-medium text-gray-400">{s.type}</p></div><div className="text-right"><p className="text-sm text-gray-500">Last Reading</p><p className="text-sm font-medium text-gray-400">{s.lastReading}</p></div><div className="text-right"><p className="text-sm text-gray-500">Battery</p><p className="text-sm font-medium text-gray-400">{s.battery}</p></div><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${gs(s.status)}`}>{s.status}</span></div></div>))}</div>}
            </div>
          </div>
        </div>
      </div>

      {showSettingsModal&&selectedIntegration&&(
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#080f20] border border-white/10 rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-white/10"><div className="flex items-center justify-between"><div className="flex items-center space-x-3"><div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center"><i className={`${selectedIntegration.icon} text-cyan-400`}></i></div><div><h3 className="text-lg font-semibold text-white">Integration Settings</h3><p className="text-sm text-gray-500">{selectedIntegration.name}</p></div></div><button onClick={()=>setShowSettingsModal(false)} className="text-gray-500 hover:text-gray-300 cursor-pointer"><i className="ri-close-line"></i></button></div></div>
            <form data-readdy-form onSubmit={handleSettingsSubmit} className="p-6"><div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-400 mb-2">Sync Interval</label><select name="syncInterval" required defaultValue={selectedIntegration.settings.syncInterval} className="w-full pr-8 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-white">{['1 minute','5 minutes','10 minutes','30 minutes','1 hour'].map((opt:string)=>(<option key={opt} value={opt}>{opt}</option>))}</select></div>
              <div><label className="block text-sm font-medium text-gray-400 mb-2">API Endpoint</label><input type="url" name="endpoint" required defaultValue={selectedIntegration.settings.endpoint} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-white" placeholder="https://api.example.com" /></div>
              <div><label className="block text-sm font-medium text-gray-400 mb-2">API Key</label><input type="password" name="apiKey" required defaultValue={selectedIntegration.settings.apiKey} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-white" /></div>
              <div><label className="block text-sm font-medium text-gray-400 mb-2">Data Retention</label><select name="dataRetention" required defaultValue={selectedIntegration.settings.dataRetention} className="w-full pr-8 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-white">{['7 days','30 days','60 days','90 days','1 year'].map((opt:string)=>(<option key={opt} value={opt}>{opt}</option>))}</select></div>
              <div className="flex items-center"><input type="checkbox" name="alertsEnabled" defaultChecked={selectedIntegration.settings.alertsEnabled} className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500" /><label className="ml-2 text-sm text-gray-400">Enable alerts and notifications</label></div>
              <input type="hidden" name="integrationName" value={selectedIntegration.name} /><input type="hidden" name="integrationType" value={selectedIntegration.type} />
            </div>
            {submitStatus==='success'&&<div className="mt-4 p-3 bg-emerald-100 border border-emerald-400 text-emerald-700 rounded-lg"><div className="flex items-center"><i className="ri-check-line mr-2"></i>Settings saved successfully!</div></div>}
            {submitStatus==='error'&&<div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg"><div className="flex items-center"><i className="ri-error-warning-line mr-2"></i>Failed to save settings. Please try again.</div></div>}
            <div className="flex space-x-3 mt-6"><button type="submit" disabled={isSubmitting} className="flex-1 bg-cyan-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-cyan-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">{isSubmitting?<><i className="ri-loader-4-line animate-spin mr-2"></i>Saving...</>:'Save Settings'}</button><button type="button" onClick={()=>setShowSettingsModal(false)} disabled={isSubmitting} className="flex-1 bg-white/10 text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-white/20 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">Cancel</button></div></form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function IntegrationsPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="flex min-h-screen bg-[#030912] items-center justify-center"><i className="ri-loader-4-line animate-spin text-cyan-400 text-3xl"></i></div>}>
        <IntegrationsContent />
      </Suspense>
    </AuthGuard>
  );
}