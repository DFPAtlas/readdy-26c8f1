'use client';

import DTStatusBadge from './DTStatusBadge';

interface DTEvent {
  id: number;
  event_type: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  created_at: string;
}

interface Props {
  events: DTEvent[];
}

const eventTypeIcons: Record<string, string> = {
  fault: 'ri-error-warning-line',
  alert: 'ri-alarm-warning-line',
  warning: 'ri-alert-line',
  maintenance: 'ri-tools-line',
  info: 'ri-information-line',
};

const eventTypeColors: Record<string, string> = {
  fault: 'text-red-600 bg-red-50',
  alert: 'text-amber-600 bg-amber-50',
  warning: 'text-orange-600 bg-orange-50',
  maintenance: 'text-blue-600 bg-blue-50',
  info: 'text-gray-600 bg-gray-50',
};

export default function DTEventsPanel({ events }: Props) {
  const open = events.filter(e => e.status === 'open');
  const resolved = events.filter(e => e.status === 'resolved');

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live Events</div>
        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">{open.length} open</span>
      </div>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {open.map(ev => (
          <div key={ev.id} className={`p-3 rounded-xl border ${ev.severity === 'high' ? 'border-red-200 bg-red-50' : ev.severity === 'medium' ? 'border-amber-200 bg-amber-50' : 'border-blue-200 bg-blue-50'}`}>
            <div className="flex items-start gap-2">
              <div className={`w-6 h-6 flex items-center justify-center rounded-lg flex-shrink-0 ${eventTypeColors[ev.event_type] || eventTypeColors.info}`}>
                <i className={`${eventTypeIcons[ev.event_type] || 'ri-information-line'} text-xs`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-gray-800 leading-tight">{ev.title}</div>
                <div className="text-xs text-gray-500 mt-0.5 leading-tight">{ev.description}</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <DTStatusBadge status={ev.severity} />
                </div>
              </div>
            </div>
          </div>
        ))}
        {resolved.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-400 mb-2">Recently Resolved</div>
            {resolved.map(ev => (
              <div key={ev.id} className="p-2 rounded-lg bg-gray-50 border border-gray-100 mb-1">
                <div className="text-xs text-gray-500 line-through">{ev.title}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}