'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import AuthGuard from '@/components/AuthGuard';
import { fetchPlatformContext, PlatformContext } from '@/lib/aiEngine';
import AIRiskWidget from './AIRiskWidget';
import AIPredictiveWidget from './AIPredictiveWidget';
import AIRecommendationsWidget from './AIRecommendationsWidget';
import AIDocumentAnalysis from './AIDocumentAnalysis';
import AIVoiceReporting from './AIVoiceReporting';
import AISmartScheduling from './AISmartScheduling';

const EMPTY_CTX: PlatformContext = { workOrders: [], assets: [], compliance: [], ppmSchedules: [], contractors: [], sites: [] };

const DEMO_CTX: PlatformContext = {
  workOrders: [
    { id: 1, job_id: 'WO-2026-001', title: 'HVAC Fault', priority: 'high', status: 'in_progress', due_date: '2026-05-10', assigned_engineer: 'Mike Johnson', labour_hours: 3.5 },
    { id: 2, job_id: 'WO-2026-002', title: 'Emergency Lighting Test', priority: 'medium', status: 'completed', due_date: '2026-05-10', assigned_engineer: 'Sarah Chen', labour_hours: 2 },
    { id: 3, job_id: 'WO-2026-003', title: 'Boiler Service', priority: 'high', status: 'assigned', due_date: '2026-05-20', assigned_engineer: 'Tom Wilson', labour_hours: 0 },
    { id: 4, job_id: 'WO-2026-004', title: 'Water Leak Emergency', priority: 'emergency', status: 'in_progress', due_date: '2026-05-12', assigned_engineer: 'Alex Davis', labour_hours: 5 },
    { id: 5, job_id: 'WO-2026-005', title: 'Fire Alarm Fault', priority: 'high', status: 'awaiting_parts', due_date: '2026-05-08', assigned_engineer: 'Mike Johnson', labour_hours: 1.5 },
    { id: 6, job_id: 'WO-2026-006', title: 'Lift Maintenance', priority: 'medium', status: 'new', due_date: '2026-05-25', assigned_engineer: null, labour_hours: 0 },
    { id: 7, job_id: 'WO-2026-007', title: 'CCTV Replacement', priority: 'medium', status: 'completed', due_date: '2026-05-08', assigned_engineer: 'Sarah Chen', labour_hours: 4 },
    { id: 15, job_id: 'WO-2026-015', title: 'Emergency Exit Door', priority: 'emergency', status: 'in_progress', due_date: '2026-05-12', assigned_engineer: 'Alex Davis', labour_hours: 1 },
  ],
  assets: [
    { id: 1, name: 'HVAC Unit A-201', status: 'critical', install_date: '2014-03-01' },
    { id: 2, name: 'Main Boiler System', status: 'active', install_date: '2009-06-01' },
    { id: 3, name: 'Emergency Generator', status: 'active', install_date: '2018-01-01' },
    { id: 4, name: 'Fire Alarm Panel', status: 'active', install_date: '2020-05-01' },
    { id: 5, name: 'Passenger Lift A', status: 'active', install_date: '2016-09-01' },
  ],
  compliance: [
    { id: 1, title: 'Fire Risk Assessment', category: 'fire_safety', status: 'compliant', expiry_date: '2026-11-15' },
    { id: 2, title: 'Emergency Lighting Test', category: 'emergency_lighting', status: 'due_soon', expiry_date: '2026-05-20' },
    { id: 3, title: 'EICR', category: 'electrical', status: 'overdue', expiry_date: '2026-06-01' },
    { id: 4, title: 'Gas Safety Certificate', category: 'gas_safety', status: 'compliant', expiry_date: '2026-12-10' },
    { id: 5, title: 'Risk Assessment - Manual Handling', category: 'risk_assessment', status: 'failed', expiry_date: '2025-06-01' },
    { id: 6, title: 'Water Temperature Monitoring', category: 'water_hygiene', status: 'due_soon', expiry_date: '2026-05-15' },
    { id: 7, title: 'Lift B Examination', category: 'lift_inspection', status: 'due_soon', expiry_date: '2026-05-20' },
    { id: 8, title: 'PAT Testing', category: 'pat_testing', status: 'compliant', expiry_date: '2026-10-01' },
  ],
  ppmSchedules: [
    { id: 1, title: 'HVAC Filter Replacement', frequency: 'monthly', status: 'active', next_due: '2026-05-12', assigned_engineer: 'Mike Johnson' },
    { id: 2, title: 'Emergency Lighting Test', frequency: 'monthly', status: 'overdue', next_due: '2026-05-01', assigned_engineer: 'Sarah Chen' },
    { id: 3, title: 'Water Temperature Checks', frequency: 'monthly', status: 'overdue', next_due: '2026-05-01', assigned_engineer: 'Mike Johnson' },
    { id: 4, title: 'CCTV System Check', frequency: 'quarterly', status: 'overdue', next_due: '2026-05-01', assigned_engineer: 'Alex Davis' },
    { id: 5, title: 'Generator Monthly Test', frequency: 'monthly', status: 'active', next_due: '2026-05-10', assigned_engineer: 'Tom Wilson' },
  ],
  contractors: [
    { id: 1, name: 'FireSafe Solutions Ltd', speciality: 'Fire Safety', status: 'active', rating: 4.8 },
    { id: 2, name: 'ElecTest Pro', speciality: 'Electrical', status: 'active', rating: 4.6 },
    { id: 3, name: 'AquaHygiene Services', speciality: 'Water Hygiene', status: 'active', rating: 4.9 },
  ],
  sites: [
    { id: 1, name: 'Acme Corp HQ', city: 'London', status: 'active' },
    { id: 2, name: 'TechHub Ltd', city: 'Manchester', status: 'active' },
    { id: 3, name: 'City Tower', city: 'Birmingham', status: 'active' },
    { id: 4, name: 'Riverside Office', city: 'Leeds', status: 'active' },
  ],
};

export default function AIDashboardPage() {
  const [ctx, setCtx] = useState<PlatformContext>(DEMO_CTX);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlatformContext().then(data => {
      const hasData = data.workOrders.length > 0 || data.compliance.length > 0;
      setCtx(hasData ? data : DEMO_CTX);
    }).catch(() => setCtx(DEMO_CTX)).finally(() => setLoading(false));
  }, []);

  const completionRate = ctx.workOrders.length > 0 ? Math.round((ctx.workOrders.filter(w => w.status === 'completed').length / ctx.workOrders.length) * 100) : 0;
  const complianceScore = ctx.compliance.length > 0 ? Math.round((ctx.compliance.filter(c => c.status === 'compliant').length / ctx.compliance.length) * 100) : 0;

  return (
    <AuthGuard>
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <TopBar title="AI Intelligence Hub" />
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <i className="ri-sparkling-2-line text-white"></i>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">AI Intelligence Hub</h1>
              </div>
              <p className="text-sm text-gray-500 ml-12">Powered by Synqoro AI — connected to live platform data</p>
            </div>
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-green-700 font-medium">AI Active</span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4 mb-6">
            {[
              { label: 'Work Orders', value: ctx.workOrders.length, icon: 'ri-tools-line', color: 'bg-blue-500', sub: `${ctx.workOrders.filter(w => !['completed','cancelled'].includes(w.status)).length} active` },
              { label: 'Completion Rate', value: `${completionRate}%`, icon: 'ri-checkbox-circle-line', color: completionRate >= 70 ? 'bg-green-500' : 'bg-amber-500', sub: 'Work orders' },
              { label: 'Compliance Score', value: `${complianceScore}%`, icon: 'ri-shield-check-line', color: complianceScore >= 80 ? 'bg-green-500' : 'bg-red-500', sub: `${ctx.compliance.filter(c => c.status !== 'compliant').length} issues` },
              { label: 'Assets Tracked', value: ctx.assets.length, icon: 'ri-database-2-line', color: 'bg-purple-500', sub: `${ctx.assets.filter(a => a.status === 'critical' || a.status === 'Critical').length} critical` },
              { label: 'PPM Schedules', value: ctx.ppmSchedules.length, icon: 'ri-calendar-check-line', color: 'bg-indigo-500', sub: `${ctx.ppmSchedules.filter(p => p.status === 'overdue').length} overdue` },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className={`w-9 h-9 ${s.color} rounded-lg flex items-center justify-center mb-3`}>
                  <i className={`${s.icon} text-white text-sm`}></i>
                </div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-5 mb-5">
            <AIRiskWidget ctx={ctx} />
            <AIPredictiveWidget assets={ctx.assets} />
            <AIRecommendationsWidget ctx={ctx} />
          </div>

          <div className="grid grid-cols-3 gap-5">
            <AISmartScheduling />
            <AIVoiceReporting />
            <AIDocumentAnalysis />
          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}