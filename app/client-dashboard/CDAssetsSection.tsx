'use client';

import Link from 'next/link';

interface AssetRecord {
  id: number;
  name: string;
  status: string;
  next_service_date: string;
  warranty_expiry: string;
  compliance_status: string;
  location: string;
  category_name?: string;
}

interface CDAssetsSectionProps {
  assets: AssetRecord[];
  loading: boolean;
}

const statusConfig: Record<string, { color: string; label: string }> = {
  operational: { color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20', label: 'Operational' },
  maintenance: { color: 'bg-amber-500/20 text-amber-300 border border-amber-500/20', label: 'Maintenance' },
  fault: { color: 'bg-red-500/20 text-red-300 border border-red-500/20', label: 'Fault' },
  offline: { color: 'bg-gray-500/20 text-gray-400 border border-gray-500/20', label: 'Offline' },
  decommissioned: { color: 'bg-gray-500/15 text-gray-500 border border-gray-500/15', label: 'Decommissioned' },
};

function daysUntil(dateStr: string) {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function CDAssetsSection({ assets, loading }: CDAssetsSectionProps) {
  const critical = assets.filter((a) => a.status === 'fault' || a.status === 'offline');
  const maintenanceDue = assets.filter((a) => {
    const d = daysUntil(a.next_service_date);
    return d !== null && d <= 30 && d >= 0;
  });
  const warrantyExpiring = assets.filter((a) => {
    const d = daysUntil(a.warranty_expiry);
    return d !== null && d <= 90 && d >= 0;
  });

  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center">
              <i className="ri-database-2-line text-violet-400"></i>
            </div>
            <div>
              <h2 className="font-semibold text-white">Assets</h2>
              <p className="text-xs text-gray-500">Critical assets & maintenance</p>
            </div>
          </div>
          <Link href="/asset-register" className="text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer whitespace-nowrap">View all →</Link>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-red-400">{loading ? '—' : critical.length}</div>
            <div className="text-xs text-gray-500 mt-0.5">Critical / Failed</div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-amber-400">{loading ? '—' : maintenanceDue.length}</div>
            <div className="text-xs text-gray-500 mt-0.5">Maintenance Due</div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-orange-400">{loading ? '—' : warrantyExpiring.length}</div>
            <div className="text-xs text-gray-500 mt-0.5">Warranty Expiring</div>
          </div>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 animate-pulse flex items-center space-x-3">
              <div className="h-8 w-8 bg-white/10 rounded-lg"></div>
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-3 bg-white/10 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-white/10 rounded w-20"></div>
            </div>
          ))
        ) : assets.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No assets found</div>
        ) : (
          assets.slice(0, 6).map((asset) => {
            const cfg = statusConfig[asset.status] || { color: 'bg-gray-500/20 text-gray-400 border border-gray-500/20', label: asset.status };
            const svcDays = daysUntil(asset.next_service_date);
            return (
              <div key={asset.id} className="px-5 py-3 flex items-center space-x-3 hover:bg-white/3 transition-colors">
                <div className="w-8 h-8 bg-violet-500/10 border border-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="ri-settings-3-line text-violet-400 text-sm"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{asset.name}</p>
                  <p className="text-xs text-gray-500">{asset.location}{asset.category_name ? ` · ${asset.category_name}` : ''}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${cfg.color}`}>{cfg.label}</span>
                  {svcDays !== null && svcDays <= 30 && (
                    <p className="text-xs text-amber-400 mt-0.5">Service in {svcDays}d</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}