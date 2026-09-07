'use client';

import { useState } from 'react';

export default function WOAITab({ order }: { order: any }) {
  const [generating, setGenerating] = useState<string | null>(null);
  const [summary, setSummary] = useState(order.ai_summary || '');
  const [troubleshooting, setTroubleshooting] = useState(order.ai_troubleshooting || '');
  const [recommendations, setRecommendations] = useState(order.ai_recommendations || '');

  const DEMO_SUMMARY = `This is a ${order.priority} priority ${order.type} work order for "${order.title}". The job was raised on ${new Date(order.created_at).toLocaleDateString('en-GB')} and is currently ${order.status?.replace('_', ' ')}. ${order.assigned_engineer ? `Assigned to ${order.assigned_engineer}.` : 'Currently unassigned.'} ${order.due_date ? `Due by ${new Date(order.due_date).toLocaleDateString('en-GB')}.` : ''} ${order.labour_hours ? `${order.labour_hours} labour hours logged.` : ''} ${order.materials_cost ? `Materials cost: £${order.materials_cost}.` : ''}`;

  const DEMO_TROUBLESHOOTING = `Based on the reported issue, here are recommended troubleshooting steps:\n\n1. **Initial Assessment** — Conduct a visual inspection of the affected equipment and surrounding area. Document any visible damage, unusual sounds, or environmental factors.\n\n2. **Safety Check** — Ensure all relevant safety protocols are followed. Isolate power if working on electrical systems. Check for any immediate hazards.\n\n3. **Diagnostic Testing** — Use appropriate diagnostic tools to identify the root cause. Check error codes, test components, and measure performance against specifications.\n\n4. **Root Cause Analysis** — Identify whether the issue is due to wear and tear, improper use, environmental factors, or component failure.\n\n5. **Repair or Replace** — Based on findings, determine whether repair or replacement is more cost-effective. Consider asset age and remaining useful life.\n\n6. **Test & Verify** — After completing work, test the system under normal operating conditions to confirm the issue is resolved.\n\n7. **Documentation** — Record all findings, actions taken, and parts used in the work order system.`;

  const DEMO_RECOMMENDATIONS = `**Preventive Maintenance Recommendations:**\n\n• Schedule regular inspections every ${order.type === 'reactive' ? '3 months' : '6 months'} to prevent recurrence\n• Review maintenance history for patterns of similar failures\n• Consider upgrading to higher-specification components if failures are frequent\n• Ensure engineers are trained on latest maintenance procedures\n• Update the asset register with current condition and service notes\n\n**SLA & Response Time:**\n• Current priority level suggests a ${order.priority === 'emergency' ? '2-hour' : order.priority === 'high' ? '4-hour' : order.priority === 'medium' ? '24-hour' : '72-hour'} response target\n• Consider reviewing SLA agreements with client if this type of fault is recurring\n\n**Cost Optimisation:**\n• Bulk ordering of commonly used parts can reduce material costs by 15-20%\n• Planned maintenance visits can be combined with other jobs at the same site to reduce travel costs`;

  const generate = async (type: string) => {
    setGenerating(type);
    await new Promise(r => setTimeout(r, 1500));
    if (type === 'summary') setSummary(DEMO_SUMMARY);
    if (type === 'troubleshooting') setTroubleshooting(DEMO_TROUBLESHOOTING);
    if (type === 'recommendations') setRecommendations(DEMO_RECOMMENDATIONS);
    setGenerating(null);
  };

  const AICard = ({ title, icon, content, type, color }: { title: string; icon: string; content: string; type: string; color: string }) => (
    <div className={`bg-white rounded-xl border border-gray-100 p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center`}>
            <i className={`${icon} text-sm`}></i>
          </div>
          <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
        </div>
        <button onClick={() => generate(type)} disabled={generating === type}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-xs font-medium hover:opacity-90 cursor-pointer transition-opacity disabled:opacity-60 whitespace-nowrap">
          {generating === type ? (
            <><i className="ri-loader-4-line animate-spin"></i> Generating...</>
          ) : (
            <><i className="ri-sparkling-line"></i> {content ? 'Regenerate' : 'Generate with AI'}</>
          )}
        </button>
      </div>
      {content ? (
        <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 rounded-lg p-4 border border-gray-100">
          {content}
        </div>
      ) : (
        <div className="text-sm text-gray-400 italic bg-gray-50 rounded-lg p-4 border border-dashed border-gray-200 text-center">
          Click "Generate with AI" to get intelligent insights for this work order
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <i className="ri-sparkling-2-line text-purple-600"></i>
          <span className="text-sm font-semibold text-purple-800">AI-Powered Insights</span>
        </div>
        <p className="text-xs text-purple-600">Use AI to automatically generate job summaries, troubleshooting guides, and maintenance recommendations based on this work order's details.</p>
      </div>
      <AICard title="Job Summary" icon="ri-file-text-line" content={summary} type="summary" color="bg-blue-100 text-blue-600" />
      <AICard title="Troubleshooting Guide" icon="ri-tools-line" content={troubleshooting} type="troubleshooting" color="bg-orange-100 text-orange-600" />
      <AICard title="Maintenance Recommendations" icon="ri-lightbulb-line" content={recommendations} type="recommendations" color="bg-green-100 text-green-600" />
    </div>
  );
}