'use client';

interface Alert {
  id: string;
  type: 'emergency' | 'warning' | 'info';
  title: string;
  description: string;
  time: string;
  source: string;
}

interface CDCriticalAlertsProps {
  alerts: Alert[];
}

const alertConfig = {
  emergency: { bg: 'bg-red-500/10 border-red-500/25', icon: 'ri-alarm-warning-fill', iconColor: 'text-red-400', badge: 'bg-red-500/20 text-red-300', label: 'Emergency' },
  warning: { bg: 'bg-amber-500/10 border-amber-500/25', icon: 'ri-error-warning-fill', iconColor: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300', label: 'Warning' },
  info: { bg: 'bg-blue-500/10 border-blue-500/25', icon: 'ri-information-fill', iconColor: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-300', label: 'Info' },
};

export default function CDCriticalAlerts({ alerts }: CDCriticalAlertsProps) {
  if (alerts.length === 0) {
    return (
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
            <i className="ri-shield-check-line text-emerald-400"></i>
          </div>
          <div>
            <h2 className="font-semibold text-white">Critical Alerts</h2>
            <p className="text-xs text-gray-500">All clear — no active alerts</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <i className="ri-checkbox-circle-fill text-emerald-400 text-xl"></i>
          <p className="text-sm text-emerald-300 font-medium">No critical alerts at this time</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center">
            <i className="ri-alarm-warning-line text-red-400"></i>
          </div>
          <div>
            <h2 className="font-semibold text-white">Critical Alerts</h2>
            <p className="text-xs text-gray-500">{alerts.length} active alert{alerts.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <span className="w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{alerts.length}</span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const cfg = alertConfig[alert.type];
          return (
            <div key={alert.id} className={`p-4 rounded-xl border ${cfg.bg} flex items-start space-x-3`}>
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className={`${cfg.icon} ${cfg.iconColor} text-lg`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg.badge}`}>{cfg.label}</span>
                  <span className="text-xs text-gray-500">{alert.source}</span>
                </div>
                <p className="text-sm font-medium text-white">{alert.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{alert.description}</p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">{alert.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}