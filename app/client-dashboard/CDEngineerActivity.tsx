'use client';

interface EngineerActivity {
  id: string;
  engineer: string;
  initials: string;
  action: string;
  job: string;
  location: string;
  time: string;
  status: 'on_site' | 'travelling' | 'completed' | 'available';
}

interface CDEngineerActivityProps {
  activities: EngineerActivity[];
  loading: boolean;
}

const statusConfig = {
  on_site: { color: 'bg-emerald-400', label: 'On Site' },
  travelling: { color: 'bg-blue-400', label: 'Travelling' },
  completed: { color: 'bg-gray-500', label: 'Completed' },
  available: { color: 'bg-violet-400', label: 'Available' },
};

export default function CDEngineerActivity({ activities, loading }: CDEngineerActivityProps) {
  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
      <div className="flex items-center space-x-3 mb-5">
        <div className="w-9 h-9 bg-teal-500/10 border border-teal-500/20 rounded-xl flex items-center justify-center">
          <i className="ri-user-star-line text-teal-400"></i>
        </div>
        <div>
          <h2 className="font-semibold text-white">Engineer Activity</h2>
          <p className="text-xs text-gray-500">Live field team status</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3 animate-pulse">
              <div className="w-9 h-9 bg-white/10 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-3 bg-white/10 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-6 text-gray-500 text-sm">No engineer activity today</div>
      ) : (
        <div className="space-y-2">
          {activities.map((act) => {
            const cfg = statusConfig[act.status];
            return (
              <div key={act.id} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">{act.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-white">{act.engineer}</p>
                    <span className="flex items-center space-x-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.color}`}></span>
                      <span className="text-xs text-gray-500">{cfg.label}</span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{act.action}</p>
                  <p className="text-xs text-gray-600">{act.job} · {act.location}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">{act.time}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}