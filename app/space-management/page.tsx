'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';
import { supabase } from '@/lib/supabase';
import SpaceOccupancyWidgets from './SpaceOccupancyWidgets';
import FloorPlanView from './FloorPlanView';
import SpaceCalendarView from './SpaceCalendarView';
import SpaceListView from './SpaceListView';
import BookingsTable from './BookingsTable';
import CreateBookingModal from './CreateBookingModal';
import MobileSpaceView from './MobileSpaceView';

const demoSpaces = [
  { id: 's1', space_id: 'DSK-001', name: 'Desk A1', type: 'hot_desk', floor: 'Floor 2', building: 'Main Building', capacity: 1, status: 'available', features: ['dual_monitors','docking_station','window_seat'], coordinates: { x: 120, y: 80 }, notes: 'Corner window desk' },
  { id: 's2', space_id: 'DSK-002', name: 'Desk A2', type: 'hot_desk', floor: 'Floor 2', building: 'Main Building', capacity: 1, status: 'booked', features: ['standing_desk','docking_station'], coordinates: { x: 200, y: 80 }, notes: null },
  { id: 's3', space_id: 'DSK-003', name: 'Desk A3', type: 'hot_desk', floor: 'Floor 2', building: 'Main Building', capacity: 1, status: 'available', features: ['dual_monitors','quiet_zone'], coordinates: { x: 280, y: 80 }, notes: null },
  { id: 's4', space_id: 'DSK-004', name: 'Desk A4', type: 'hot_desk', floor: 'Floor 2', building: 'Main Building', capacity: 1, status: 'cleaning', features: ['accessible_desk','docking_station'], coordinates: { x: 360, y: 80 }, notes: null },
  { id: 's5', space_id: 'DSK-005', name: 'Desk B1', type: 'hot_desk', floor: 'Floor 2', building: 'Main Building', capacity: 1, status: 'available', features: ['dual_monitors','window_seat'], coordinates: { x: 120, y: 160 }, notes: null },
  { id: 's6', space_id: 'DSK-006', name: 'Desk B2', type: 'hot_desk', floor: 'Floor 2', building: 'Main Building', capacity: 1, status: 'booked', features: ['standing_desk','dual_monitors'], coordinates: { x: 200, y: 160 }, notes: null },
  { id: 's7', space_id: 'DSK-007', name: 'Desk B3', type: 'fixed_desk', floor: 'Floor 2', building: 'Main Building', capacity: 1, status: 'reserved', features: ['dual_monitors','docking_station','quiet_zone'], coordinates: { x: 280, y: 160 }, notes: 'Reserved for Sarah Johnson' },
  { id: 's8', space_id: 'DSK-008', name: 'Desk B4', type: 'hot_desk', floor: 'Floor 2', building: 'Main Building', capacity: 1, status: 'available', features: ['docking_station'], coordinates: { x: 360, y: 160 }, notes: null },
  { id: 's9', space_id: 'DSK-009', name: 'Desk C1', type: 'hot_desk', floor: 'Floor 3', building: 'Main Building', capacity: 1, status: 'available', features: ['dual_monitors','window_seat'], coordinates: { x: 120, y: 80 }, notes: null },
  { id: 's10', space_id: 'DSK-010', name: 'Desk C2', type: 'hot_desk', floor: 'Floor 3', building: 'Main Building', capacity: 1, status: 'available', features: ['standing_desk'], coordinates: { x: 200, y: 80 }, notes: null },
  { id: 's11', space_id: 'MR-001', name: 'Meeting Room Alpha', type: 'meeting_room', floor: 'Floor 3', building: 'Main Building', capacity: 8, status: 'available', features: ['tv_screen','video_conferencing','whiteboard','air_conditioning'], coordinates: { x: 450, y: 100 }, notes: 'Main meeting room' },
  { id: 's12', space_id: 'MR-002', name: 'Meeting Room Beta', type: 'meeting_room', floor: 'Floor 3', building: 'Main Building', capacity: 6, status: 'booked', features: ['tv_screen','whiteboard'], coordinates: { x: 450, y: 200 }, notes: null },
  { id: 's13', space_id: 'MR-003', name: 'Meeting Room Gamma', type: 'meeting_room', floor: 'Floor 4', building: 'Main Building', capacity: 4, status: 'available', features: ['tv_screen','video_conferencing'], coordinates: { x: 450, y: 100 }, notes: 'Small team room' },
  { id: 's14', space_id: 'BR-001', name: 'Boardroom Executive', type: 'boardroom', floor: 'Floor 15', building: 'Main Building', capacity: 20, status: 'available', features: ['tv_screen','video_conferencing','whiteboard','catering_support','air_conditioning'], coordinates: { x: 300, y: 150 }, notes: 'Executive boardroom' },
  { id: 's15', space_id: 'TR-001', name: 'Training Room A', type: 'training_room', floor: 'Floor 3', building: 'Main Building', capacity: 30, status: 'available', features: ['tv_screen','whiteboard','catering_support','air_conditioning'], coordinates: { x: 200, y: 300 }, notes: 'Full training suite' },
  { id: 's16', space_id: 'TR-002', name: 'Training Room B', type: 'training_room', floor: 'Floor 3', building: 'Main Building', capacity: 20, status: 'out_of_service', features: ['tv_screen','whiteboard'], coordinates: { x: 350, y: 300 }, notes: 'Under refurbishment' },
  { id: 's17', space_id: 'PKG-001', name: 'Parking Bay A1', type: 'parking', floor: 'Ground', building: 'Car Park', capacity: 1, status: 'available', features: ['ev_charging'], coordinates: { x: 100, y: 50 }, notes: 'EV charging point' },
  { id: 's18', space_id: 'PKG-002', name: 'Parking Bay A2', type: 'parking', floor: 'Ground', building: 'Car Park', capacity: 1, status: 'booked', features: [], coordinates: { x: 150, y: 50 }, notes: null },
  { id: 's19', space_id: 'PKG-003', name: 'Parking Bay B1', type: 'parking', floor: 'Ground', building: 'Car Park', capacity: 1, status: 'available', features: ['accessible'], coordinates: { x: 100, y: 100 }, notes: 'Accessible parking' },
  { id: 's20', space_id: 'LCK-001', name: 'Locker 101', type: 'locker', floor: 'Floor 1', building: 'Main Building', capacity: 1, status: 'available', features: ['large_size'], coordinates: { x: 50, y: 200 }, notes: null },
  { id: 's21', space_id: 'LCK-002', name: 'Locker 102', type: 'locker', floor: 'Floor 1', building: 'Main Building', capacity: 1, status: 'reserved', features: [], coordinates: { x: 80, y: 200 }, notes: null },
  { id: 's22', space_id: 'EQ-001', name: 'Projector Unit 1', type: 'equipment', floor: 'Floor 1', building: 'Main Building', capacity: 1, status: 'available', features: ['4k','wireless'], coordinates: { x: 200, y: 400 }, notes: 'Portable 4K projector' },
  { id: 's23', space_id: 'EQ-002', name: 'Video Conf Kit 1', type: 'equipment', floor: 'Floor 1', building: 'Main Building', capacity: 1, status: 'booked', features: ['camera','microphone'], coordinates: { x: 250, y: 400 }, notes: 'Logitech Rally kit' },
];

const demoBookings = [
  { id: 'b1', booking_ref: 'BK-0001', space_id: 's2', space_name: 'Desk A2', space_type: 'hot_desk', floor: 'Floor 2', booked_by: 'James Carter', booked_by_email: 'j.carter@company.com', department: 'Engineering', booking_date: '2026-05-12', start_time: '09:00', end_time: '17:00', purpose: 'Full day hot desk', attendees: 1, status: 'confirmed', booking_type: 'single' },
  { id: 'b2', booking_ref: 'BK-0002', space_id: 's6', space_name: 'Desk B2', space_type: 'hot_desk', floor: 'Floor 2', booked_by: 'Emma Wilson', booked_by_email: 'e.wilson@company.com', department: 'Marketing', booking_date: '2026-05-12', start_time: '08:30', end_time: '13:00', purpose: 'Morning work session', attendees: 1, status: 'confirmed', booking_type: 'single' },
  { id: 'b3', booking_ref: 'BK-0003', space_id: 's11', space_name: 'Meeting Room Alpha', space_type: 'meeting_room', floor: 'Floor 3', booked_by: 'Sarah Johnson', booked_by_email: 's.johnson@company.com', department: 'Operations', booking_date: '2026-05-12', start_time: '10:00', end_time: '11:30', purpose: 'Sprint planning meeting', attendees: 8, status: 'confirmed', booking_type: 'single' },
  { id: 'b4', booking_ref: 'BK-0004', space_id: 's12', space_name: 'Meeting Room Beta', space_type: 'meeting_room', floor: 'Floor 3', booked_by: 'David Chen', booked_by_email: 'd.chen@company.com', department: 'Finance', booking_date: '2026-05-12', start_time: '14:00', end_time: '16:00', purpose: 'Budget review Q2', attendees: 6, status: 'checked_in', booking_type: 'single' },
  { id: 'b5', booking_ref: 'BK-0005', space_id: 's14', space_name: 'Boardroom Executive', space_type: 'boardroom', floor: 'Floor 15', booked_by: 'Michael Torres', booked_by_email: 'm.torres@company.com', department: 'Executive', booking_date: '2026-05-13', start_time: '09:00', end_time: '12:00', purpose: 'Board strategy session', attendees: 15, status: 'confirmed', booking_type: 'single' },
  { id: 'b6', booking_ref: 'BK-0006', space_id: 's15', space_name: 'Training Room A', space_type: 'training_room', floor: 'Floor 3', booked_by: 'Lisa Park', booked_by_email: 'l.park@company.com', department: 'HR', booking_date: '2026-05-14', start_time: '09:00', end_time: '17:00', purpose: 'New hire onboarding day', attendees: 25, status: 'confirmed', booking_type: 'team' },
  { id: 'b7', booking_ref: 'BK-0007', space_id: 's18', space_name: 'Parking Bay A2', space_type: 'parking', floor: 'Ground', booked_by: 'Robert Adams', booked_by_email: 'r.adams@company.com', department: 'Sales', booking_date: '2026-05-12', start_time: '08:00', end_time: '18:00', purpose: 'Client visit parking', attendees: 1, status: 'confirmed', booking_type: 'visitor' },
  { id: 'b8', booking_ref: 'BK-0008', space_id: 's13', space_name: 'Meeting Room Gamma', space_type: 'meeting_room', floor: 'Floor 4', booked_by: 'Anna Bell', booked_by_email: 'a.bell@company.com', department: 'Design', booking_date: '2026-05-12', start_time: '11:00', end_time: '12:00', purpose: 'Design review session', attendees: 4, status: 'pending', booking_type: 'single' },
  { id: 'b9', booking_ref: 'BK-0009', space_id: 's1', space_name: 'Desk A1', space_type: 'hot_desk', floor: 'Floor 2', booked_by: 'Tom Hughes', booked_by_email: 't.hughes@company.com', department: 'IT', booking_date: '2026-05-13', start_time: '09:00', end_time: '17:00', purpose: 'Remote work day', attendees: 1, status: 'confirmed', booking_type: 'single' },
  { id: 'b10', booking_ref: 'BK-0010', space_id: 's11', space_name: 'Meeting Room Alpha', space_type: 'meeting_room', floor: 'Floor 3', booked_by: 'Claire Fox', booked_by_email: 'c.fox@company.com', department: 'Legal', booking_date: '2026-05-13', start_time: '14:00', end_time: '15:30', purpose: 'Contract review', attendees: 5, status: 'confirmed', booking_type: 'single' },
];

type Tab = 'overview' | 'floorplan' | 'calendar' | 'spaces' | 'bookings' | 'mobile';

export default function SpaceManagementPage() {
  const [spaces, setSpaces] = useState<any[]>(demoSpaces);
  const [bookings, setBookings] = useState<any[]>(demoBookings);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [preselectedSpace, setPreselectedSpace] = useState<any>(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [{ data: spacesData }, { data: bookingsData }] = await Promise.all([
        supabase.from('spaces').select('*').order('space_id'),
        supabase.from('space_bookings').select('*').order('booking_date'),
      ]);
      if (spacesData && spacesData.length > 0) setSpaces(spacesData);
      if (bookingsData && bookingsData.length > 0) setBookings(bookingsData);
    } catch {}
    setLoading(false);
  };

  const handleBook = (space: any) => {
    setPreselectedSpace(space);
    setShowBookingModal(true);
  };

  const handleBookingCreated = (booking: any) => {
    setBookings(prev => [booking, ...prev]);
    setSpaces(prev => prev.map(s => s.id === booking.space_id ? { ...s, status: 'booked' } : s));
    showNotification(`Booking ${booking.booking_ref} confirmed for ${booking.space_name}`);
  };

  const handleStatusChange = async (id: string, status: string) => {
    setSpaces(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    try {
      await supabase.from('spaces').update({ status }).eq('id', id);
    } catch {}
    showNotification(`Space status updated to ${status.replace('_', ' ')}`);
  };

  const handleCancelBooking = async (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    try {
      await supabase.from('space_bookings').update({ status: 'cancelled' }).eq('id', id);
    } catch {}
    showNotification('Booking cancelled');
  };

  const handleCheckIn = async (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'checked_in' } : b));
    try {
      await supabase.from('space_bookings').update({ status: 'checked_in', checked_in_at: new Date().toISOString() }).eq('id', id);
    } catch {}
    showNotification('Checked in successfully');
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const filteredSpaces = spaces.filter(s => {
    const matchType = typeFilter === 'all' || s.type === typeFilter;
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchSearch = !searchTerm || s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.space_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  const filteredBookings = bookings.filter(b => {
    const matchSearch = !searchTerm || b.space_name.toLowerCase().includes(searchTerm.toLowerCase()) || b.booked_by.toLowerCase().includes(searchTerm.toLowerCase()) || b.booking_ref.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: 'overview', icon: 'ri-dashboard-line', label: 'Overview' },
    { id: 'floorplan', icon: 'ri-map-2-line', label: 'Floor Plan' },
    { id: 'calendar', icon: 'ri-calendar-line', label: 'Calendar' },
    { id: 'spaces', icon: 'ri-layout-grid-line', label: 'All Spaces' },
    { id: 'bookings', icon: 'ri-bookmark-line', label: 'Bookings' },
    { id: 'mobile', icon: 'ri-smartphone-line', label: 'Mobile View' },
  ];

  const spaceTypes = ['all', 'hot_desk', 'fixed_desk', 'meeting_room', 'boardroom', 'training_room', 'parking', 'locker', 'equipment'];
  const typeLabel: Record<string, string> = {
    all: 'All Types', hot_desk: 'Hot Desks', fixed_desk: 'Fixed Desks', meeting_room: 'Meeting Rooms',
    boardroom: 'Boardrooms', training_room: 'Training Rooms', parking: 'Parking', locker: 'Lockers', equipment: 'Equipment',
  };

  return (
    <AuthGuard>
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Space & Desk Booking</h1>
              <p className="text-sm text-gray-500 mt-0.5">Manage hot desks, meeting rooms, parking, and shared spaces</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
                <i className="ri-search-line text-gray-400 text-sm"></i>
                <input
                  type="text"
                  placeholder="Search spaces or bookings..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="text-sm outline-none w-48 text-gray-700 placeholder-gray-400"
                />
              </div>
              <button
                onClick={() => { setPreselectedSpace(null); setShowBookingModal(true); }}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 text-sm"
              >
                <i className="ri-add-line"></i>New Booking
              </button>
            </div>
          </div>

          <SpaceOccupancyWidgets spaces={spaces} bookings={bookings} />

          <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 mb-6 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
              >
                <i className={tab.icon}></i>
                {tab.label}
              </button>
            ))}
          </div>

          {(activeTab === 'spaces' || activeTab === 'bookings') && (
            <div className="flex gap-3 mb-4 flex-wrap">
              {activeTab === 'spaces' && (
                <div className="flex gap-1.5 flex-wrap">
                  {spaceTypes.map(t => (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap transition-all ${typeFilter === t ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}
                    >
                      {typeLabel[t]}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-1.5 flex-wrap">
                {['all', 'available', 'booked', 'reserved', 'out_of_service', 'cleaning'].map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap transition-all capitalize ${statusFilter === s ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'}`}
                  >
                    {s === 'all' ? 'All Status' : s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FloorPlanView spaces={spaces} onBook={handleBook} />
              </div>
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <i className="ri-time-line text-blue-600"></i>Today's Activity
                  </h3>
                  <div className="space-y-3">
                    {bookings.filter(b => b.booking_date === '2026-05-12' && b.status !== 'cancelled').slice(0, 5).map(b => (
                      <div key={b.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-800 truncate">{b.space_name}</div>
                          <div className="text-xs text-gray-500">{b.booked_by} · {b.start_time?.slice(0,5)}–{b.end_time?.slice(0,5)}</div>
                        </div>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${b.status === 'checked_in' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                          {b.status === 'checked_in' ? 'In' : 'Conf'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <i className="ri-pie-chart-line text-purple-600"></i>Space Utilisation
                  </h3>
                  {[
                    { label: 'Hot Desks', used: spaces.filter(s => s.type === 'hot_desk' && s.status === 'booked').length, total: spaces.filter(s => s.type === 'hot_desk').length, color: 'bg-blue-500' },
                    { label: 'Meeting Rooms', used: spaces.filter(s => s.type === 'meeting_room' && s.status === 'booked').length, total: spaces.filter(s => s.type === 'meeting_room').length, color: 'bg-purple-500' },
                    { label: 'Parking', used: spaces.filter(s => s.type === 'parking' && s.status === 'booked').length, total: spaces.filter(s => s.type === 'parking').length, color: 'bg-amber-500' },
                  ].map(item => (
                    <div key={item.label} className="mb-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{item.label}</span>
                        <span>{item.used}/{item.total}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: item.total > 0 ? `${(item.used / item.total) * 100}%` : '0%' }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-4 text-white">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <i className="ri-sparkling-2-line"></i>AI Insight
                  </h3>
                  <p className="text-sm text-blue-100 leading-relaxed">Floor 2 is at 62% capacity today. Meeting Room Alpha has 3 back-to-back bookings. Consider opening Training Room B for overflow meetings.</p>
                  <div className="mt-3 flex gap-2">
                    <div className="bg-white/20 rounded-lg px-2 py-1 text-xs">Peak: 10am–2pm</div>
                    <div className="bg-white/20 rounded-lg px-2 py-1 text-xs">Trend: +12% vs last week</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'floorplan' && (
            <FloorPlanView spaces={spaces} onBook={handleBook} />
          )}

          {activeTab === 'calendar' && (
            <SpaceCalendarView bookings={bookings} />
          )}

          {activeTab === 'spaces' && (
            <SpaceListView spaces={filteredSpaces} onBook={handleBook} onStatusChange={handleStatusChange} />
          )}

          {activeTab === 'bookings' && (
            <BookingsTable bookings={filteredBookings} onCancel={handleCancelBooking} onCheckIn={handleCheckIn} />
          )}

          {activeTab === 'mobile' && (
            <div className="flex justify-center py-4">
              <MobileSpaceView spaces={spaces} bookings={bookings} onBook={handleBook} />
            </div>
          )}
        </div>
      </div>

      {showBookingModal && (
        <CreateBookingModal
          spaces={spaces}
          preselectedSpace={preselectedSpace}
          onClose={() => { setShowBookingModal(false); setPreselectedSpace(null); }}
          onCreated={handleBookingCreated}
        />
      )}

      {notification && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 z-50 text-sm">
          <i className="ri-check-line text-emerald-400"></i>
          {notification}
        </div>
      )}
    </div>
    </AuthGuard>
  );
}