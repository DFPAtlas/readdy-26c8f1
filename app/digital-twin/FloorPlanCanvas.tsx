'use client';

import { useState, useRef } from 'react';
import AssetPinPopup from './AssetPinPopup';
import AssetDetailModal from './AssetDetailModal';

interface AssetPoint {
  id: number;
  label: string;
  asset_type: string;
  status: string;
  last_service: string;
  next_service: string;
  notes: string;
  x_pos: number;
  y_pos: number;
}

interface Room {
  id: number;
  name: string;
  room_type: string;
  department: string;
  capacity: number;
  occupancy_current: number;
  temperature: number;
  humidity: number;
  air_quality_index: number;
  status: string;
  x_pos: number;
  y_pos: number;
  width: number;
  height: number;
}

interface EmergencyPoint {
  id: number;
  label: string;
  point_type: string;
  x_pos: number;
  y_pos: number;
  notes: string;
}

interface Props {
  assetPoints: AssetPoint[];
  rooms: Room[];
  emergencyPoints: EmergencyPoint[];
  showAssets: boolean;
  showRooms: boolean;
  showEmergency: boolean;
  showJobs: boolean;
}

const statusDotColor: Record<string, string> = {
  healthy: '#22c55e',
  warning: '#f59e0b',
  fault: '#ef4444',
  maintenance: '#3b82f6',
  offline: '#9ca3af',
};

const emergencyIcons: Record<string, string> = {
  fire_exit: 'ri-door-open-line',
  isolation_valve: 'ri-shut-down-line',
  first_aid: 'ri-first-aid-kit-line',
  fire_extinguisher: 'ri-fire-fill',
  assembly_point: 'ri-group-line',
};

const emergencyColors: Record<string, string> = {
  fire_exit: '#22c55e',
  isolation_valve: '#f59e0b',
  first_aid: '#3b82f6',
  fire_extinguisher: '#ef4444',
  assembly_point: '#8b5cf6',
};

const roomTypeColors: Record<string, string> = {
  office: 'rgba(219,234,254,0.7)',
  meeting_room: 'rgba(220,252,231,0.7)',
  boardroom: 'rgba(237,233,254,0.7)',
  server_room: 'rgba(254,243,199,0.7)',
  plant_room: 'rgba(254,226,226,0.7)',
  reception: 'rgba(224,242,254,0.7)',
  cafe: 'rgba(254,240,138,0.5)',
  training_room: 'rgba(209,250,229,0.7)',
  outdoor: 'rgba(220,252,231,0.4)',
  default: 'rgba(243,244,246,0.7)',
};

const mockJobs = [
  { x: 45, y: 12, label: 'WO-2847', type: 'fault' },
  { x: 28, y: 8, label: 'WO-2901', type: 'maintenance' },
];

export default function FloorPlanCanvas({ assetPoints, rooms, emergencyPoints, showAssets, showRooms, showEmergency, showJobs }: Props) {
  const [selectedAsset, setSelectedAsset] = useState<AssetPoint | null>(null);
  const [detailAsset, setDetailAsset] = useState<AssetPoint | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-pin]')) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
  };

  const handleMouseUp = () => setIsPanning(false);

  return (
    <div className="relative bg-gray-100 rounded-xl overflow-hidden border border-gray-200" style={{ height: '580px' }}>
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1">
        <button onClick={() => setZoom(z => Math.min(z + 0.2, 2.5))} className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer text-gray-700 font-bold">+</button>
        <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer text-gray-700 font-bold">−</button>
        <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer">
          <i className="ri-fullscreen-line text-gray-600 text-sm"></i>
        </button>
      </div>

      <div
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={() => { setSelectedAsset(null); setSelectedRoom(null); }}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          <div className="absolute inset-4 bg-white rounded-xl border-2 border-gray-300 shadow-inner">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            <div className="absolute top-2 left-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Floor Plan — Interactive View</div>

            {showRooms && rooms.map(room => (
              <div
                key={room.id}
                data-pin="room"
                className="absolute border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors group"
                style={{
                  left: `${room.x_pos}%`,
                  top: `${room.y_pos}%`,
                  width: `${room.width}%`,
                  height: `${room.height}%`,
                  backgroundColor: roomTypeColors[room.room_type] || roomTypeColors.default,
                }}
                onClick={(e) => { e.stopPropagation(); setSelectedRoom(room); setSelectedAsset(null); }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
                  <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{room.name}</span>
                  {room.occupancy_current > 0 && (
                    <span className="text-xs text-gray-500">{room.occupancy_current}/{room.capacity}</span>
                  )}
                </div>
                {room.temperature && (
                  <div className="absolute top-1 right-1 text-xs text-gray-500 font-medium">{room.temperature}°</div>
                )}
              </div>
            ))}

            {showAssets && assetPoints.map(asset => (
              <div
                key={asset.id}
                data-pin="asset"
                className="absolute cursor-pointer group"
                style={{ left: `${asset.x_pos}%`, top: `${asset.y_pos}%`, transform: 'translate(-50%, -50%)' }}
                onClick={(e) => { e.stopPropagation(); setSelectedAsset(asset); setSelectedRoom(null); }}
              >
                <div
                  className="w-5 h-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-125"
                  style={{ backgroundColor: statusDotColor[asset.status] || '#9ca3af' }}
                >
                  <span className="w-2 h-2 rounded-full bg-white/60"></span>
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-800 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {asset.label}
                </div>
              </div>
            ))}

            {showEmergency && emergencyPoints.map(ep => (
              <div
                key={ep.id}
                data-pin="emergency"
                className="absolute cursor-pointer group"
                style={{ left: `${ep.x_pos}%`, top: `${ep.y_pos}%`, transform: 'translate(-50%, -50%)' }}
                title={ep.label}
              >
                <div
                  className="w-6 h-6 rounded-md border-2 border-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-125"
                  style={{ backgroundColor: emergencyColors[ep.point_type] || '#6b7280' }}
                >
                  <i className={`${emergencyIcons[ep.point_type] || 'ri-alert-line'} text-white text-xs`}></i>
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-800 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {ep.label}
                </div>
              </div>
            ))}

            {showJobs && mockJobs.map((job, i) => (
              <div
                key={i}
                data-pin="job"
                className="absolute cursor-pointer group"
                style={{ left: `${job.x}%`, top: `${job.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse ${job.type === 'fault' ? 'bg-red-500' : 'bg-blue-500'}`}>
                  <i className="ri-tools-line text-white text-xs"></i>
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-800 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {job.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedAsset && (
        <AssetPinPopup
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onViewDetail={(a) => { setDetailAsset(a); setSelectedAsset(null); }}
        />
      )}

      {selectedRoom && (
        <div className="absolute z-40 bg-white rounded-xl shadow-2xl border border-gray-200 w-64 p-4"
          style={{ left: `${Math.min(selectedRoom.x_pos + selectedRoom.width + 1, 55)}%`, top: `${selectedRoom.y_pos}%` }}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-800 text-sm">{selectedRoom.name}</span>
            <button onClick={() => setSelectedRoom(null)} className="w-5 h-5 flex items-center justify-center text-gray-400 cursor-pointer"><i className="ri-close-line"></i></button>
          </div>
          <div className="text-xs text-gray-500 capitalize mb-2">{selectedRoom.room_type.replace('_', ' ')} — {selectedRoom.department}</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-blue-50 rounded-lg p-2 text-center">
              <div className="font-bold text-blue-700">{selectedRoom.temperature}°C</div>
              <div className="text-gray-500">Temp</div>
            </div>
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <div className="font-bold text-green-700">{selectedRoom.humidity}%</div>
              <div className="text-gray-500">Humidity</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-2 text-center">
              <div className="font-bold text-purple-700">{selectedRoom.air_quality_index}</div>
              <div className="text-gray-500">Air Quality</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-2 text-center">
              <div className="font-bold text-amber-700">{selectedRoom.occupancy_current}/{selectedRoom.capacity}</div>
              <div className="text-gray-500">Occupancy</div>
            </div>
          </div>
        </div>
      )}

      {detailAsset && (
        <AssetDetailModal asset={detailAsset} onClose={() => setDetailAsset(null)} />
      )}
    </div>
  );
}