'use client';

interface Building {
  id: number;
  name: string;
  address: string;
  city: string;
  floors_count: number;
  health_score: number;
  status: string;
  building_type: string;
}

interface Floor {
  id: number;
  building_id: number;
  name: string;
  floor_number: number;
}

interface Props {
  buildings: Building[];
  floors: Floor[];
  selectedBuilding: Building | null;
  selectedFloor: Floor | null;
  onSelectBuilding: (b: Building) => void;
  onSelectFloor: (f: Floor) => void;
}

export default function DTBuildingSelector({ buildings, floors, selectedBuilding, selectedFloor, onSelectBuilding, onSelectFloor }: Props) {
  const buildingFloors = floors.filter(f => f.building_id === selectedBuilding?.id);

  const healthColor = (score: number) =>
    score >= 85 ? 'text-green-600' : score >= 70 ? 'text-amber-600' : 'text-red-600';

  const healthBg = (score: number) =>
    score >= 85 ? 'bg-green-100' : score >= 70 ? 'bg-amber-100' : 'bg-red-100';

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Buildings</div>
      <div className="space-y-2 mb-4">
        {buildings.map(b => (
          <button
            key={b.id}
            onClick={() => onSelectBuilding(b)}
            className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${selectedBuilding?.id === b.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-gray-800 truncate">{b.name}</span>
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${healthBg(b.health_score)} ${healthColor(b.health_score)}`}>{b.health_score}%</span>
            </div>
            <div className="text-xs text-gray-500">{b.city} · {b.floors_count} floors</div>
          </button>
        ))}
      </div>

      {selectedBuilding && buildingFloors.length > 0 && (
        <>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Floors</div>
          <div className="space-y-1">
            {buildingFloors.map(f => (
              <button
                key={f.id}
                onClick={() => onSelectFloor(f)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${selectedFloor?.id === f.id ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}