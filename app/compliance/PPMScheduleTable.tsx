'use client';

import { Fragment, useState } from 'react';

const freqColors: Record<string, string> = {
  daily: 'bg-red-100 text-red-700',
  weekly: 'bg-orange-100 text-orange-700',
  monthly: 'bg-blue-100 text-blue-700',
  quarterly: 'bg-purple-100 text-purple-700',
  biannual: 'bg-indigo-100 text-indigo-700',
  annual: 'bg-green-100 text-green-700',
  custom: 'bg-gray-100 text-gray-700',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  paused: 'bg-gray-100 text-gray-600',
  completed: 'bg-blue-100 text-blue-700',
};

export default function PPMScheduleTable({ schedules, onGenerateJob }: { schedules: any[]; onGenerateJob: (s: any) => void }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  const isOverdue = (nextDue: string, status: string) => {
    if (status === 'completed' || status === 'paused') return false;
    return nextDue && new Date(nextDue) < new Date();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-8"></th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Task</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Frequency</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Engineer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Done</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Next Due</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Est. Hours</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {schedules.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-gray-400">No PPM schedules found</td>
              </tr>
            ) : schedules.map(s => (
              <Fragment key={s.id}>
                <tr className={`hover:bg-gray-50/50 transition-colors ${isOverdue(s.next_due, s.status) ? 'bg-red-50/30' : ''}`}>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                      className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <i className={expanded === s.id ? 'ri-arrow-down-s-line text-sm' : 'ri-arrow-right-s-line text-sm'}></i>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-800">{s.title}</p>
                    {s.asset_name && <p className="text-xs text-gray-400 mt-0.5">{s.asset_name}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${freqColors[s.frequency] || 'bg-gray-100 text-gray-600'}`}>
                      {s.frequency}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[isOverdue(s.next_due, s.status) ? 'overdue' : s.status] || 'bg-gray-100 text-gray-600'}`}>
                      {isOverdue(s.next_due, s.status) ? 'Overdue' : s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {s.assigned_engineer ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs">{s.assigned_engineer[0]}</span>
                        </div>
                        <span className="text-sm text-gray-700 whitespace-nowrap">{s.assigned_engineer}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{formatDate(s.last_completed)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm whitespace-nowrap font-medium ${isOverdue(s.next_due, s.status) ? 'text-red-600' : 'text-gray-700'}`}>
                      {isOverdue(s.next_due, s.status) && <i className="ri-alarm-warning-line mr-1 text-xs"></i>}
                      {formatDate(s.next_due)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.estimated_hours}h</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onGenerateJob(s)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 cursor-pointer transition-colors whitespace-nowrap"
                    >
                      <i className="ri-add-line text-xs"></i>Gen Job
                    </button>
                  </td>
                </tr>
                {expanded === s.id && (
                  <tr className="bg-blue-50/30">
                    <td colSpan={9} className="px-8 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 mb-2">Description</p>
                          <p className="text-sm text-gray-700">{s.description || 'No description provided.'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 mb-2">Checklist</p>
                          <div className="space-y-1">
                            {(typeof s.checklist === 'string' ? JSON.parse(s.checklist) : s.checklist || []).map((item: string, i: number) => (
                              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                <i className="ri-checkbox-blank-circle-line text-gray-300 text-xs"></i>
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}