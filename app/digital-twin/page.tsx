'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';
import DTDashboardWidgets from './DTDashboardWidgets';
import DTBuildingsOverview from './DTBuildingsOverview';
import DTBuildingSelector from './DTBuildingSelector';
import DTLayerControls from './DTLayerControls';
import FloorPlanCanvas from './FloorPlanCanvas';
import DTEventsPanel from './DTEventsPanel';
import DTRoomsTable from './DTRoomsTable';
import DTAssetsTable from './DTAssetsTable';

interface Building { id: number; name: string; address: string; city: string; postcode: string; floors_count: number; year_built: number; total_area_sqm: number; building_type: string; status: string; health_score: number; notes: string; }
interface Floor { id: number; building_id: number; name: string; floor_number: number; area_sqm: number; status: string; }
interface Room { id: number; floor_id: number; building_id: number; name: string; room_type: string; department: string; capacity: number; area_sqm: number; status: string; temperature: number; humidity: number; air_quality_index: number; occupancy_current: number; x_pos: number; y_pos: number; width: number; height: number; }
interface AssetPoint { id: number; floor_id: number; building_id: number; label: string; asset_type: string; status: string; last_service: string; next_service: string; notes: string; x_pos: number; y_pos: number; }
interface EmergencyPoint { id: number; floor_id: number; building_id: number; label: string; point_type: string; x_pos: number; y_pos: number; notes: string; }
interface DTEvent { id: number; building_id: number; floor_id: number; event_type: string; title: string; description: string; severity: string; status: string; created_at: string; }

type Tab = 'overview' | 'floorplan' | 'rooms' | 'assets' | 'events';

export default function DigitalTwinPage() {
  const [tab, setTab] = useState<Tab>('overview');
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [assetPoints, setAssetPoints] = useState<AssetPoint[]>([]);
  const [emergencyPoints, setEmergencyPoints] = useState<EmergencyPoint[]>([]);
  const [events, setEvents] = useState<DTEvent[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [loading, setLoading] = useState(true);
  const [layers, setLayers] = useState({ assets: true, rooms: true, emergency: true, jobs: true });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [bRes, fRes, rRes, aRes, eRes, evRes] = await Promise.all([
      supabase.from('buildings').select('*').eq('tenant_id', 'default').order('name'),
      supabase.from('floors').select('*').eq('tenant_id', 'default').order('floor_number'),
      supabase.from('rooms').select('*').eq('tenant_id', 'default'),
      supabase.from('asset_map_points').select('*').eq('tenant_id', 'default'),
      supabase.from('emergency_points').select('*').eq('tenant_id', 'default'),
      supabase.from('digital_twin_events').select('*').eq('tenant_id', 'default').order('created_at', { ascending: false }),
    ]);
    const bData = bRes.data || [];
    const fData = fRes.data || [];
    setBuildings(bData);
    setFloors(fData);
    setRooms(rRes.data || []);
    setAssetPoints(aRes.data || []);
    setEmergencyPoints(eRes.data || []);
    setEvents(evRes.data || []);
    if (bData.length > 0) {
      setSelectedBuilding(bData[0]);
      const firstFloor = fData.find(f => f.building_id === bData[0].id);
      if (firstFloor) setSelectedFloor(firstFloor);
    }
    setLoading(false);
  }

  function handleSelectBuilding(b: Building) {
    setSelectedBuilding(b);
    const firstFloor = floors.find(f => f.building_id === b.id);
    if (firstFloor) setSelectedFloor(firstFloor);
    setTab('floorplan');
  }

  function toggleLayer(key: keyof typeof layers) {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const floorAssets = assetPoints.filter(a => a.floor_id === selectedFloor?.id);
  const floorRooms = rooms.filter(r => r.floor_id === selectedFloor?.id);
  const floorEmergency = emergencyPoints.filter(e => e.floor_id === selectedFloor?.id);
  const buildingEvents = events.filter(e => e.building_id === selectedBuilding?.id);
  const buildingRooms = rooms.filter(r => r.building_id === selectedBuilding?.id);
  const buildingAssets = assetPoints.filter(a => a.building_id === selectedBuilding?.id);

  const tabs = [
    { id: 'overview' as Tab, label: 'Buildings Overview', icon: 'ri-building-2-line' },
    { id: 'floorplan' as Tab, label: 'Floor Plan', icon: 'ri-map-2-line' },
    { id: 'rooms' as Tab, label: 'Room Sensors', icon: 'ri-layout-grid-line' },
    { id: 'assets' as Tab, label: 'Asset Register', icon: 'ri-cpu-line' },
    { id: 'events' as Tab, label: 'Live Events', icon: 'ri-alarm-warning-line' },
  ];

  return (
    <AuthGuard>
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                  <i className="ri-building-3-line text-white text-lg"></i>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Digital Twin</h1>
                  <p className="text-sm text-gray-500">Interactive live building maps & asset monitoring</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-medium text-green-700">Live Monitoring</span>
              </div>
              <button
                onClick={loadData}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors whitespace-nowrap"
              >
                <i className="ri-refresh-line"></i>
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <div className="text-gray-500 text-sm">Loading Digital Twin data...</div>
              </div>
            </div>
          ) : (
            <>
              <DTDashboardWidgets buildings={buildings} assetPoints={assetPoints} events={events} />

              <div className="flex border-b border-gray-200 mb-6 bg-white rounded-t-xl overflow-hidden">
                {tabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${tab === t.id ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                  >
                    <i className={t.icon}></i>
                    {t.label}
                  </button>
                ))}
              </div>

              {tab === 'overview' && (
                <DTBuildingsOverview buildings={buildings} onSelect={handleSelectBuilding} />
              )}

              {tab === 'floorplan' && (
                <div className="grid grid-cols-12 gap-5">
                  <div className="col-span-3 space-y-4">
                    <DTBuildingSelector
                      buildings={buildings}
                      floors={floors}
                      selectedBuilding={selectedBuilding}
                      selectedFloor={selectedFloor}
                      onSelectBuilding={(b) => { setSelectedBuilding(b); const f = floors.find(fl => fl.building_id === b.id); if (f) setSelectedFloor(f); }}
                      onSelectFloor={setSelectedFloor}
                    />
                    <DTLayerControls layers={layers} onToggle={toggleLayer} />
                  </div>
                  <div className="col-span-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <h3 className="font-semibold text-gray-800">{selectedBuilding?.name}</h3>
                          <p className="text-xs text-gray-500">{selectedFloor?.name} · {selectedBuilding?.city}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-medium">{floorAssets.length} assets</span>
                          <span className="bg-green-50 text-green-700 px-2 py-1 rounded-lg font-medium">{floorRooms.length} rooms</span>
                        </div>
                      </div>
                    </div>
                    <FloorPlanCanvas
                      assetPoints={floorAssets}
                      rooms={floorRooms}
                      emergencyPoints={floorEmergency}
                      showAssets={layers.assets}
                      showRooms={layers.rooms}
                      showEmergency={layers.emergency}
                      showJobs={layers.jobs}
                    />
                  </div>
                  <div className="col-span-3">
                    <DTEventsPanel events={buildingEvents} />
                  </div>
                </div>
              )}

              {tab === 'rooms' && (
                <DTRoomsTable rooms={selectedBuilding ? buildingRooms : rooms} />
              )}

              {tab === 'assets' && (
                <DTAssetsTable assets={selectedBuilding ? buildingAssets : assetPoints} />
              )}

              {tab === 'events' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800">All Digital Twin Events</h3>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {events.map(ev => (
                          <div key={ev.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0 ${ev.severity === 'high' ? 'bg-red-100 text-red-600' : ev.severity === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                <i className={`${ev.event_type === 'fault' ? 'ri-error-warning-line' : ev.event_type === 'alert' ? 'ri-alarm-warning-line' : ev.event_type === 'maintenance' ? 'ri-tools-line' : 'ri-information-line'} text-sm`}></i>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold text-gray-800">{ev.title}</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ev.status === 'open' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{ev.status}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">{ev.description}</p>
                                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                                  <span className="capitalize">{ev.event_type}</span>
                                  <span>·</span>
                                  <span className="capitalize">{ev.severity} severity</span>
                                  <span>·</span>
                                  <span>{new Date(ev.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <DTEventsPanel events={events} />
                    <div className="mt-4 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <i className="ri-sparkling-2-line text-purple-600"></i>
                        <span className="text-sm font-semibold text-purple-800">AI Event Analysis</span>
                      </div>
                      <div className="space-y-2 text-xs text-gray-700">
                        <div className="flex items-start gap-2">
                          <span className="w-4 h-4 flex items-center justify-center bg-purple-100 rounded-full text-purple-700 font-bold flex-shrink-0">1</span>
                          <span>AHU-02 vibration fault correlates with bearing wear pattern — recommend immediate inspection</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-4 h-4 flex items-center justify-center bg-purple-100 rounded-full text-purple-700 font-bold flex-shrink-0">2</span>
                          <span>3 open events on Nexus Tower Floor 1 — consider bundling into single engineer visit</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-4 h-4 flex items-center justify-center bg-purple-100 rounded-full text-purple-700 font-bold flex-shrink-0">3</span>
                          <span>Riverside House HVAC efficiency drop may indicate refrigerant leak — compliance check recommended</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}