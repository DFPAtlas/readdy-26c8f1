'use client';

interface KPIData {
  totalSites: number;
  totalAssets: number;
  openWorkOrders: number;
  emergencyJobs: number;
  overduePPM: number;
  complianceDueSoon: number;
  contractorVisits: number;
  monthlySpend: number;
  slaPerformance: number;
  buildingHealthScore: number;
}

interface CDKPICardsProps {
  data: KPIData;
  loading: boolean;
}

export default function CDKPICards({ data, loading }: CDKPICardsProps) {
  const cards = [
    { label: 'Total Sites', value: loading ? '—' : data.totalSites, icon: 'ri-building-line', accent: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/10', suffix: '' },
    { label: 'Total Assets', value: loading ? '—' : data.totalAssets, icon: 'ri-database-2-line', accent: 'text-violet-400', border: 'border-violet-500/20', bg: 'bg-violet-500/10', suffix: '' },
    { label: 'Open Work Orders', value: loading ? '—' : data.openWorkOrders, icon: 'ri-tools-line', accent: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/10', suffix: '' },
    { label: 'Emergency Jobs', value: loading ? '—' : data.emergencyJobs, icon: 'ri-alarm-warning-line', accent: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/10', suffix: '' },
    { label: 'Overdue PPM', value: loading ? '—' : data.overduePPM, icon: 'ri-calendar-close-line', accent: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/10', suffix: '' },
    { label: 'Compliance Due', value: loading ? '—' : data.complianceDueSoon, icon: 'ri-shield-check-line', accent: 'text-yellow-400', border: 'border-yellow-500/20', bg: 'bg-yellow-500/10', suffix: '' },
    { label: 'Contractor Visits', value: loading ? '—' : data.contractorVisits, icon: 'ri-user-star-line', accent: 'text-teal-400', border: 'border-teal-500/20', bg: 'bg-teal-500/10', suffix: ' /mo' },
    { label: 'Monthly Spend', value: loading ? '—' : `£${data.monthlySpend.toLocaleString()}`, icon: 'ri-money-pound-circle-line', accent: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10', suffix: '' },
    { label: 'SLA Performance', value: loading ? '—' : `${data.slaPerformance}%`, icon: 'ri-speed-line', accent: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'bg-cyan-500/10', suffix: '' },
    { label: 'Building Health', value: loading ? '—' : `${data.buildingHealthScore}%`, icon: 'ri-heart-pulse-line', accent: 'text-pink-400', border: 'border-pink-500/20', bg: 'bg-pink-500/10', suffix: '' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <div key={card.label} className={`border rounded-2xl p-4 hover:bg-white/5 transition-all ${card.bg} ${card.border}`}>
          <div className="flex items-start justify-between mb-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-white/5`}>
              <i className={`${card.icon} ${card.accent} text-lg`}></i>
            </div>
          </div>
          <div className={`text-2xl font-bold ${card.accent} mb-1`}>
            {loading ? (
              <div className="h-7 w-16 bg-white/10 rounded animate-pulse"></div>
            ) : (
              <>{card.value}{card.suffix && <span className="text-xs font-normal text-gray-500 ml-1">{card.suffix}</span>}</>
            )}
          </div>
          <p className="text-xs text-gray-500 font-medium">{card.label}</p>
        </div>
      ))}
    </div>
  );
}