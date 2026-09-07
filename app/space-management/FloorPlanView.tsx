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
  coordinates: { x: number; y: number };
  notes?: string;
}

interface Props {
  spaces: Space[];
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

const statusDot: Record<string, string> = {
  available: 'bg-emerald-400',
  booked: 'bg-blue-400',
  reserved: 'bg-purple-400',
  out_of_service: 'bg-red-400',
  cleaning: 'bg-amber-400',
};

const floors = ['Floor 2', 'Floor 3', 'Floor 4', 'Floor 15', 'Ground'];

export default function FloorPlanView({ spaces, onBook }: Props) {
  const [selectedFloor, setSelectedFloor] = useState('Floor 2');
  const [hoveredSpace, setHoveredSpace] = useState<Space | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const floorSpaces = spaces.filter(s => s.floor === selectedFloor);

  const handleMouseEnter = (space: Space, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const container = (e.currentTarget as HTMLElement).closest('.floor-plan-container')?.getBoundingClientRect();
    if (container) {
      setTooltipPos({ x: rect.left - container.left + 30, y: rect.top - container.top });
    }
    setHoveredSpace(space);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i className="ri-map-2-line text-blue-600"></i>
          <span className="font-semibold text-gray-800">Interactive Floor Plan</span>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {floors.map(f => (
            <button
              key={f}
              onClick={() => setSelectedFloor(f)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedFloor === f ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 px-4 py-2 border-b border-gray-50 flex-wrap">
        {Object.entries(statusDot).map(([s, dot]) => (
          <div key={s} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${dot}`}></div>
            <span className="text-xs text-gray-500 capitalize">{s.replace('_', ' ')}</span>
          </div>
        ))}
      </div>

      <div className="relative floor-plan-container" style={{ height: '480px', overflow: 'hidden' }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            backgroundColor: '#f8faff',
          }}
        >
          <div className="absolute inset-4 border-2 border-gray-200 rounded-xl bg-white/60">
            <div className="absolute top-2 left-2 text-xs text-gray-400 font-medium">{selectedFloor} — Main Building</div>

            <div className="absolute top-8 left-4 right-4 bottom-4">
              <div className="absolute top-0 left-0 right-0 h-px bg-gray-200"></div>
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200 border-dashed"></div>

              <div className="absolute top-2 left-2 text-xs text-gray-300 font-medium">ZONE A</div>
              <div className="absolute top-2 right-2 text-xs text-gray-300 font-medium">ZONE B</div>

              {floorSpaces.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <i className="ri-map-line text-4xl mb-2 block"></i>
                    <p className="text-sm">No spaces on this floor</p>
                  </div>
                </div>
              )}

              {floorSpaces.map((space) => {
                const isDesk = space.type === 'hot_desk' || space.type === 'fixed_desk';
                const isRoom = ['meeting_room','boardroom','training_room'].includes(space.type);
                const size = isRoom ? 'w-20 h-14' : isDesk ? 'w-12 h-10' : 'w-10 h-10';
                const dot = statusDot[space.status] || 'bg-gray-400';

                return (
                  <div
                    key={space.id}
                    className={`absolute cursor-pointer group transition-transform hover:scale-110 hover:z-10`}
                    style={{ left: `${space.coordinates?.x || 50}px`, top: `${space.coordinates?.y || 50}px` }}
                    onMouseEnter={(e) => handleMouseEnter(space, e)}
                    onMouseLeave={() => setHoveredSpace(null)}
                    onClick={() => space.status === 'available' && onBook(space)}
                  >
                    <div className={`${size} rounded-lg border-2 flex flex-col items-center justify-center relative
                      ${space.status === 'available' ? 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100' :
                        space.status === 'booked' ? 'border-blue-300 bg-blue-50' :
                        space.status === 'reserved' ? 'border-purple-300 bg-purple-50' :
                        space.status === 'out_of_service' ? 'border-red-300 bg-red-50' :
                        'border-amber-300 bg-amber-50'}`}
                    >
                      <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${dot} border border-white`}></div>
                      <i className={`${typeIcon[space.type] || 'ri-map-pin-line'} text-gray-500 text-sm`}></i>
                      <span className="text-gray-600 font-medium mt-0.5" style={{ fontSize: '9px' }}>{space.space_id}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {hoveredSpace && (
          <div
            className="absolute z-20 bg-gray-900 text-white rounded-xl p-3 shadow-xl pointer-events-none w-52"
            style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
          >
            <div className="font-semibold text-sm mb-1">{hoveredSpace.name}</div>
            <div className="text-xs text-gray-300 mb-2 capitalize">{hoveredSpace.type.replace('_', ' ')} · Cap: {hoveredSpace.capacity}</div>
            <SpaceStatusBadge status={hoveredSpace.status} />
            {hoveredSpace.features?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {hoveredSpace.features.slice(0, 3).map(f => (
                  <span key={f} className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded">{f.replace('_', ' ')}</span>
                ))}
              </div>
            )}
            {hoveredSpace.status === 'available' && (
              <div className="mt-2 text-xs text-emerald-400 font-medium">Click to book</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}