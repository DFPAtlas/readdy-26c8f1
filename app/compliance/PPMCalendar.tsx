'use client';

import { useState } from 'react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const freqDotColor: Record<string, string> = {
  daily: 'bg-red-400', weekly: 'bg-orange-400', monthly: 'bg-blue-400',
  quarterly: 'bg-purple-400', biannual: 'bg-indigo-400', annual: 'bg-green-400',
};

export default function PPMCalendar({ schedules, complianceRecords }: { schedules: any[]; complianceRecords: any[] }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [calView, setCalView] = useState<'month' | 'week'>('month');

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const getEventsForDay = (day: number) => {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split('T')[0];
    const events: { label: string; color: string; type: string }[] = [];

    schedules.forEach(s => {
      if (s.next_due === dateStr) {
        events.push({ label: s.title, color: freqDotColor[s.frequency] || 'bg-blue-400', type: 'ppm' });
      }
    });

    complianceRecords.forEach(r => {
      if (r.next_inspection_date === dateStr) {
        events.push({ label: r.title, color: 'bg-amber-400', type: 'compliance' });
      }
      if (r.expiry_date === dateStr) {
        events.push({ label: `EXPIRY: ${r.title}`, color: 'bg-red-400', type: 'expiry' });
      }
    });

    return events;
  };

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay() + i);
    return d;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
            <i className="ri-arrow-left-s-line"></i>
          </button>
          <h3 className="font-semibold text-gray-800">{MONTHS[month]} {year}</h3>
          <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
            <i className="ri-arrow-right-s-line"></i>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span>PPM</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span>Inspection</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"></span>Expiry</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button onClick={() => setCalView('month')} className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${calView === 'month' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>Month</button>
            <button onClick={() => setCalView('week')} className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${calView === 'week' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>Week</button>
          </div>
        </div>
      </div>

      {calView === 'month' ? (
        <>
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="min-h-20"></div>)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const events = getEventsForDay(day);
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              return (
                <div key={day} className={`min-h-20 p-1.5 rounded-lg border ${isToday ? 'border-blue-400 bg-blue-50' : 'border-gray-100 hover:bg-gray-50'} transition-colors`}>
                  <span className={`text-xs font-semibold block mb-1 ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>{day}</span>
                  <div className="space-y-0.5">
                    {events.slice(0, 2).map((ev, i) => (
                      <div key={i} className={`flex items-center gap-1 px-1 py-0.5 rounded text-xs text-white ${ev.color} truncate`}>
                        <span className="truncate text-xs leading-tight">{ev.label}</span>
                      </div>
                    ))}
                    {events.length > 2 && <div className="text-xs text-gray-400 pl-1">+{events.length - 2} more</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div>
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div className="text-xs text-gray-400 py-2"></div>
            {weekDays.map(d => (
              <div key={d.toISOString()} className={`text-center py-2 rounded-lg ${d.toDateString() === today.toDateString() ? 'bg-blue-50' : ''}`}>
                <p className="text-xs font-semibold text-gray-500">{DAYS[d.getDay()]}</p>
                <p className={`text-sm font-bold ${d.toDateString() === today.toDateString() ? 'text-blue-600' : 'text-gray-700'}`}>{d.getDate()}</p>
              </div>
            ))}
          </div>
          {['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'].map(time => (
            <div key={time} className="grid grid-cols-8 gap-1 border-t border-gray-50">
              <div className="text-xs text-gray-400 py-2 pr-2 text-right">{time}</div>
              {weekDays.map(d => {
                const dateStr = d.toISOString().split('T')[0];
                const dayEvents = [...schedules.filter(s => s.next_due === dateStr), ...complianceRecords.filter(r => r.next_inspection_date === dateStr)];
                return (
                  <div key={d.toISOString()} className={`min-h-8 p-0.5 ${d.toDateString() === today.toDateString() ? 'bg-blue-50/50' : ''}`}>
                    {time === '09:00' && dayEvents.slice(0, 1).map((ev, i) => (
                      <div key={i} className="bg-blue-500 text-white text-xs px-1.5 py-1 rounded truncate">{ev.title || ev.title}</div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}