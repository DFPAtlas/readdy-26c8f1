'use client';

interface InsightData {
  topRisks: string[];
  assetsNeedingAttention: string[];
  complianceGaps: string[];
  maintenanceRecommendations: string[];
}

interface CDAIInsightsProps {
  data: InsightData;
  loading: boolean;
  companyName: string;
}

export default function CDAIInsights({ data, loading, companyName }: CDAIInsightsProps) {
  const panels = [
    {
      key: 'topRisks',
      title: 'Top Risks This Month',
      icon: 'ri-error-warning-line',
      color: 'from-red-500 to-orange-500',
      bg: 'bg-red-50',
      border: 'border-red-100',
      textColor: 'text-red-700',
      items: data.topRisks,
    },
    {
      key: 'assetsNeedingAttention',
      title: 'Assets Needing Attention',
      icon: 'ri-settings-3-line',
      color: 'from-amber-500 to-yellow-500',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      textColor: 'text-amber-700',
      items: data.assetsNeedingAttention,
    },
    {
      key: 'complianceGaps',
      title: 'Compliance Gaps',
      icon: 'ri-shield-cross-line',
      color: 'from-violet-500 to-purple-500',
      bg: 'bg-violet-50',
      border: 'border-violet-100',
      textColor: 'text-violet-700',
      items: data.complianceGaps,
    },
    {
      key: 'maintenanceRecommendations',
      title: 'Maintenance Recommendations',
      icon: 'ri-lightbulb-line',
      color: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      textColor: 'text-blue-700',
      items: data.maintenanceRecommendations,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl flex items-center justify-center">
          <i className="ri-sparkling-2-line text-white text-lg"></i>
        </div>
        <div>
          <h2 className="font-bold text-white text-lg">AI Insights</h2>
          <p className="text-gray-400 text-xs">Powered by Synqoro AI · {companyName}</p>
        </div>
        <div className="ml-auto flex items-center space-x-1.5 px-3 py-1 bg-white/10 rounded-full">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
          <span className="text-xs text-gray-300">Live analysis</span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-1/2 mb-3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-white/10 rounded"></div>
                <div className="h-3 bg-white/10 rounded w-4/5"></div>
                <div className="h-3 bg-white/10 rounded w-3/5"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {panels.map((panel) => (
            <div key={panel.key} className={`${panel.bg} border ${panel.border} rounded-xl p-4`}>
              <div className="flex items-center space-x-2 mb-3">
                <div className={`w-7 h-7 bg-gradient-to-br ${panel.color} rounded-lg flex items-center justify-center`}>
                  <i className={`${panel.icon} text-white text-sm`}></i>
                </div>
                <h3 className={`text-sm font-semibold ${panel.textColor}`}>{panel.title}</h3>
              </div>
              {panel.items.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No items identified</p>
              ) : (
                <ul className="space-y-1.5">
                  {panel.items.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-gradient-to-br ${panel.color}`}></span>
                      <span className="text-xs text-gray-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
        <p className="text-xs text-gray-400 text-center">
          <i className="ri-information-line mr-1"></i>
          AI insights are generated from your live facility data. Updated every 24 hours.
        </p>
      </div>
    </div>
  );
}