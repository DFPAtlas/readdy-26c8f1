'use client';

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

interface Props {
  asset: AssetPoint;
  onClose: () => void;
  onViewDetail: (asset: AssetPoint) => void;
}

const typeIcons: Record<string, string> = {
  hvac: 'ri-temp-cold-line',
  boiler: 'ri-fire-fill',
  fire_alarm: 'ri-alarm-warning-line',
  electrical: 'ri-plug-line',
  cctv: 'ri-camera-line',
  pump: 'ri-water-flash-line',
  generator: 'ri-battery-charge-line',
  lift: 'ri-arrow-up-down-line',
  bms: 'ri-settings-3-line',
  default: 'ri-cpu-line',
};

const statusColors: Record<string, string> = {
  healthy: 'text-green-600 bg-green-50 border-green-200',
  warning: 'text-amber-600 bg-amber-50 border-amber-200',
  fault: 'text-red-600 bg-red-50 border-red-200',
  maintenance: 'text-blue-600 bg-blue-50 border-blue-200',
  offline: 'text-gray-500 bg-gray-50 border-gray-200',
};

const dotColors: Record<string, string> = {
  healthy: 'bg-green-500',
  warning: 'bg-amber-500',
  fault: 'bg-red-500',
  maintenance: 'bg-blue-500',
  offline: 'bg-gray-400',
};

export default function AssetPinPopup({ asset, onClose, onViewDetail }: Props) {
  const icon = typeIcons[asset.asset_type] || typeIcons.default;
  const sc = statusColors[asset.status] || statusColors.offline;
  const dot = dotColors[asset.status] || dotColors.offline;

  return (
    <div className="absolute z-50 bg-white rounded-xl shadow-2xl border border-gray-200 w-72 p-4"
      style={{ left: `${Math.min(asset.x_pos + 2, 65)}%`, top: `${Math.max(asset.y_pos - 20, 2)}%` }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 flex items-center justify-center rounded-lg border ${sc}`}>
            <i className={`${icon} text-lg`}></i>
          </div>
          <div>
            <div className="font-semibold text-gray-800 text-sm leading-tight">{asset.label}</div>
            <div className="text-xs text-gray-500 capitalize">{asset.asset_type.replace('_', ' ')}</div>
          </div>
        </div>
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer">
          <i className="ri-close-line"></i>
        </button>
      </div>
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${sc} mb-3`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
        {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
      </div>
      <div className="space-y-1.5 text-xs text-gray-600 mb-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Last Service</span>
          <span className="font-medium">{asset.last_service || '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Next Service</span>
          <span className="font-medium">{asset.next_service || '—'}</span>
        </div>
        {asset.notes && (
          <div className="pt-1 text-gray-500 italic">{asset.notes}</div>
        )}
      </div>
      <button
        onClick={() => onViewDetail(asset)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 rounded-lg cursor-pointer transition-colors"
      >
        View Full Asset Profile
      </button>
    </div>
  );
}