'use client';

const SUGGESTIONS = [
  { label: 'Overdue jobs', query: 'Show overdue work orders', icon: 'ri-alarm-warning-line', color: 'text-red-500' },
  { label: 'Emergency jobs', query: 'Show emergency jobs still open', icon: 'ri-fire-line', color: 'text-orange-500' },
  { label: 'Compliance expiry', query: 'What compliance certificates expire this month?', icon: 'ri-shield-check-line', color: 'text-amber-500' },
  { label: 'Risk score', query: 'Show AI risk assessment', icon: 'ri-bar-chart-line', color: 'text-blue-500' },
  { label: 'Engineer activity', query: 'Summarise this week\'s engineer activity', icon: 'ri-user-settings-line', color: 'text-purple-500' },
  { label: 'Fault diagnosis', query: 'Boiler pressure dropping', icon: 'ri-tools-line', color: 'text-green-500' },
  { label: 'Predict failures', query: 'Which assets are likely to fail soon?', icon: 'ri-cpu-line', color: 'text-indigo-500' },
  { label: 'PPM schedule', query: 'Show maintenance plan and PPM schedule', icon: 'ri-calendar-check-line', color: 'text-teal-500' },
];

export default function AISuggestions({ onSelect }: { onSelect: (q: string) => void }) {
  return (
    <div className="px-3 pb-2">
      <p className="text-xs text-gray-400 mb-2 px-1">Quick questions:</p>
      <div className="flex flex-wrap gap-1.5">
        {SUGGESTIONS.map(s => (
          <button key={s.label} onClick={() => onSelect(s.query)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-full text-xs text-gray-600 hover:text-blue-700 cursor-pointer transition-colors whitespace-nowrap">
            <i className={`${s.icon} ${s.color} text-xs`}></i>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}