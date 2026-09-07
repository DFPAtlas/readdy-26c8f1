'use client';

import SpaceStatusBadge from './SpaceStatusBadge';

interface Booking {
  id: string;
  booking_ref: string;
  space_name: string;
  space_type: string;
  floor?: string;
  booked_by: string;
  booked_by_email?: string;
  department?: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  purpose?: string;
  attendees: number;
  status: string;
  booking_type: string;
  visitor_name?: string;
  visitor_company?: string;
}

interface Props {
  bookings: Booking[];
  onCancel: (id: string) => void;
  onCheckIn: (id: string) => void;
}

const typeColor: Record<string, string> = {
  single: 'bg-blue-100 text-blue-700',
  recurring: 'bg-purple-100 text-purple-700',
  team: 'bg-indigo-100 text-indigo-700',
  visitor: 'bg-amber-100 text-amber-700',
};

export default function BookingsTable({ bookings, onCancel, onCheckIn }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Ref</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Space</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Booked By</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date & Time</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Purpose</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bookings.map(b => (
              <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <span className="text-xs font-mono font-semibold text-blue-600">{b.booking_ref}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-800">{b.space_name}</div>
                  <div className="text-xs text-gray-400">{b.floor}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-700">{b.booked_by}</div>
                  <div className="text-xs text-gray-400">{b.department}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-700">{new Date(b.booking_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  <div className="text-xs text-gray-400">{b.start_time?.slice(0,5)} – {b.end_time?.slice(0,5)}</div>
                </td>
                <td className="px-4 py-3 max-w-xs">
                  <div className="text-sm text-gray-600 truncate">{b.purpose || '—'}</div>
                  {b.attendees > 1 && <div className="text-xs text-gray-400">{b.attendees} attendees</div>}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor[b.booking_type] || 'bg-gray-100 text-gray-600'}`}>
                    {b.booking_type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <SpaceStatusBadge status={b.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {b.status === 'confirmed' && (
                      <button
                        onClick={() => onCheckIn(b.id)}
                        className="text-xs bg-emerald-600 text-white px-2 py-1 rounded-lg hover:bg-emerald-700 cursor-pointer whitespace-nowrap"
                      >
                        Check In
                      </button>
                    )}
                    {(b.status === 'confirmed' || b.status === 'pending') && (
                      <button
                        onClick={() => onCancel(b.id)}
                        className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                        title="Cancel booking"
                      >
                        <i className="ri-close-circle-line"></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <div className="py-16 text-center text-gray-400">
            <i className="ri-calendar-line text-4xl mb-3 block"></i>
            <p>No bookings found</p>
          </div>
        )}
      </div>
    </div>
  );
}