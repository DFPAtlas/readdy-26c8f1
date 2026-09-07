'use client';

import { useState } from 'react';
import DTStatusBadge from './DTStatusBadge';

interface AssetPoint {
  id: number;
  label: string;
  asset_type: string;
  status: string;
  last_service: string;
  next_service: string;
  notes: string;
  x_pos: number;
  y_pos: number;
}

interface Props {
  asset: AssetPoint;
  onClose: () => void;
}

const mockHistory = [
  { date: '2026-03-15', type: 'Planned Service', engineer: 'James Wilson', notes: 'Annual service completed. Filters replaced, belts checked.', status: 'completed' },
  { date: '2025-12-10', type: 'Reactive Repair', engineer: 'Sarah Chen', notes: 'Thermostat fault diagnosed and replaced.', status: 'completed' },
  { date: '2025-09-05', type: 'Inspection', engineer: 'Mike Torres', notes: 'Quarterly inspection. All readings within normal range.', status: 'completed' },
  { date: '2025-06-20', type: 'Planned Service', engineer: 'James Wilson', notes: 'Semi-annual service. Coils cleaned, refrigerant checked.', status: 'completed' },
];

const mockJobs = [
  { id: 'WO-2847', title: 'Vibration investigation', priority: 'high', status: 'in_progress', engineer: 'James Wilson', due: '2026-05-14' },
  { id: 'WO-2901', title: 'Quarterly inspection', priority: 'medium', status: 'new', engineer: 'Unassigned', due: '2026-06-01' },
];

const aiRecs = [
  'Schedule bearing inspection within 7 days based on vibration pattern',
  'Consider replacing drive belt at next service — 18 months since last replacement',
  'Review filter replacement schedule — current interval may be insufficient for occupancy levels',
  'Asset approaching 20-year lifecycle — begin capital replacement planning',
];

export default function AssetDetailModal({ asset, onClose }: Props) {
  const [tab, setTab] = useState<'overview' | 'history' | 'jobs' | 'docs' | 'ai'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'ri-information-line' },
    { id: 'history', label: 'Service History', icon: 'ri-history-line' },
    { id: 'jobs', label: 'Open Jobs', icon: 'ri-tools-line' },
    { id: 'docs', label: 'Documents', icon: 'ri-file-list-line' },
    { id: 'ai', label: 'AI Insights', icon: 'ri-sparkling-2-line' },
  ] as const;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">{asset.label}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500 capitalize">{asset.asset_type.replace('_', ' ')}</span>
              <DTStatusBadge status={asset.status} />
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer rounded-lg hover:bg-gray-100">
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        <div className="flex border-b border-gray-100 px-5 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-3 text-sm font-medium border-b-2 whitespace-nowrap cursor-pointer transition-colors ${tab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <i className={t.icon}></i>
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Asset Type', value: asset.asset_type.replace('_', ' ') },
                  { label: 'Current Status', value: <DTStatusBadge status={asset.status} /> },
                  { label: 'Last Service', value: asset.last_service || '—' },
                  { label: 'Next Service', value: asset.next_service || '—' },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                    <div className="text-sm font-semibold text-gray-800 capitalize">{item.value}</div>
                  </div>
                ))}
              </div>
              {asset.notes && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <div className="text-xs font-medium text-amber-700 mb-1">Notes</div>
                  <div className="text-sm text-amber-800">{asset.notes}</div>
                </div>
              )}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <div className="text-xs font-medium text-blue-700 mb-2">Compliance Status</div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-sm text-blue-800">Gas Safety Certificate — Valid until Sep 2026</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-sm text-blue-800">HVAC Inspection — Valid until Jun 2026</span>
                </div>
              </div>
            </div>
          )}

          {tab === 'history' && (
            <div className="space-y-3">
              {mockHistory.map((h, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-800">{h.type}</span>
                    <span className="text-xs text-gray-400">{h.date}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-1">Engineer: {h.engineer}</div>
                  <div className="text-xs text-gray-600">{h.notes}</div>
                </div>
              ))}
            </div>
          )}

          {tab === 'jobs' && (
            <div className="space-y-3">
              {mockJobs.map((j, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-blue-600">{j.id}</span>
                    <DTStatusBadge status={j.priority} />
                  </div>
                  <div className="text-sm font-semibold text-gray-800 mb-1">{j.title}</div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span><i className="ri-user-line mr-1"></i>{j.engineer}</span>
                    <span><i className="ri-calendar-line mr-1"></i>Due {j.due}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'docs' && (
            <div className="space-y-2">
              {['Gas Safety Certificate 2025.pdf', 'HVAC Service Report Mar 2026.pdf', 'Installation Manual.pdf', 'Risk Assessment.pdf'].map((doc, i) => (
                <div key={i} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer">
                  <div className="w-8 h-8 flex items-center justify-center bg-red-50 rounded-lg">
                    <i className="ri-file-pdf-line text-red-500"></i>
                  </div>
                  <span className="text-sm text-gray-700 flex-1">{doc}</span>
                  <i className="ri-download-line text-gray-400"></i>
                </div>
              ))}
            </div>
          )}

          {tab === 'ai' && (
            <div className="space-y-3">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <i className="ri-sparkling-2-line text-purple-600"></i>
                  <span className="text-sm font-semibold text-purple-800">AI Recommendations</span>
                </div>
                <div className="space-y-2">
                  {aiRecs.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 flex items-center justify-center bg-purple-100 rounded-full text-xs text-purple-700 font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                      <span className="text-sm text-gray-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="text-xs font-semibold text-amber-700 mb-1">Predicted Failure Risk</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-amber-200 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                  <span className="text-sm font-bold text-amber-700">42% — Medium</span>
                </div>
                <div className="text-xs text-amber-600 mt-1">Based on age, fault history, and service frequency</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}