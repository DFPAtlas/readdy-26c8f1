'use client';

import { useState, useEffect, Suspense } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { supabase } from '@/lib/supabase';

const demoBookings = [
  { id: '1', space_name: 'Conference Room A - Floor 5', booked_by: 'Sarah Johnson', start_time: '2024-01-28T09:00:00Z', end_time: '2024-01-28T10:30:00Z', purpose: 'Weekly team standup and sprint planning session', status: 'Confirmed', attendees: 12, created_at: '2024-01-20' },
  { id: '2', space_name: 'Board Room - Floor 15', booked_by: 'David Wilson', start_time: '2024-01-28T14:00:00Z', end_time: '2024-01-28T17:00:00Z', purpose: 'Quarterly financial review with executive team', status: 'Confirmed', attendees: 8, created_at: '2024-01-18' },
  { id: '3', space_name: 'Training Room B - Floor 3', booked_by: 'Lisa Wang', start_time: '2024-01-29T09:00:00Z', end_time: '2024-01-29T16:00:00Z', purpose: 'New employee safety orientation and onboarding', status: 'Confirmed', attendees: 15, created_at: '2024-01-22' },
  { id: '4', space_name: 'Meeting Room 4A - Floor 4', booked_by: 'Mike Johnson', start_time: '2024-01-28T11:00:00Z', end_time: '2024-01-28T12:00:00Z', purpose: 'Vendor contract negotiation meeting', status: 'Pending', attendees: 5, created_at: '2024-01-24' },
  { id: '5', space_name: 'Innovation Lab - Floor 8', booked_by: 'Alex Davis', start_time: '2024-01-30T10:00:00Z', end_time: '2024-01-30T15:00:00Z', purpose: 'IoT sensor prototype testing and demonstration', status: 'Confirmed', attendees: 10, created_at: '2024-01-19' },
  { id: '6', space_name: 'Conference Room B - Floor 5', booked_by: 'Jennifer Lee', start_time: '2024-01-28T15:00:00Z', end_time: '2024-01-28T16:00:00Z', purpose: 'Client presentation and project proposal review', status: 'Confirmed', attendees: 6, created_at: '2024-01-23' },
  { id: '7', space_name: 'Auditorium - Floor 1', booked_by: 'Robert Martinez', start_time: '2024-02-05T09:00:00Z', end_time: '2024-02-05T11:00:00Z', purpose: 'Q1 All-Hands company meeting', status: 'Confirmed', attendees: 250, created_at: '2024-01-15' },
  { id: '8', space_name: 'Huddle Room 2 - Floor 6', booked_by: 'Emily Thompson', start_time: '2024-01-29T13:00:00Z', end_time: '2024-01-29T14:00:00Z', purpose: 'One-on-one performance review discussion', status: 'Pending', attendees: 2, created_at: '2024-01-25' },
  { id: '9', space_name: 'Workshop Area - Floor 2', booked_by: 'Tom Wilson', start_time: '2024-01-31T08:00:00Z', end_time: '2024-01-31T12:00:00Z', purpose: 'Equipment maintenance training for new technicians', status: 'Confirmed', attendees: 8, created_at: '2024-01-21' },
  { id: '10', space_name: 'Executive Lounge - Floor 15', booked_by: 'Maria Garcia', start_time: '2024-02-01T17:00:00Z', end_time: '2024-02-01T19:00:00Z', purpose: 'Client appreciation networking reception', status: 'Cancelled', attendees: 30, created_at: '2024-01-16' },
  { id: '11', space_name: 'Conference Room C - Floor 7', booked_by: 'Kevin Park', start_time: '2024-01-29T10:00:00Z', end_time: '2024-01-29T11:30:00Z', purpose: 'IT infrastructure upgrade planning session', status: 'Confirmed', attendees: 7, created_at: '2024-01-24' },
  { id: '12', space_name: 'Training Room A - Floor 3', booked_by: 'Sarah Chen', start_time: '2024-02-02T09:00:00Z', end_time: '2024-02-02T12:00:00Z', purpose: 'Security awareness and emergency response training', status: 'Confirmed', attendees: 20, created_at: '2024-01-20' },
];

function SpaceContent() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    space_name: '',
    booked_by: '',
    start_time: '',
    end_time: '',
    purpose: '',
    status: 'Confirmed',
    attendees: 0
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, filterStatus]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('space_bookings')
        .select('*')
        .order('start_time', { ascending: true });

      setBookings((!error && data && data.length > 0) ? data : demoBookings);
    } catch {
      setBookings(demoBookings);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    if (searchTerm) {
      filtered = filtered.filter((booking: any) =>
        booking.space_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.booked_by?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.purpose?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'All') {
      filtered = filtered.filter((booking: any) => booking.status === filterStatus);
    }

    setFilteredBookings(filtered);
  };

  const handleCreateBooking = async (e: any) => {
    e.preventDefault();
    const newBooking = { ...formData, id: String(Date.now()) };
    try {
      await supabase.from('space_bookings').insert([formData]);
    } catch {}
    setBookings((prev: any) => [newBooking, ...prev]);
    setShowCreateModal(false);
    setFormData({ space_name: '', booked_by: '', start_time: '', end_time: '', purpose: '', status: 'Confirmed', attendees: 0 });
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      await supabase.from('space_bookings').delete().eq('id', id);
    } catch {}
    setBookings((prev: any) => prev.filter((b: any) => b.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex min-h-screen bg-[#030912]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Space Management" />
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Space Management</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-cyan-400 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-add-line mr-2"></i>Book Space
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search bookings..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-white pr-8"
                >
                  <option>All</option>
                  <option>Confirmed</option>
                  <option>Pending</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <i className="ri-loader-4-line text-4xl text-cyan-500 animate-spin"></i>
                <p className="mt-4 text-gray-500">Loading bookings...</p>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Space Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booked By</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendees</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((booking: any) => (
                        <tr key={booking.id} className="hover:bg-white/5">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <i className="ri-map-pin-line text-gray-500 mr-2"></i>
                              <span className="text-sm font-medium text-white">{booking.space_name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{booking.booked_by}</td>
                          <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">{booking.purpose}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formatDateTime(booking.start_time)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formatDateTime(booking.end_time)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{booking.attendees}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleDeleteBooking(booking.id)}
                              className="text-red-400 hover:text-red-300 cursor-pointer"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                          No bookings found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#080f20] border border-white/10 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Book Space</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-300 cursor-pointer"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateBooking} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Space Name</label>
                  <input
                    type="text"
                    value={formData.space_name}
                    onChange={(e) => setFormData({ ...formData, space_name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                    placeholder="e.g., Conference Room A"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Booked By</label>
                  <input
                    type="text"
                    value={formData.booked_by}
                    onChange={(e) => setFormData({ ...formData, booked_by: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Purpose</label>
                  <textarea
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Start Time</label>
                    <input
                      type="datetime-local"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">End Time</label>
                    <input
                      type="datetime-local"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Expected Attendees</label>
                    <input
                      type="number"
                      value={formData.attendees}
                      onChange={(e) => setFormData({ ...formData, attendees: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white pr-8"
                    >
                      <option>Confirmed</option>
                      <option>Pending</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-cyan-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-cyan-400 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Book Space
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-white/10 text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-white/20 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SpacePage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="flex min-h-screen bg-[#030912] items-center justify-center"><i className="ri-loader-4-line animate-spin text-cyan-400 text-3xl"></i></div>}>
        <SpaceContent />
      </Suspense>
    </AuthGuard>
  );
}