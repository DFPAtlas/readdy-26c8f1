'use client';

import { useState } from 'react';
import DTStatusBadge from './DTStatusBadge';
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

interface Props {
  assets: AssetPoint[];
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

export default function DTAssetsTable({ assets }: Props) {
  const [filter, setFilter] = useState('all');
  const [detail, setDetail] = useState<AssetPoint | null>(null);

  const types = ['all', ...Array.from(new Set(assets.map(a => a.asset_type)))];
  const filtered = filter === 'all' ? assets : assets.filter(a => a.asset_type === filter);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-semibold text-gray-800">Asset Map Points</h3>
          <p className="text-sm text-gray-500 mt-0.5">{assets.length} assets monitored across all floors</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors capitalize whitespace-nowrap ${filter === t ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Asset</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Type</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Status</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Last Service</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Next Service</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Notes</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((asset) => (
              <tr key={asset.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-lg">
                      <i className={`${typeIcons[asset.asset_type] || typeIcons.default} text-gray-600 text-sm`}></i>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{asset.label}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 capitalize">{asset.asset_type.replace('_', ' ')}</td>
                <td className="px-4 py-3"><DTStatusBadge status={asset.status} /></td>
                <td className="px-4 py-3 text-xs text-gray-600">{asset.last_service || '—'}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{asset.next_service || '—'}</td>
                <td className="px-4 py-3 text-xs text-gray-500 max-w-48 truncate">{asset.notes || '—'}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setDetail(asset)}
                    className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer font-medium"
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {detail && <AssetDetailModal asset={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}