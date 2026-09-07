'use client';

import { useState, useEffect, Suspense } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const demoEvents = [
  { id: '1', title: 'Q1 All-Hands Meeting', description: 'Quarterly company-wide meeting with leadership updates', location: 'Main Auditorium - Building A', start_time: '2024-02-05T09:00:00Z', end_time: '2024-02-05T11:00:00Z', status: 'Scheduled', attendees: 250, created_at: '2024-01-15' },
  { id: '2', title: 'Fire Safety Drill', description: 'Mandatory building evacuation drill for all occupants', location: 'All Buildings', start_time: '2024-02-08T14:00:00Z', end_time: '2024-02-08T15:00:00Z', status: 'Scheduled', attendees: 800, created_at: '2024-01-18' },
  { id: '3', title: 'Board of Directors Meeting', description: 'Monthly board meeting with financial review', location: 'Executive Conference Room - Floor 15', start_time: '2024-01-30T10:00:00Z', end_time: '2024-01-30T13:00:00Z', status: 'Scheduled', attendees: 12, created_at: '2024-01-10' },
  { id: '4', title: 'New Employee Orientation', description: 'Onboarding session for January new hires', location: 'Training Room B - Floor 3', start_time: '2024-01-29T09:00:00Z', end_time: '2024-01-29T16:00:00Z', status: 'Scheduled', attendees: 15, created_at: '2024-01-12' },
  { id: '5', title: 'IT Infrastructure Maintenance Window', description: 'Scheduled server maintenance and network upgrades', location: 'Data Center - Building B', start_time: '2024-02-03T22:00:00Z', end_time: '2024-02-04T06:00:00Z', status: 'Scheduled', attendees: 5, created_at: '2024-01-20' },
  { id: '6', title: 'Vendor Expo & Networking', description: 'Annual vendor showcase and networking event', location: 'Main Lobby & Conference Center', start_time: '2024-02-15T10:00:00Z', end_time: '2024-02-15T17:00:00Z', status: 'Scheduled', attendees: 120, created_at: '2024-01-08' },
  { id: '7', title: 'Safety Training Workshop', description: 'OSHA compliance training for maintenance staff', location: 'Training Room A - Floor 3', start_time: '2024-01-26T09:00:00Z', end_time: '2024-01-26T12:00:00Z', status: 'Completed', attendees: 28, created_at: '2024-01-05' },
  { id: '8', title: 'Holiday Party Planning Committee', description: 'Planning meeting for upcoming company celebration', location: 'Meeting Room 4A - Floor 4', start_time: '2024-02-01T15:00:00Z', end_time: '2024-02-01T16:30:00Z', status: 'Scheduled', attendees: 8, created_at: '2024-01-22' },
  { id: '9', title: 'HVAC System Upgrade Kickoff', description: 'Project kickoff for Building B HVAC modernization', location: 'Conference Room 5B - Floor 5', start_time: '2024-02-10T10:00:00Z', end_time: '2024-02-10T12:00:00Z', status: 'Scheduled', attendees: 18, created_at: '2024-01-19' },
  { id: '10', title: 'Emergency Response Team Drill', description: 'Quarterly emergency response simulation exercise', location: 'Building A - All Floors', start_time: '2024-01-24T13:00:00Z', end_time: '2024-01-24T15:00:00Z', status: 'Completed', attendees: 35, created_at: '2024-01-02' },
];

function EventsContent() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<typeof demoEvents>([]);
  const [filteredEvents, setFilteredEvents] = useState<typeof demoEvents>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    start_time: '',
    end_time: '',
    status: 'Scheduled',
    attendees: 0
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, filterStatus]);

  const fetchEvents = () => {
    setLoading(true);
    setEvents(demoEvents);
    setLoading(false);
  };

  const filterEvents = () => {
    let filtered = [...events];

    if (searchTerm) {
      filtered = filtered.filter((event: any) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'All') {
      filtered = filtered.filter((event: any) => event.status === filterStatus);
    }

    setFilteredEvents(filtered);
  };

  const handleCreateEvent = (e: any) => {
    e.preventDefault();
    const newEvent = { ...formData, id: String(Date.now()), created_at: new Date().toISOString() };
    setEvents((prev: any) => [newEvent, ...prev]);
    setShowCreateModal(false);
    setFormData({ title: '', description: '', location: '', start_time: '', end_time: '', status: 'Scheduled', attendees: 0 });
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev: any) => prev.filter((e: any) => e.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'In Progress':
        return 'bg-green-100 text-green-700';
      case 'Completed':
        return 'bg-gray-100 text-gray-700';
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
        <TopBar title="Events" />
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Events</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-cyan-400 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-add-line mr-2"></i>Create Event
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
                  placeholder="Search events..."
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
                  <option>Scheduled</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <i className="ri-loader-4-line text-4xl text-cyan-500 animate-spin"></i>
                <p className="mt-4 text-gray-500">Loading events...</p>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendees</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredEvents.length > 0 ? (
                      filteredEvents.map((event: any) => (
                        <tr key={event.id} className="hover:bg-white/5">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <i className="ri-calendar-event-line text-gray-500 mr-2"></i>
                              <span className="text-sm font-medium text-white">{event.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{event.location}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formatDateTime(event.start_time)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formatDateTime(event.end_time)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{event.attendees}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                              {event.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-red-400 hover:text-red-300 cursor-pointer"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                          No events found
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
                <h3 className="text-lg font-semibold text-white">Create Event</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-300 cursor-pointer"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateEvent} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Event Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                    required
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
                      <option>Scheduled</option>
                      <option>In Progress</option>
                      <option>Completed</option>
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
                  Create Event
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

export default function EventsPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="flex min-h-screen bg-[#030912] items-center justify-center"><i className="ri-loader-4-line animate-spin text-cyan-400 text-3xl"></i></div>}>
        <EventsContent />
      </Suspense>
    </AuthGuard>
  );
}