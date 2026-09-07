'use client';

import { useState } from 'react';

const ENGINEERS = [
  { name: 'Mike Johnson', skills: ['HVAC', 'Plumbing', 'General'], jobs: 4, hours: 28, available: true },
  { name: 'Sarah Chen', skills: ['Fire Safety', 'Electrical', 'Emergency Lighting'], jobs: 3, hours: 18, available: true },
  { name: 'Tom Wilson', skills: ['Gas Safety', 'Boilers', 'Plumbing'], jobs: 5, hours: 32, available: false },
  { name: 'Alex Davis', skills: ['Access Control', 'CCTV', 'Lifts'], jobs: 3, hours: 22, available: true },
  { name: 'Emma Roberts', skills: ['Electrical', 'PAT Testing', 'General'], jobs: 2, hours: 14, available: true },
];

const PENDING_JOBS = [
  { id: 'WO-2026-006', title: 'Lift B Quarterly Maintenance', priority: 'medium', type: 'planned', skills: ['Lifts'], suggestedEngineer: 'Alex Davis', sla: '3 days' },
  { id: 'WO-2026-009', title: 'Generator Monthly Test', priority: 'medium', type: 'inspection', skills: ['Electrical'], suggestedEngineer: 'Emma Roberts', sla: '2 days' },
  { id: 'WO-2026-013', title: 'Electrical Distribution Board Service', priority: 'high', type: 'planned', skills: ['Electrical'], suggestedEngineer: 'Sarah Chen', sla: '5 days' },
];

export default function AISmartScheduling() {
  const [scheduling, setScheduling] = useState(false);
  const [scheduled, setScheduled] = useState(false);

  const handleAutoSchedule = async () => {
    setScheduling(true);
    await new Promise(r => setTimeout(r, 2000));
    setScheduled(true);
    setScheduling(false);
  };

  const priorityColor: Record<string, string> = {
    low: 'bg-gray-100 text-gray-600', medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700', emergency: 'bg-red-100 text-red-700',
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <i className="ri-calendar-check-line text-indigo-600 text-sm"></i>
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">AI Smart Scheduling</p>
            <p className="text-xs text-gray-400">Auto-assign engineers to jobs</p>
          </div>
        </div>
        <button onClick={handleAutoSchedule} disabled={scheduling}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 cursor-pointer disabled:opacity-50 whitespace-nowrap">
          {scheduling ? <><i className="ri-loader-4-line animate-spin"></i> Scheduling...</> : <><i className="ri-sparkling-line"></i> Auto Schedule</>}
        </button>
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 mb-2">Engineer Workload</p>
        <div className="space-y-2">
          {ENGINEERS.map(eng => (
            <div key={eng.name} className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-medium">{eng.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-medium text-gray-700 truncate">{eng.name}</span>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{eng.jobs} jobs · {eng.hours}h</span>
                </div>
                <div className="bg-gray-100 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${eng.hours > 30 ? 'bg-red-400' : eng.hours > 20 ? 'bg-amber-400' : 'bg-green-400'}`}
                    style={{ width: `${Math.min(100, (eng.hours / 40) * 100)}%` }}></div>
                </div>
              </div>
              <span className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${eng.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {eng.available ? 'Free' : 'Busy'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">Unassigned Jobs — AI Suggestions</p>
        <div className="space-y-2">
          {PENDING_JOBS.map(job => (
            <div key={job.id} className={`p-2.5 rounded-xl border ${scheduled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{job.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">SLA: {job.sla}</p>
                </div>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${priorityColor[job.priority]}`}>{job.priority}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <i className={`${scheduled ? 'ri-checkbox-circle-fill text-green-500' : 'ri-sparkling-line text-indigo-500'} text-xs`}></i>
                <span className="text-xs text-gray-600">
                  {scheduled ? `✓ Assigned to ${job.suggestedEngineer}` : `AI suggests: ${job.suggestedEngineer}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}