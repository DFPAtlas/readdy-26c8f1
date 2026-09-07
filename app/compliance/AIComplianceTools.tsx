'use client';

import { useState } from 'react';

const TOOLS = [
  {
    id: 'risk_assessment',
    title: 'AI Risk Assessment Generator',
    icon: 'ri-shield-check-line',
    color: 'bg-blue-100 text-blue-600',
    description: 'Generate a comprehensive risk assessment for any area or activity',
    placeholder: 'e.g. Manual handling in warehouse, Working at height on roof, Chemical storage...',
  },
  {
    id: 'rams',
    title: 'AI RAMS Generator',
    icon: 'ri-file-text-line',
    color: 'bg-purple-100 text-purple-600',
    description: 'Generate Risk Assessment & Method Statement for maintenance tasks',
    placeholder: 'e.g. HVAC maintenance on rooftop, Electrical panel inspection, Confined space entry...',
  },
  {
    id: 'compliance_summary',
    title: 'AI Compliance Summary',
    icon: 'ri-bar-chart-line',
    color: 'bg-green-100 text-green-600',
    description: 'Generate an executive compliance summary report for stakeholders',
    placeholder: 'e.g. Monthly compliance report for Building A, Q1 compliance overview...',
  },
  {
    id: 'maintenance_planner',
    title: 'AI Maintenance Planner',
    icon: 'ri-calendar-line',
    color: 'bg-orange-100 text-orange-600',
    description: 'Generate an optimised PPM schedule based on your assets and compliance requirements',
    placeholder: 'e.g. Annual PPM plan for office building, Quarterly maintenance schedule for HVAC...',
  },
];

const DEMO_OUTPUTS: Record<string, string> = {
  risk_assessment: `**RISK ASSESSMENT**\n\nActivity: Manual Handling Operations\nLocation: Warehouse / Facilities Areas\nAssessor: FM Manager | Date: ${new Date().toLocaleDateString('en-GB')}\n\n**HAZARDS IDENTIFIED:**\n1. Musculoskeletal injury from lifting heavy items\n2. Slips, trips and falls when carrying loads\n3. Crush injuries from dropped items\n4. Fatigue from repetitive handling\n\n**RISK MATRIX:**\n• Likelihood: Medium (3) | Severity: High (4) | Risk Rating: 12 (HIGH)\n\n**CONTROL MEASURES:**\n✓ Provide manual handling training to all staff\n✓ Use mechanical aids (trolleys, pallet trucks) for loads >10kg\n✓ Implement team lifting for loads >25kg\n✓ Ensure clear walkways and good lighting\n✓ Introduce job rotation to reduce repetitive strain\n✓ Conduct pre-task briefings for heavy lifts\n✓ Provide appropriate PPE (safety footwear, gloves)\n\n**RESIDUAL RISK:** Low (4) — Acceptable with controls in place\n\n**REVIEW DATE:** ${new Date(Date.now() + 365 * 86400000).toLocaleDateString('en-GB')}`,

  rams: `**RISK ASSESSMENT & METHOD STATEMENT (RAMS)**\n\nTask: HVAC Maintenance — Rooftop Units\nContractor: HVAC Specialists UK\nDate: ${new Date().toLocaleDateString('en-GB')}\n\n**SCOPE OF WORK:**\nRoutine maintenance of rooftop HVAC units including filter replacement, belt inspection, coil cleaning, and performance testing.\n\n**HAZARDS & CONTROLS:**\n1. Working at Height\n   → Use fixed access ladder with safety cage\n   → Wear fall arrest harness\n   → Establish exclusion zone below\n\n2. Electrical Hazards\n   → Isolate and lock-off power before work\n   → Use insulated tools\n   → Test before touch\n\n3. Moving Parts\n   → Ensure all fans stopped before access\n   → Use LOTO (Lock Out Tag Out) procedure\n\n4. Hot Surfaces\n   → Allow cooling period before contact\n   → Wear heat-resistant gloves\n\n**METHOD STATEMENT:**\nStep 1: Obtain permit to work from FM manager\nStep 2: Isolate electrical supply and apply LOTO\nStep 3: Access roof via designated ladder\nStep 4: Carry out maintenance tasks per schedule\nStep 5: Test system operation before leaving\nStep 6: Complete service record and sign off\n\n**PPE REQUIRED:** Hard hat, safety footwear, gloves, hi-vis vest, fall arrest harness\n\n**EMERGENCY PROCEDURE:** In case of emergency call 999. First aider: FM Office ext. 100`,

  compliance_summary: `**COMPLIANCE SUMMARY REPORT**\nPeriod: ${new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}\nPrepared by: Synqoro AI FM System\n\n**EXECUTIVE SUMMARY:**\nOverall site compliance score is 75%. Of 16 tracked compliance items, 10 are fully compliant, 3 are due for renewal within 30 days, 2 are overdue, and 1 has failed.\n\n**CRITICAL ACTIONS REQUIRED:**\n🔴 Electrical Installation Condition Report — OVERDUE (expired June 2026). Book EICR immediately with certified electrician.\n🔴 Risk Assessment (Manual Handling) — FAILED. Annual review not completed. Immediate action required.\n🟡 Emergency Lighting Test — Due 20 May 2026. Book with FireSafe Solutions.\n🟡 Water Temperature Monitoring — Due 15 May 2026. Schedule with AquaHygiene Services.\n🟡 Lift B Thorough Examination — Due 20 May 2026. Contact LiftTech Inspections.\n\n**COMPLIANT ITEMS (10):**\n✅ Fire Risk Assessment | ✅ Fire Alarm Test | ✅ Gas Safety Certificate\n✅ Legionella Risk Assessment | ✅ Asbestos Survey | ✅ HVAC Annual Service\n✅ Lift A Examination | ✅ PAT Testing | ✅ H&S Policy | ✅ Insurance\n\n**RECOMMENDATIONS:**\n1. Prioritise EICR booking — legal requirement\n2. Complete manual handling risk assessment review\n3. Set up automated reminders for all expiring items\n4. Consider quarterly compliance review meetings\n\n**NEXT REVIEW DATE:** ${new Date(Date.now() + 30 * 86400000).toLocaleDateString('en-GB')}`,

  maintenance_planner: `**OPTIMISED PPM MAINTENANCE PLAN**\nGenerated: ${new Date().toLocaleDateString('en-GB')}\nBuilding: All Sites | Period: Next 12 Months\n\n**MAY 2026 (URGENT):**\n• Emergency Lighting Monthly Test — Due NOW (overdue)\n• Water Temperature Checks — Due NOW (overdue)\n• CCTV System Quarterly Check — Due NOW (overdue)\n• Lift B Thorough Examination — Due 20 May\n• Fire Alarm Weekly Test — Due 12 May\n\n**JUNE 2026:**\n• HVAC Filter Replacement (Building A)\n• Generator Monthly Test\n• Electrical Distribution Board Annual Inspection\n• Fire Alarm Weekly Tests (x4)\n\n**QUARTERLY SCHEDULE (Q3 2026):**\n• Lift A & B Quarterly Maintenance — July\n• Roof Drainage Inspection — August\n• CCTV System Check — August\n• HVAC Filter Replacement — September\n\n**ANNUAL SCHEDULE (2026-2027):**\n• Boiler Annual Service — November 2026\n• Electrical EICR — BOOK IMMEDIATELY (overdue)\n• PAT Testing — October 2026\n• Fire Risk Assessment — November 2026\n• Legionella Risk Assessment — January 2027\n\n**ENGINEER WORKLOAD ESTIMATE:**\n• Mike Johnson: 28 hours/month\n• Sarah Chen: 18 hours/month\n• Tom Wilson: 22 hours/month\n• Alex Davis: 15 hours/month\n\n**ESTIMATED ANNUAL COST:** £42,500 (labour + contractors)`,
};

export default function AIComplianceTools() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!activeTool) return;
    setGenerating(true);
    setOutput('');
    await new Promise(r => setTimeout(r, 2000));
    setOutput(DEMO_OUTPUTS[activeTool] || 'AI output generated successfully.');
    setGenerating(false);
  };

  const activeCfg = TOOLS.find(t => t.id === activeTool);

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
        <div className="flex items-center gap-2 mb-1">
          <i className="ri-sparkling-2-line text-purple-600"></i>
          <span className="text-sm font-semibold text-purple-800">AI Compliance & Safety Tools</span>
        </div>
        <p className="text-xs text-purple-600">Use AI to generate risk assessments, RAMS, compliance summaries, and maintenance plans instantly.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {TOOLS.map(tool => (
          <button key={tool.id} onClick={() => { setActiveTool(tool.id); setOutput(''); setInput(''); }}
            className={`text-left p-4 rounded-xl border-2 cursor-pointer transition-all ${activeTool === tool.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white hover:border-blue-200 hover:bg-gray-50'}`}>
            <div className={`w-9 h-9 ${tool.color} rounded-lg flex items-center justify-center mb-2`}>
              <i className={`${tool.icon} text-sm`}></i>
            </div>
            <p className="text-sm font-semibold text-gray-800 mb-1">{tool.title}</p>
            <p className="text-xs text-gray-500">{tool.description}</p>
          </button>
        ))}
      </div>

      {activeTool && activeCfg && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-7 h-7 ${activeCfg.color} rounded-lg flex items-center justify-center`}>
              <i className={`${activeCfg.icon} text-xs`}></i>
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">{activeCfg.title}</h3>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={3} maxLength={500}
            placeholder={activeCfg.placeholder}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 resize-none mb-3" />
          <button onClick={handleGenerate} disabled={generating}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:opacity-90 cursor-pointer disabled:opacity-60 transition-opacity whitespace-nowrap">
            {generating ? (
              <><i className="ri-loader-4-line animate-spin"></i> Generating...</>
            ) : (
              <><i className="ri-sparkling-line"></i> Generate with AI</>
            )}
          </button>

          {output && (
            <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Generated Output</span>
                <button onClick={() => navigator.clipboard?.writeText(output)} className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer">
                  <i className="ri-file-copy-line mr-1"></i>Copy
                </button>
              </div>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{output}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}