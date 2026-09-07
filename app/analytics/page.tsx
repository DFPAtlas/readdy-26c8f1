'use client';

import { useState, Suspense } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

function AnalyticsContent() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const kpiData = [
    { title: 'Work Order Completion Rate', value: '94.2%', change: '+2.1%', trend: 'up', color: 'bg-emerald-500' },
    { title: 'Average Response Time', value: '2.4 hrs', change: '-0.3 hrs', trend: 'down', color: 'bg-cyan-500' },
    { title: 'Energy Consumption', value: '1,847 kWh', change: '-12.3%', trend: 'down', color: 'bg-amber-500' },
    { title: 'Maintenance Costs', value: '$24,567', change: '+8.2%', trend: 'up', color: 'bg-violet-500' }
  ];

  const energyData = [
    { month: 'Jan', consumption: 1920, cost: 2304 }, { month: 'Feb', consumption: 1780, cost: 2136 }, { month: 'Mar', consumption: 1650, cost: 1980 }, { month: 'Apr', consumption: 1520, cost: 1824 }, { month: 'May', consumption: 1680, cost: 2016 }, { month: 'Jun', consumption: 1847, cost: 2216 }
  ];

  const performanceMetrics = [
    { department: 'HVAC', efficiency: 92, uptime: 98.5, satisfaction: 4.2 }, { department: 'Electrical', efficiency: 89, uptime: 99.1, satisfaction: 4.4 }, { department: 'Plumbing', efficiency: 94, uptime: 97.8, satisfaction: 4.1 }, { department: 'Security', efficiency: 96, uptime: 99.9, satisfaction: 4.6 }, { department: 'Cleaning', efficiency: 88, uptime: 95.2, satisfaction: 3.9 }
  ];

  const predictiveAlerts = [
    { asset: 'HVAC Unit A-201', prediction: 'Potential failure in 15 days', probability: '78%', impact: 'High', recommendation: 'Schedule immediate inspection' },
    { asset: 'Elevator B-1', prediction: 'Maintenance due in 7 days', probability: '95%', impact: 'Medium', recommendation: 'Plan preventive maintenance' },
    { asset: 'Generator Main', prediction: 'Filter replacement needed', probability: '92%', impact: 'Low', recommendation: 'Order replacement parts' }
  ];

  return (
    <div className="flex min-h-screen bg-[#030912]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Analytics & Reporting" />
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Analytics & Reporting</h1>
            <div className="flex items-center space-x-4">
              <select value={selectedPeriod} onChange={(e: any) => setSelectedPeriod(e.target.value)} className="pr-8 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-white">
                <option value="week">Last Week</option><option value="month">Last Month</option><option value="quarter">Last Quarter</option><option value="year">Last Year</option>
              </select>
              <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-cyan-400 transition-colors whitespace-nowrap cursor-pointer"><i className="ri-download-line mr-2"></i>Export Report</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiData.map((kpi: any, i: number) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${kpi.color} rounded-lg flex items-center justify-center`}><i className="ri-bar-chart-line text-white"></i></div>
                  <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>{kpi.change}</span>
                </div>
                <h3 className="text-sm text-gray-400 mb-1">{kpi.title}</h3>
                <p className="text-2xl font-bold text-white">{kpi.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6"><h3 className="text-lg font-semibold text-white">Energy Consumption Tracking</h3><div className="flex space-x-2"><button className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-md text-sm font-medium">kWh</button><button className="px-3 py-1 bg-white/5 text-gray-400 rounded-md text-sm font-medium">Cost</button></div></div>
              <div className="h-64 flex items-end justify-between space-x-2">
                {energyData.map((d: any, i: number) => (<div key={i} className="flex-1 flex flex-col items-center"><div className="w-full bg-cyan-500/20 rounded-t-lg mb-2" style={{ height: `${(d.consumption / 2000) * 100}%` }}><div className="w-full bg-cyan-500 rounded-t-lg" style={{ height: '100%' }}></div></div><span className="text-xs text-gray-500">{d.month}</span><span className="text-xs font-medium text-white">{d.consumption}</span></div>))}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Department Performance</h3>
              <div className="space-y-4">
                {performanceMetrics.map((m: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex-1"><h4 className="font-medium text-white">{m.department}</h4><div className="flex items-center space-x-4 mt-2 text-sm text-gray-400"><span>Efficiency: <span className="font-medium text-white">{m.efficiency}%</span></span><span>Uptime: <span className="font-medium text-white">{m.uptime}%</span></span><span>Rating: <span className="font-medium text-white">{m.satisfaction}/5</span></span></div></div>
                    <div className="flex items-center space-x-1">{[1,2,3,4,5].map((s: number)=>(<i key={s} className={s <= m.satisfaction ? 'ri-star-fill text-amber-400' : 'ri-star-line text-amber-400'}></i>))}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl mb-8">
            <div className="p-6 border-b border-white/10"><h3 className="text-lg font-semibold text-white">Predictive Analytics</h3></div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {predictiveAlerts.map((a: any, i: number) => (
                  <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                    <div className="flex items-center justify-between mb-3"><h4 className="font-medium text-white">{a.asset}</h4><span className={`px-2 py-1 text-xs font-semibold rounded-full ${a.impact==='High'?'bg-red-100 text-red-700':a.impact==='Medium'?'bg-amber-100 text-amber-700':'bg-emerald-100 text-emerald-700'}`}>{a.impact}</span></div>
                    <p className="text-sm text-gray-400 mb-2">{a.prediction}</p>
                    <div className="flex items-center justify-between mb-3"><span className="text-sm text-gray-400">Probability:</span><span className="text-sm font-medium text-white">{a.probability}</span></div>
                    <p className="text-sm text-cyan-400 font-medium">{a.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl">
            <div className="p-6 border-b border-white/10"><h3 className="text-lg font-semibold text-white">Cost Analysis Reports</h3></div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[{ color: 'bg-cyan-500', textC: 'text-cyan-400', icon: 'ri-money-dollar-circle-line', label: 'Total Spend', val: '$142,567' },{ color: 'bg-emerald-500', textC: 'text-emerald-400', icon: 'ri-arrow-down-circle-line', label: 'Cost Savings', val: '$18,432' },{ color: 'bg-amber-500', textC: 'text-amber-400', icon: 'ri-calendar-line', label: 'Budget Usage', val: '78%' },{ color: 'bg-violet-500', textC: 'text-violet-400', icon: 'ri-pie-chart-line', label: 'ROI', val: '124%' }].map((c: any, i: number) => (
                  <div key={i} className="text-center p-4 bg-white/5 rounded-lg">
                    <div className={`w-12 h-12 ${c.color} rounded-lg flex items-center justify-center mx-auto mb-3`}><i className={`${c.icon} text-white`}></i></div>
                    <h4 className="font-medium text-white mb-1">{c.label}</h4>
                    <p className={`text-2xl font-bold ${c.textC}`}>{c.val}</p>
                    <p className="text-sm text-gray-500">This month</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="flex min-h-screen bg-[#030912] items-center justify-center"><i className="ri-loader-4-line animate-spin text-cyan-400 text-3xl"></i></div>}>
        <AnalyticsContent />
      </Suspense>
    </AuthGuard>
  );
}