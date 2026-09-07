'use client';

import { useState } from 'react';

interface Booking {
  id: string;
  booking_ref: string;
  space_name: string;
  space_type: string;
  booked_by: string;
  department?: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  purpose?: string;
  attendees: number;
  status: string;
}

interface Props {
  bookings: Booking[];
}

const typeColor: Record<string, string> = {
  hot_desk: 'bg-blue-100 border-blue-300 text-blue-700',
  fixed_desk: 'bg-indigo-100 border-indigo-300 text-indigo-700',
  meeting_room: 'bg-purple-100 border-purple-300 text-purple-700',
  boardroom: 'bg-rose-100 border-rose-300 text-rose-700',
  training_room: 'bg-amber-100 border-amber-300 text-amber-700',
  parking: 'bg-gray-100 border-gray-300 text-gray-700',
  locker: 'bg-teal-100 border-teal-300 text-teal-700',
  equipment: 'bg-orange-100 border-orange-300 text-orange-700',
};

const hours = Array.from({ length: 12 }, (_, i) => i + 7);

export default function SpaceCalendarView({ bookings }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date('2026-05-12'));
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  const getWeekDays = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const weekDays = getWeekDays(currentDate);

  const getBookingsForDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(b => b.booking_date === dateStr && b.status !== 'cancelled');
  };

  const formatDate = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

  const prevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const nextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const isToday = (d: Date) => d.toISOString().split('T')[0] === new Date('2026-05-12').toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i className="ri-calendar-line text-blue-600"></i>
          <span className="font-semibold text-gray-800">Booking Calendar</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button onClick={() => setViewMode('week')} className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer whitespace-nowrap transition-all ${viewMode === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>Week</button>
            <button onClick={() => setViewMode('day')} className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer whitespace-nowrap transition-all ${viewMode === 'day' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>Day</button>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={prevWeek} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer text-gray-500">
              <i className="ri-arrow-left-s-line"></i>
            </button>
            <span className="text-sm font-medium text-gray-700 px-2">
              {weekDays[0].toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – {weekDays[6].toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <button onClick={nextWeek} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer text-gray-500">
              <i className="ri-arrow-right-s-line"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-8 border-b border-gray-100">
            <div className="p-3 text-xs text-gray-400 font-medium border-r border-gray-100">Time</div>
            {weekDays.map(d => (
              <div key={d.toISOString()} className={`p-3 text-center border-r border-gray-100 last:border-r-0 ${isToday(d) ? 'bg-blue-50' : ''}`}>
                <div className={`text-xs font-medium ${isToday(d) ? 'text-blue-600' : 'text-gray-500'}`}>{d.toLocaleDateString('en-GB', { weekday: 'short' })}</div>
                <div className={`text-lg font-bold ${isToday(d) ? 'text-blue-600' : 'text-gray-800'}`}>{d.getDate()}</div>
                <div className="text-xs text-gray-400">{getBookingsForDay(d).length} bookings</div>
              </div>
            ))}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {hours.map(hour => (
              <div key={hour} className="grid grid-cols-8 border-b border-gray-50 min-h-[56px]">
                <div className="p-2 text-xs text-gray-400 border-r border-gray-100 flex items-start pt-2">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                {weekDays.map(d => {
                  const dayBookings = getBookingsForDay(d).filter(b => {
                    const bHour = parseInt(b.start_time?.split(':')[0] || '0');
                    return bHour === hour;
                  });
                  return (
                    <div key={d.toISOString()} className={`p-1 border-r border-gray-50 last:border-r-0 ${isToday(d) ? 'bg-blue-50/30' : ''}`}>
                      {dayBookings.map(b => (
                        <div
                          key={b.id}
                          className={`rounded-md border px-1.5 py-1 mb-1 cursor-pointer hover:opacity-80 transition-opacity ${typeColor[b.space_type] || 'bg-gray-100 border-gray-300 text-gray-700'}`}
                        >
                          <div className="text-xs font-semibold truncate">{b.space_name}</div>
                          <div className="text-xs truncate opacity-75">{b.booked_by}</div>
                          <div className="text-xs opacity-60">{b.start_time?.slice(0,5)} – {b.end_time?.slice(0,5)}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}