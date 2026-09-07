'use client';

interface Space {
  id: string;
  status: string;
  type: string;
  capacity: number;
}

interface Booking {
  status: string;
  booking_date: string;
  start_time: string;
  end_time: string;
}

interface Props {
  spaces: Space[];
  bookings: Booking[];
}

export default function SpaceOccupancyWidgets({ spaces, bookings }: Props) {
  const totalSpaces = spaces.length;
  const available = spaces.filter(s => s.status === 'available').length;
  const booked = spaces.filter(s => s.status === 'booked').length;
  const outOfService = spaces.filter(s => s.status === 'out_of_service').length;
  const cleaning = spaces.filter(s => s.status === 'cleaning').length;
  const occupancyPct = totalSpaces > 0 ? Math.round((booked / totalSpaces) * 100) : 0;

  const desks = spaces.filter(s => s.type === 'hot_desk' || s.type === 'fixed_desk');
  const availableDesks = desks.filter(s => s.status === 'available').length;

  const rooms = spaces.filter(s => ['meeting_room','boardroom','training_room'].includes(s.type));
  const busyRooms = rooms.filter(s => s.status === 'booked').length;

  const todayBookings = bookings.filter(b => {
    const today = new Date().toISOString().split('T')[0];
    return b.booking_date === today && b.status !== 'cancelled';
  }).length;

  const widgets = [
    {
      label: 'Live Occupancy',
      value: `${occupancyPct}%`,
      sub: `${booked} of ${totalSpaces} spaces in use`,
      icon: 'ri-pulse-line',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      bar: occupancyPct,
      barColor: 'bg-blue-500',
    },
    {
      label: 'Available Desks',
      value: availableDesks,
      sub: `${desks.length} total desks`,
      icon: 'ri-computer-line',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Busy Meeting Rooms',
      value: busyRooms,
      sub: `${rooms.length} total rooms`,
      icon: 'ri-group-line',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: "Today's Bookings",
      value: todayBookings,
      sub: 'Active reservations today',
      icon: 'ri-calendar-check-line',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      label: 'Cleaning Required',
      value: cleaning,
      sub: 'Spaces awaiting cleaning',
      icon: 'ri-brush-line',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Out of Service',
      value: outOfService,
      sub: 'Spaces unavailable',
      icon: 'ri-error-warning-line',
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {widgets.map((w) => (
        <div key={w.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className={`w-9 h-9 ${w.bg} rounded-lg flex items-center justify-center mb-3`}>
            <i className={`${w.icon} ${w.color} text-lg`}></i>
          </div>
          <div className={`text-2xl font-bold ${w.color} mb-0.5`}>{w.value}</div>
          <div className="text-xs font-medium text-gray-700 mb-0.5">{w.label}</div>
          <div className="text-xs text-gray-400">{w.sub}</div>
          {w.bar !== undefined && (
            <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full ${w.barColor} rounded-full`} style={{ width: `${w.bar}%` }}></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}