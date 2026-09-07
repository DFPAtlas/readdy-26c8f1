'use client';

import Link from 'next/link';

interface ComplianceRecord {
  id: number;
  title: string;
  category: string;
  status: string;
  expiry_date: string;
  site_name?: string;
}

interface CDComplianceSectionProps {
  records: ComplianceRecord[];
  loading: boolean;
}

const statusConfig: Record<string, { color: string; label: string; icon: string }> = {
  compliant: { color: 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20', label: 'Compliant', icon: 'ri-checkbox-circle-line' },
  due_soon: { color: 'text-amber-400 bg-amber-500/10 border border-amber-500/20', label: 'Due Soon', icon: 'ri-time-line' },
  overdue: { color: 'text-red-400 bg-red-500/10 border border-red-500/20', label: 'Overdue', icon: 'ri-alarm-warning-line' },
  expired: { color: 'text-red-300 bg-red-500/15 border border-red-500/25', label: 'Expired', icon: 'ri-close-circle-line' },
  in_progress: { color: 'text-blue-400 bg-blue-500/10 border border-blue-500/20', label: 'In Progress', icon: 'ri-loader-4-line' },
};

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function CDComplianceSection({ records, loading }: CDComplianceSectionProps) {
  const urgent = records.filter((r) => r.status === 'overdue' || r.status === 'expired');
  const dueSoon = records.filter((r) => r.status === 'due_soon');
  const compliant = records.filter((r) => r.status === 'compliant');

  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
              <i className="ri-shield-check-line text-blue-400"></i>
            </div>
            <div>
              <h2 className="font-semibold text-white">Compliance</h2>
              <p className="text-xs text-gray-500">Certificates & inspections</p>
            </div>
          </div>
          <Link href="/compliance" className="text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer whitespace-nowrap">View all →</Link>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-red-400">{loading ? '—' : urgent.length}</div>
            <div className="text-xs text-gray-500 mt-0.5">Urgent / Failed</div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-amber-400">{loading ? '—' : dueSoon.length}</div>
            <div className="text-xs text-gray-500 mt-0.5">Due Soon</div>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-emerald-400">{loading ? '—' : compliant.length}</div>
            <div className="text-xs text-gray-500 mt-0.5">Compliant</div>
          </div>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 animate-pulse flex items-center space-x-3">
              <div className="h-4 bg-white/10 rounded w-32"></div>
              <div className="h-4 bg-white/10 rounded flex-1"></div>
              <div className="h-4 bg-white/10 rounded w-20"></div>
            </div>
          ))
        ) : records.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No compliance records found</div>
        ) : (
          records.slice(0, 6).map((rec) => {
            const cfg = statusConfig[rec.status] || { color: 'text-gray-400 bg-gray-500/10 border border-gray-500/20', label: rec.status, icon: 'ri-file-line' };
            const days = rec.expiry_date ? daysUntil(rec.expiry_date) : null;
            return (
              <div key={rec.id} className="px-5 py-3 flex items-center space-x-3 hover:bg-white/3 transition-colors">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                  <i className={`${cfg.icon} text-sm`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{rec.title}</p>
                  <p className="text-xs text-gray-500">{rec.category}{rec.site_name ? ` · ${rec.site_name}` : ''}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${cfg.color}`}>{cfg.label}</span>
                  {days !== null && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Today' : `${days}d left`}
                    </p>
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