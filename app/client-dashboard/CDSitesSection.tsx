'use client';

import Link from 'next/link';

interface Site {
  id: number;
  name: string;
  address: string;
  city: string;
  status: string;
  openJobs: number;
  assetHealth: number;
  complianceScore: number;
  lastActivity: string;
}

interface CDSitesSectionProps {
  sites: Site[];
  loading: boolean;
}

function StatusDot({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: 'bg-emerald-400',
    inactive: 'bg-gray-500',
    maintenance: 'bg-amber-400',
    closed: 'bg-red-400',
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${map[status] || 'bg-gray-500'}`}></span>;
}

function ScoreBar({ value, gradient }: { value: number; gradient: string }) {
  return (
    <div className="w-full bg-white/8 rounded-full h-1.5 overflow-hidden">
      <div className={`h-1.5 rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`} style={{ width: `${value}%` }}></div>
    </div>
  );
}

export default function CDSitesSection({ sites, loading }: CDSitesSectionProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/3 border border-white/8 rounded-2xl p-5 animate-pulse">
            <div className="h-5 bg-white/10 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-white/10 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-white/10 rounded"></div>
              <div className="h-3 bg-white/10 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (sites.length === 0) {
    return (
      <div className="bg-white/3 border border-white/8 rounded-2xl p-10 text-center">
        <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i className="ri-building-line text-blue-400 text-2xl"></i>
        </div>
        <h3 className="text-white font-semibold mb-1">No sites yet</h3>
        <p className="text-gray-500 text-sm mb-4">Add your first site to get started</p>
        <Link href="/asset-register/sites" className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm cursor-pointer whitespace-nowrap">
          <i className="ri-add-line"></i>
          <span>Add First Site</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sites.map((site) => (
        <div key={site.id} className="bg-white/3 border border-white/8 rounded-2xl p-5 hover:bg-white/5 hover:border-white/15 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <StatusDot status={site.status} />
                <span className="text-xs text-gray-500 capitalize">{site.status}</span>
              </div>
              <h3 className="font-semibold text-white text-sm">{site.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{site.city}</p>
            </div>
            <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center">
              <i className="ri-building-line text-cyan-400 text-sm"></i>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-500">Asset Health</span>
                <span className="font-medium text-white">{site.assetHealth}%</span>
              </div>
              <ScoreBar
                value={site.assetHealth}
                gradient={site.assetHealth >= 80 ? 'from-emerald-500 to-teal-400' : site.assetHealth >= 60 ? 'from-amber-500 to-yellow-400' : 'from-red-500 to-rose-400'}
              />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-500">Compliance Score</span>
                <span className="font-medium text-white">{site.complianceScore}%</span>
              </div>
              <ScoreBar
                value={site.complianceScore}
                gradient={site.complianceScore >= 80 ? 'from-cyan-500 to-blue-400' : site.complianceScore >= 60 ? 'from-amber-500 to-yellow-400' : 'from-red-500 to-rose-400'}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
            <div className="flex items-center space-x-1 text-xs text-amber-400">
              <i className="ri-tools-line"></i>
              <span>{site.openJobs} open jobs</span>
            </div>
            <span className="text-xs text-gray-600">{site.lastActivity}</span>
          </div>
        </div>
      ))}
    </div>
  );
}