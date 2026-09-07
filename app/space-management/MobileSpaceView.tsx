'use client';

import { useState } from 'react';
import SpaceStatusBadge from './SpaceStatusBadge';

interface Space {
  id: string;
  space_id: string;
  name: string;
  type: string;
  floor: string;
  capacity: number;
  status: string;
  features: string[];
}

interface Booking {
  id: string;
  booking_ref: string;
  space_name: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  purpose?: string;
}

interface Props {
  spaces: Space[];
  bookings: Booking[];
  onBook: (space: Space) => void;
}

const typeIcon: Record<string, string> = {
  hot_desk: 'ri-computer-line',
  fixed_desk: 'ri-computer-line',
  meeting_room: 'ri-group-line',
  boardroom: 'ri-building-4-line',
  training_room: 'ri-presentation-line',
  parking: 'ri-car-line',
  locker: 'ri-lock-line',
  equipment: 'ri-tools-line',
};

export default function MobileSpaceView({ spaces, bookings, onBook }: Props) {
  const [activeTab, setActiveTab] = useState<'find' | 'mybookings' | 'qr'>('find');
  const [typeFilter, setTypeFilter] = useState('all');
  const [scanned, setScanned] = useState(false);
  const [scannedSpace, setScannedSpace] = useState<Space | null>(null);

  const types = ['all', 'hot_desk', 'meeting_room', 'parking', 'locker'];
  const typeLabel: Record<string, string> = {
    all: 'All', hot_desk: 'Desks', meeting_room: 'Rooms', parking: 'Parking', locker: 'Lockers',
  };

  const filteredSpaces = spaces.filter(s =>
    (typeFilter === 'all' || s.type === typeFilter) && s.status === 'available'
  );

  const myBookings = bookings.filter(b => b.status !== 'cancelled').slice(0, 5);

  const simulateScan = () => {
    const available = spaces.filter(s => s.status === 'available');
    if (available.length > 0) {
      setScannedSpace(available[Math.floor(Math.random() * available.length)]);
      setScanned(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-sm mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <i className="ri-smartphone-line text-white"></i>
            </div>
            <span className="font-bold text-sm">Space Booking</span>
          </div>
          <div className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Mobile View</div>
        </div>
        <p className="text-xs text-blue-100">Find and book spaces on the go</p>
      </div>

      <div className="flex border-b border-gray-100">
        {[
          { id: 'find', icon: 'ri-search-line', label: 'Find' },
          { id: 'mybookings', icon: 'ri-calendar-check-line', label: 'My Bookings' },
          { id: 'qr', icon: 'ri-qr-code-line', label: 'QR Check-in' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 flex flex-col items-center gap-0.5 text-xs font-medium cursor-pointer transition-colors ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <i className={`${tab.icon} text-base`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4" style={{ minHeight: '400px' }}>
        {activeTab === 'find' && (
          <div>
            <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
              {types.map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer transition-all ${typeFilter === t ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {typeLabel[t]}
                </button>
              ))}
            </div>

            <div className="text-xs text-gray-500 mb-3">{filteredSpaces.length} available spaces</div>

            <div className="space-y-2">
              {filteredSpaces.slice(0, 6).map(space => (
                <div key={space.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white rounded-lg shadow-sm flex items-center justify-center">
                      <i className={`${typeIcon[space.type] || 'ri-map-pin-line'} text-blue-600`}></i>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{space.name}</div>
                      <div className="text-xs text-gray-500">{space.floor} · Cap {space.capacity}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onBook(space)}
                    className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap hover:bg-blue-700"
                  >
                    Book
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'mybookings' && (
          <div>
            <div className="text-xs text-gray-500 mb-3">Your upcoming bookings</div>
            <div className="space-y-3">
              {myBookings.map(b => (
                <div key={b.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-start justify-between mb-1">
                    <div className="text-sm font-semibold text-gray-800">{b.space_name}</div>
                    <SpaceStatusBadge status={b.status} />
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(b.booking_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · {b.start_time?.slice(0,5)} – {b.end_time?.slice(0,5)}
                  </div>
                  {b.purpose && <div className="text-xs text-gray-400 mt-1 truncate">{b.purpose}</div>}
                  {b.status === 'confirmed' && (
                    <button className="mt-2 w-full bg-emerald-600 text-white text-xs py-1.5 rounded-lg cursor-pointer whitespace-nowrap hover:bg-emerald-700">
                      <i className="ri-login-box-line mr-1"></i>Check In
                    </button>
                  )}
                </div>
              ))}
              {myBookings.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <i className="ri-calendar-line text-3xl mb-2 block"></i>
                  <p className="text-sm">No upcoming bookings</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'qr' && (
          <div className="text-center">
            {!scanned ? (
              <div>
                <div className="w-48 h-48 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-gray-300 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 border-2 border-blue-500 rounded-lg relative">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-600 rounded-tl"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-600 rounded-tr"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-600 rounded-bl"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-600 rounded-br"></div>
                    </div>
                  </div>
                  <i className="ri-qr-scan-2-line text-5xl text-gray-300"></i>
                </div>
                <p className="text-sm text-gray-600 mb-4">Point your camera at a space QR code to check in or get details</p>
                <button
                  onClick={simulateScan}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium cursor-pointer whitespace-nowrap hover:bg-blue-700 text-sm"
                >
                  <i className="ri-qr-code-line mr-2"></i>Simulate Scan
                </button>
              </div>
            ) : (
              <div>
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-check-line text-3xl text-emerald-600"></i>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Space Found!</h3>
                {scannedSpace && (
                  <div className="bg-gray-50 rounded-xl p-4 text-left mb-4">
                    <div className="font-semibold text-gray-800">{scannedSpace.name}</div>
                    <div className="text-sm text-gray-500">{scannedSpace.floor} · Cap: {scannedSpace.capacity}</div>
                    <div className="mt-2"><SpaceStatusBadge status={scannedSpace.status} /></div>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => { setScanned(false); setScannedSpace(null); }}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl text-sm cursor-pointer whitespace-nowrap"
                  >
                    Scan Again
                  </button>
                  {scannedSpace?.status === 'available' && (
                    <button
                      onClick={() => { onBook(scannedSpace!); setScanned(false); }}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm cursor-pointer whitespace-nowrap"
                    >
                      Book Now
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}