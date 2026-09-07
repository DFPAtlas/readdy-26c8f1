'use client';

import SpaceStatusBadge from './SpaceStatusBadge';

interface Space {
  id: string;
  space_id: string;
  name: string;
  type: string;
  floor: string;
  building: string;
  capacity: number;
  status: string;
  features: string[];
  notes?: string;
}

interface Props {
  spaces: Space[];
  onBook: (space: Space) => void;
  onStatusChange: (id: string, status: string) => void;
}

const typeLabel: Record<string, string> = {
  hot_desk: 'Hot Desk',
  fixed_desk: 'Fixed Desk',
  meeting_room: 'Meeting Room',
  boardroom: 'Boardroom',
  training_room: 'Training Room',
  parking: 'Parking',
  locker: 'Locker',
  equipment: 'Equipment',
};

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

const typeColor: Record<string, string> = {
  hot_desk: 'bg-blue-100 text-blue-600',
  fixed_desk: 'bg-indigo-100 text-indigo-600',
  meeting_room: 'bg-purple-100 text-purple-600',
  boardroom: 'bg-rose-100 text-rose-600',
  training_room: 'bg-amber-100 text-amber-600',
  parking: 'bg-gray-100 text-gray-600',
  locker: 'bg-teal-100 text-teal-600',
  equipment: 'bg-orange-100 text-orange-600',
};

export default function SpaceListView({ spaces, onBook, onStatusChange }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Space</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Floor</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Capacity</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Features</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {spaces.map(space => (
              <tr key={space.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${typeColor[space.type] || 'bg-gray-100 text-gray-600'}`}>
                      <i className={`${typeIcon[space.type] || 'ri-map-pin-line'} text-sm`}></i>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{space.name}</div>
                      <div className="text-xs text-gray-400">{space.space_id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{typeLabel[space.type] || space.type}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{space.floor}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <i className="ri-user-line text-gray-400 text-xs"></i>
                    {space.capacity}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(space.features || []).slice(0, 3).map(f => (
                      <span key={f} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md">
                        {f.replace(/_/g, ' ')}
                      </span>
                    ))}
                    {(space.features || []).length > 3 && (
                      <span className="text-xs text-gray-400">+{space.features.length - 3}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <SpaceStatusBadge status={space.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {space.status === 'available' && (
                      <button
                        onClick={() => onBook(space)}
                        className="text-xs bg-blue-600 text-white px-2.5 py-1 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Book
                      </button>
                    )}
                    {space.status === 'cleaning' && (
                      <button
                        onClick={() => onStatusChange(space.id, 'available')}
                        className="text-xs bg-emerald-600 text-white px-2.5 py-1 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Mark Clean
                      </button>
                    )}
                    <button
                      onClick={() => onStatusChange(space.id, 'cleaning')}
                      className="text-xs text-amber-600 hover:text-amber-800 cursor-pointer"
                      title="Mark for cleaning"
                    >
                      <i className="ri-brush-line"></i>
                    </button>
                    <button
                      onClick={() => onStatusChange(space.id, 'out_of_service')}
                      className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                      title="Mark out of service"
                    >
                      <i className="ri-error-warning-line"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {spaces.length === 0 && (
          <div className="py-16 text-center text-gray-400">
            <i className="ri-map-line text-4xl mb-3 block"></i>
            <p>No spaces found</p>
          </div>
        )}
      </div>
    </div>
  );
}