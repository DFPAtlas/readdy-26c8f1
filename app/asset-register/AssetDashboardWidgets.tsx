'use client';

interface WidgetProps {
  totalAssets: number;
  overdueServices: number;
  expiringWarranties: number;
  failedAssets: number;
  assetsBySite: { name: string; count: number }[];
}

export default function AssetDashboardWidgets({ totalAssets, overdueServices, expiringWarranties, failedAssets, assetsBySite }: WidgetProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-lg">
              <i className="ri-database-2-line text-blue-600 text-xl"></i>
            </div>
            <span className="text-xs text-gray-400 font-medium">TOTAL</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalAssets}</div>
          <div className="text-sm text-gray-500 mt-1">Registered Assets</div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 flex items-center justify-center bg-red-50 rounded-lg">
              <i className="ri-alarm-warning-line text-red-600 text-xl"></i>
            </div>
            <span className="text-xs text-red-400 font-medium">ACTION</span>
          </div>
          <div className="text-3xl font-bold text-red-600">{overdueServices}</div>
          <div className="text-sm text-gray-500 mt-1">Overdue Services</div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 flex items-center justify-center bg-yellow-50 rounded-lg">
              <i className="ri-time-line text-yellow-600 text-xl"></i>
            </div>
            <span className="text-xs text-yellow-500 font-medium">EXPIRING</span>
          </div>
          <div className="text-3xl font-bold text-yellow-600">{expiringWarranties}</div>
          <div className="text-sm text-gray-500 mt-1">Warranties (90 days)</div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 flex items-center justify-center bg-orange-50 rounded-lg">
              <i className="ri-error-warning-line text-orange-600 text-xl"></i>
            </div>
            <span className="text-xs text-orange-400 font-medium">CRITICAL</span>
          </div>
          <div className="text-3xl font-bold text-orange-600">{failedAssets}</div>
          <div className="text-sm text-gray-500 mt-1">Failed / Critical</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Assets by Site</h3>
        <div className="space-y-3">
          {assetsBySite.map((site) => {
            const pct = totalAssets > 0 ? Math.round((site.count / totalAssets) * 100) : 0;
            return (
              <div key={site.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{site.name}</span>
                  <span className="text-sm font-semibold text-gray-800">{site.count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}