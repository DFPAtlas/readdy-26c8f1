'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const DEMO_JOBS = [
  { id: 1, job_id: 'WO-2026-001', title: 'HVAC Unit A-201 Fault', type: 'reactive', priority: 'high', status: 'in_progress', due_date: '2026-05-15', client_name: 'Acme Corp', description: 'Loud rattling noise from rooftop HVAC unit. Bearing replacement required.' },
  { id: 4, job_id: 'WO-2026-004', title: 'Emergency - Water Leak Floor 3', type: 'emergency', priority: 'emergency', status: 'in_progress', due_date: '2026-05-12', client_name: 'TechHub Ltd', description: 'Major water leak from burst pipe in 3rd floor server room.' },
  { id: 5, job_id: 'WO-2026-005', title: 'Fire Alarm Panel Fault - Zone 4', type: 'reactive', priority: 'high', status: 'awaiting_parts', due_date: '2026-05-14', client_name: 'TechHub Ltd', description: 'Fire alarm panel showing fault on Zone 4.' },
  { id: 10, job_id: 'WO-2026-010', title: 'Roof Drainage Blockage', type: 'reactive', priority: 'high', status: 'assigned', due_date: '2026-05-13', client_name: 'Acme Corp', description: 'Standing water on flat roof section B. Drain appears blocked.' },
];

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600', medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700', emergency: 'bg-red-100 text-red-700',
};
const statusColors: Record<string, string> = {
  new: 'bg-gray-100 text-gray-600', assigned: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-indigo-100 text-indigo-700', awaiting_parts: 'bg-orange-100 text-orange-700',
  on_hold: 'bg-yellow-100 text-yellow-700', completed: 'bg-green-100 text-green-700',
};

export default function EngineerPage() {
  const [jobs, setJobs] = useState(DEMO_JOBS);
  const [activeJob, setActiveJob] = useState<any>(null);
  const [tab, setTab] = useState('jobs');
  const [note, setNote] = useState('');
  const [checklist, setChecklist] = useState([
    { id: 1, label: 'Safety check completed', done: false },
    { id: 2, label: 'PPE worn', done: false },
    { id: 3, label: 'Area isolated / made safe', done: false },
    { id: 4, label: 'Fault diagnosed', done: false },
    { id: 5, label: 'Repair completed', done: false },
    { id: 6, label: 'System tested and verified', done: false },
    { id: 7, label: 'Area cleaned and restored', done: false },
    { id: 8, label: 'Client informed', done: false },
  ]);
  const [signed, setSigned] = useState(false);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (running) interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [running]);

  const formatTimer = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const handleComplete = async () => {
    if (!activeJob) return;
    try {
      await supabase.from('work_orders').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', activeJob.id);
    } catch {}
    setJobs(prev => prev.map(j => j.id === activeJob.id ? { ...j, status: 'completed' } : j));
    setActiveJob(null);
    setRunning(false);
    setTimer(0);
    setTab('jobs');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col max-w-md mx-auto">
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Link href="/work-orders" className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer">
            <i className="ri-arrow-left-line"></i>
          </Link>
          <div>
            <p className="text-sm font-semibold">Engineer Portal</p>
            <p className="text-xs text-gray-400">Mike Johnson</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-xs text-gray-400">Online</span>
        </div>
      </div>

      <div className="flex border-b border-gray-700">
        {[
          { k: 'jobs', label: 'My Jobs', icon: 'ri-list-check' },
          { k: 'active', label: 'Active Job', icon: 'ri-play-circle-line' },
          { k: 'scan', label: 'Scan QR', icon: 'ri-qr-scan-line' },
        ].map(t => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium cursor-pointer transition-colors ${tab === t.k ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}>
            <i className={`${t.icon} text-lg`}></i>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === 'jobs' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-200">Assigned Jobs ({jobs.filter(j => j.status !== 'completed').length})</p>
            </div>
            {jobs.map(job => (
              <div key={job.id} className={`bg-gray-800 rounded-xl p-4 border ${job.priority === 'emergency' ? 'border-red-500/50' : 'border-gray-700'}`}>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-mono text-gray-400">{job.job_id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[job.priority]}`}>{job.priority}</span>
                </div>
                <p className="text-sm font-semibold text-white mb-1">{job.title}</p>
                <p className="text-xs text-gray-400 mb-3 line-clamp-2">{job.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[job.status] || 'bg-gray-700 text-gray-300'}`}>
                    {job.status?.replace('_', ' ')}
                  </span>
                  <button onClick={() => { setActiveJob(job); setTab('active'); }}
                    className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors whitespace-nowrap">
                    Open Job
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'active' && (
          <div>
            {!activeJob ? (
              <div className="text-center py-12">
                <i className="ri-play-circle-line text-4xl text-gray-600 block mb-3"></i>
                <p className="text-gray-400 text-sm">No active job selected</p>
                <button onClick={() => setTab('jobs')} className="mt-3 text-blue-400 text-sm cursor-pointer">Select a job →</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <p className="text-xs font-mono text-gray-400 mb-1">{activeJob.job_id}</p>
                  <p className="text-sm font-bold text-white mb-1">{activeJob.title}</p>
                  <p className="text-xs text-gray-400">{activeJob.client_name}</p>
                </div>

                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
                  <p className="text-4xl font-mono font-bold text-white mb-3" suppressHydrationWarning={true}>{formatTimer(timer)}</p>
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => setRunning(!running)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-colors whitespace-nowrap ${running ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}`}>
                      <i className={running ? 'ri-pause-line' : 'ri-play-line'}></i>
                      {running ? 'Pause' : 'Start Timer'}
                    </button>
                    <button onClick={() => { setTimer(0); setRunning(false); }}
                      className="px-4 py-2 bg-gray-700 text-gray-300 rounded-xl text-sm font-semibold cursor-pointer hover:bg-gray-600 whitespace-nowrap">
                      Reset
                    </button>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <p className="text-sm font-semibold text-white mb-3">Job Checklist</p>
                  <div className="space-y-2">
                    {checklist.map(item => (
                      <label key={item.id} className="flex items-center gap-3 cursor-pointer">
                        <div onClick={() => setChecklist(prev => prev.map(c => c.id === item.id ? { ...c, done: !c.done } : c))}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${item.done ? 'bg-green-500 border-green-500' : 'border-gray-500'}`}>
                          {item.done && <i className="ri-check-line text-white text-xs"></i>}
                        </div>
                        <span className={`text-sm ${item.done ? 'text-gray-400 line-through' : 'text-gray-200'}`}>{item.label}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-3 bg-gray-700 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full transition-all" style={{ width: `${(checklist.filter(c => c.done).length / checklist.length) * 100}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{checklist.filter(c => c.done).length}/{checklist.length} completed</p>
                </div>

                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <p className="text-sm font-semibold text-white mb-2">Engineer Notes</p>
                  <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} maxLength={500}
                    placeholder="Add notes about the job..."
                    className="w-full bg-gray-700 text-white text-sm px-3 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 resize-none placeholder-gray-500" />
                </div>

                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <p className="text-sm font-semibold text-white mb-3">Client Signature</p>
                  {!signed ? (
                    <div>
                      <div className="bg-white rounded-lg h-24 flex items-center justify-center mb-3 cursor-pointer" onClick={() => setSigned(true)}>
                        <p className="text-gray-400 text-sm">Tap to capture signature</p>
                      </div>
                      <button onClick={() => setSigned(true)} className="w-full py-2 bg-gray-700 text-gray-300 rounded-lg text-sm cursor-pointer hover:bg-gray-600 whitespace-nowrap">
                        Capture Signature
                      </button>
                    </div>
                  ) : (
                    <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3 flex items-center gap-2">
                      <i className="ri-checkbox-circle-fill text-green-400"></i>
                      <span className="text-green-400 text-sm font-medium">Signature captured</span>
                    </div>
                  )}
                </div>

                <button onClick={handleComplete}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 cursor-pointer transition-colors whitespace-nowrap">
                  <i className="ri-checkbox-circle-line mr-2"></i>Mark Job Complete
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'scan' && (
          <div className="text-center py-8">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-4">
              <div className="w-48 h-48 bg-gray-700 rounded-xl mx-auto flex items-center justify-center mb-4 border-2 border-dashed border-gray-500">
                <div className="text-center">
                  <i className="ri-qr-scan-line text-4xl text-gray-400 block mb-2"></i>
                  <p className="text-xs text-gray-500">Camera viewfinder</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-4">Point camera at asset QR code to instantly open the asset profile and linked work orders.</p>
              <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm cursor-pointer hover:bg-blue-700 transition-colors whitespace-nowrap">
                <i className="ri-camera-line mr-2"></i>Open Camera
              </button>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-left">
              <p className="text-sm font-semibold text-white mb-2">Recent Scans</p>
              {[
                { id: 'AST-001', name: 'HVAC Unit A-201', location: 'Roof Level, Building A' },
                { id: 'AST-005', name: 'Fire Alarm Panel', location: 'Ground Floor, Zone 4' },
              ].map(a => (
                <div key={a.id} className="flex items-center gap-3 py-2 border-b border-gray-700 last:border-0">
                  <div className="w-8 h-8 bg-blue-900/50 rounded-lg flex items-center justify-center">
                    <i className="ri-qr-code-line text-blue-400 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-sm text-white">{a.name}</p>
                    <p className="text-xs text-gray-400">{a.id} · {a.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}