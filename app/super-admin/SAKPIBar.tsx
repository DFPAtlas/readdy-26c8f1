interface SAKPIBarProps {
  stats: {
    totalCompanies: number;
    activeSubscriptions: number;
    trialAccounts: number;
    suspendedAccounts: number;
    mrr: number;
    totalUsers: number;
    totalWorkOrders: number;
    newSignups: number;
  };
  loading: boolean;
}

export default function SAKPIBar({ stats, loading }: SAKPIBarProps) {
  const cards = [
    { label: 'Total Companies', value: stats.totalCompanies, icon: 'ri-building-line', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Active Subscriptions', value: stats.activeSubscriptions, icon: 'ri-checkbox-circle-line', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Trial Accounts', value: stats.trialAccounts, icon: 'ri-time-line', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Suspended', value: stats.suspendedAccounts, icon: 'ri-forbid-line', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    { label: 'Monthly Revenue', value: `£${stats.mrr.toLocaleString()}`, icon: 'ri-money-pound-circle-line', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { label: 'Total Users', value: stats.totalUsers, icon: 'ri-team-line', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
    { label: 'Work Orders', value: stats.totalWorkOrders, icon: 'ri-tools-line', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    { label: 'New Signups (30d)', value: stats.newSignups, icon: 'ri-user-add-line', color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
      {cards.map((c) => (
        <div key={c.label} className={`border rounded-xl p-4 ${c.bg}`}>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className={`${c.icon} ${c.color} text-sm`}></i>
            </div>
          </div>
          <div className={`text-xl font-bold ${c.color}`}>
            {loading ? <div className="h-6 w-12 bg-white/10 rounded animate-pulse"></div> : c.value}
          </div>
          <p className="text-gray-500 text-xs mt-0.5 leading-tight">{c.label}</p>
        </div>
      ))}
    </div>
  );
}