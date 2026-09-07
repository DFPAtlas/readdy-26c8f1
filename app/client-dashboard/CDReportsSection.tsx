'use client';

import { useState } from 'react';

interface CDReportsSectionProps {
  companyName: string;
}

const reports = [
  {
    id: 'monthly',
    title: 'Monthly Operations Report',
    description: 'Full summary of work orders, assets, compliance, and spend',
    icon: 'ri-file-chart-2-line',
    color: 'text-blue-600 bg-blue-50',
    badge: 'Monthly',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'compliance',
    title: 'Compliance Summary',
    description: 'All certificates, expiry dates, failed checks, and upcoming inspections',
    icon: 'ri-shield-check-line',
    color: 'text-emerald-600 bg-emerald-50',
    badge: 'On Demand',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'jobs',
    title: 'Job History Report',
    description: 'Complete work order history with engineer timesheets and costs',
    icon: 'ri-tools-line',
    color: 'text-amber-600 bg-amber-50',
    badge: 'On Demand',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'assets',
    title: 'Asset History Report',
    description: 'Full asset register with service history, warranties, and condition',
    icon: 'ri-database-2-line',
    color: 'text-violet-600 bg-violet-50',
    badge: 'On Demand',
    badgeColor: 'bg-violet-100 text-violet-700',
  },
  {
    id: 'ppm',
    title: 'PPM Schedule Report',
    description: 'Planned preventive maintenance schedule and completion rates',
    icon: 'ri-calendar-check-line',
    color: 'text-teal-600 bg-teal-50',
    badge: 'Monthly',
    badgeColor: 'bg-teal-100 text-teal-700',
  },
  {
    id: 'spend',
    title: 'Financial Spend Report',
    description: 'Monthly spend breakdown by site, category, and contractor',
    icon: 'ri-money-pound-circle-line',
    color: 'text-pink-600 bg-pink-50',
    badge: 'Monthly',
    badgeColor: 'bg-pink-100 text-pink-700',
  },
];

export default function CDReportsSection({ companyName }: CDReportsSectionProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = (reportId: string) => {
    setDownloading(reportId);
    setTimeout(() => {
      setDownloading(null);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
          <i className="ri-download-cloud-line text-blue-500"></i>
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">Reports</h2>
          <p className="text-xs text-gray-400">Download reports for {companyName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => (
          <div key={report.id} className="border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${report.color}`}>
                <i className={`${report.icon} text-lg`}></i>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${report.badgeColor}`}>{report.badge}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-800 mb-1">{report.title}</h3>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">{report.description}</p>
            <button
              onClick={() => handleDownload(report.id)}
              disabled={downloading === report.id}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 text-gray-600 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
            >
              {downloading === report.id ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <i className="ri-download-line"></i>
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}