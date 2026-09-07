'use client';

interface Layers {
  assets: boolean;
  rooms: boolean;
  emergency: boolean;
  jobs: boolean;
}

interface Props {
  layers: Layers;
  onToggle: (key: keyof Layers) => void;
}

const layerDefs = [
  { key: 'assets' as const, label: 'Asset Pins', icon: 'ri-cpu-line', color: 'text-blue-600' },
  { key: 'rooms' as const, label: 'Room Overlay', icon: 'ri-layout-grid-line', color: 'text-indigo-600' },
  { key: 'emergency' as const, label: 'Emergency Points', icon: 'ri-alarm-warning-line', color: 'text-red-600' },
  { key: 'jobs' as const, label: 'Live Jobs', icon: 'ri-tools-line', color: 'text-amber-600' },
];

export default function DTLayerControls({ layers, onToggle }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Layer Controls</div>
      <div className="space-y-2">
        {layerDefs.map(l => (
          <label key={l.key} className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => onToggle(l.key)}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${layers[l.key] ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${layers[l.key] ? 'translate-x-4' : 'translate-x-0.5'}`}></span>
            </div>
            <div className="flex items-center gap-2">
              <i className={`${l.icon} ${l.color} text-sm`}></i>
              <span className="text-sm text-gray-700">{l.label}</span>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status Legend</div>
        <div className="space-y-1.5">
          {[
            { color: 'bg-green-500', label: 'Healthy' },
            { color: 'bg-amber-500', label: 'Warning' },
            { color: 'bg-red-500', label: 'Fault' },
            { color: 'bg-blue-500', label: 'Maintenance' },
            { color: 'bg-gray-400', label: 'Offline' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${s.color}`}></span>
              <span className="text-xs text-gray-600">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Emergency Legend</div>
        <div className="space-y-1.5">
          {[
            { color: 'bg-green-500', label: 'Fire Exit' },
            { color: 'bg-amber-500', label: 'Isolation Valve' },
            { color: 'bg-blue-500', label: 'First Aid' },
            { color: 'bg-red-500', label: 'Fire Extinguisher' },
            { color: 'bg-purple-500', label: 'Assembly Point' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-md ${s.color}`}></span>
              <span className="text-xs text-gray-600">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}