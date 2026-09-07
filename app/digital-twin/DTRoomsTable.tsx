'use client';

interface Room {
  id: number;
  name: string;
  room_type: string;
  department: string;
  capacity: number;
  area_sqm: number;
  occupancy_current: number;
  temperature: number;
  humidity: number;
  air_quality_index: number;
  status: string;
}

interface Props {
  rooms: Room[];
}

function AQIBadge({ aqi }: { aqi: number }) {
  const color = aqi >= 90 ? 'text-green-700 bg-green-100' : aqi >= 75 ? 'text-amber-700 bg-amber-100' : 'text-red-700 bg-red-100';
  const label = aqi >= 90 ? 'Excellent' : aqi >= 75 ? 'Good' : 'Poor';
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>{label} ({aqi})</span>;
}

function OccupancyBar({ current, capacity }: { current: number; capacity: number }) {
  const pct = capacity > 0 ? Math.round((current / capacity) * 100) : 0;
  const color = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-green-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }}></div>
      </div>
      <span className="text-xs text-gray-500 whitespace-nowrap">{current}/{capacity}</span>
    </div>
  );
}

export default function DTRoomsTable({ rooms }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">Room Management</h3>
        <p className="text-sm text-gray-500 mt-0.5">Live sensor data and occupancy for all monitored rooms</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Room</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Type</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Department</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Occupancy</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Temp</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Humidity</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Air Quality</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Area</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room, i) => (
              <tr key={room.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{room.name}</td>
                <td className="px-4 py-3 text-xs text-gray-500 capitalize">{room.room_type.replace('_', ' ')}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{room.department}</td>
                <td className="px-4 py-3 min-w-32">
                  <OccupancyBar current={room.occupancy_current} capacity={room.capacity} />
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-semibold ${room.temperature > 24 ? 'text-red-600' : room.temperature < 19 ? 'text-blue-600' : 'text-green-600'}`}>
                    {room.temperature}°C
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{room.humidity}%</td>
                <td className="px-4 py-3">
                  <AQIBadge aqi={room.air_quality_index} />
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{room.area_sqm} m²</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}