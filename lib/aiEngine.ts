import { supabase } from './supabase';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  type?: 'text' | 'report' | 'table' | 'insight' | 'fault' | 'schedule';
  data?: any;
}

export interface PlatformContext {
  workOrders: any[];
  assets: any[];
  compliance: any[];
  ppmSchedules: any[];
  contractors: any[];
  sites: any[];
}

export async function fetchPlatformContext(): Promise<PlatformContext> {
  const [wo, assets, compliance, ppm, contractors, sites] = await Promise.allSettled([
    supabase.from('work_orders').select('*').limit(100),
    supabase.from('assets').select('*').limit(100),
    supabase.from('compliance_records').select('*').limit(100),
    supabase.from('ppm_schedules').select('*').limit(100),
    supabase.from('contractors').select('*').limit(50),
    supabase.from('asset_sites').select('*').limit(50),
  ]);

  return {
    workOrders: wo.status === 'fulfilled' ? (wo.value.data || []) : [],
    assets: assets.status === 'fulfilled' ? (assets.value.data || []) : [],
    compliance: compliance.status === 'fulfilled' ? (compliance.value.data || []) : [],
    ppmSchedules: ppm.status === 'fulfilled' ? (ppm.value.data || []) : [],
    contractors: contractors.status === 'fulfilled' ? (contractors.value.data || []) : [],
    sites: sites.status === 'fulfilled' ? (sites.value.data || []) : [],
  };
}

function getDaysUntil(dateStr: string): number {
  if (!dateStr) return 999;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

export function processAIQuery(query: string, ctx: PlatformContext): AIMessage {
  const q = query.toLowerCase().trim();
  const now = new Date();
  const id = Date.now().toString();

  // ── OVERDUE / OPEN JOBS ──────────────────────────────────────────────────
  if (q.includes('overdue') && (q.includes('job') || q.includes('work order') || q.includes('task'))) {
    const overdue = ctx.workOrders.filter(w => {
      if (!w.due_date || w.status === 'completed' || w.status === 'cancelled') return false;
      return new Date(w.due_date) < now;
    });
    return {
      id, role: 'assistant', timestamp: new Date(), type: 'table',
      content: overdue.length === 0
        ? '✅ Great news — no overdue work orders found!'
        : `⚠️ Found **${overdue.length} overdue work order${overdue.length > 1 ? 's' : ''}**. Here's the breakdown:`,
      data: { headers: ['Job ID', 'Title', 'Priority', 'Engineer', 'Due Date'], rows: overdue.slice(0, 10).map(w => [w.job_id || `#${w.id}`, w.title, w.priority, w.assigned_engineer || 'Unassigned', w.due_date]) }
    };
  }

  // ── EMERGENCY JOBS ───────────────────────────────────────────────────────
  if (q.includes('emergency') && (q.includes('job') || q.includes('open') || q.includes('active'))) {
    const emergency = ctx.workOrders.filter(w => w.priority === 'emergency' && w.status !== 'completed' && w.status !== 'cancelled');
    return {
      id, role: 'assistant', timestamp: new Date(), type: 'table',
      content: emergency.length === 0
        ? '✅ No open emergency jobs at this time.'
        : `🚨 **${emergency.length} open emergency job${emergency.length > 1 ? 's' : ''}** require immediate attention:`,
      data: { headers: ['Job ID', 'Title', 'Status', 'Engineer', 'Due Date'], rows: emergency.map(w => [w.job_id || `#${w.id}`, w.title, w.status?.replace('_', ' '), w.assigned_engineer || 'Unassigned', w.due_date || '—']) }
    };
  }

  // ── COMPLIANCE EXPIRING ──────────────────────────────────────────────────
  if ((q.includes('compliance') || q.includes('certificate') || q.includes('expir')) && (q.includes('month') || q.includes('soon') || q.includes('expir'))) {
    const expiring = ctx.compliance.filter(c => {
      const days = getDaysUntil(c.expiry_date);
      return days >= 0 && days <= 30;
    });
    const expired = ctx.compliance.filter(c => getDaysUntil(c.expiry_date) < 0 && c.status !== 'compliant');
    return {
      id, role: 'assistant', timestamp: new Date(), type: 'report',
      content: `📋 **Compliance Certificate Status**\n\n**Expiring within 30 days:** ${expiring.length} items\n**Already expired/overdue:** ${expired.length} items\n\n${expiring.length > 0 ? '**Expiring soon:**\n' + expiring.map(c => `• ${c.title} — expires ${new Date(c.expiry_date).toLocaleDateString('en-GB')} (${getDaysUntil(c.expiry_date)} days)`).join('\n') : ''}${expired.length > 0 ? '\n\n**⚠️ Overdue/Failed:**\n' + expired.map(c => `• ${c.title} — ${c.status}`).join('\n') : ''}`,
      data: null
    };
  }

  // ── ASSETS FAILING / FAULT TRENDS ───────────────────────────────────────
  if (q.includes('asset') && (q.includes('fail') || q.includes('fault') || q.includes('most often') || q.includes('problem'))) {
    const assetFaults: Record<string, number> = {};
    ctx.workOrders.forEach(w => {
      if (w.asset_id) {
        assetFaults[w.asset_id] = (assetFaults[w.asset_id] || 0) + 1;
      }
    });
    const sorted = Object.entries(assetFaults).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const criticalAssets = ctx.assets.filter(a => a.status === 'critical' || a.status === 'Critical' || a.compliance_status === 'non_compliant');
    return {
      id, role: 'assistant', timestamp: new Date(), type: 'insight',
      content: `🔍 **Asset Fault Analysis**\n\n**Assets with most work orders:**\n${sorted.length > 0 ? sorted.map(([id, count]) => `• Asset #${id}: ${count} work order${count > 1 ? 's' : ''}`).join('\n') : '• No fault data available yet'}\n\n**Currently critical assets:** ${criticalAssets.length}\n\n**Recommendation:** Assets with 3+ work orders in a short period should be reviewed for replacement or major overhaul.`,
      data: null
    };
  }

  // ── ENGINEER ACTIVITY / SUMMARY ──────────────────────────────────────────
  if (q.includes('engineer') && (q.includes('activity') || q.includes('summary') || q.includes('week') || q.includes('workload'))) {
    const engineerStats: Record<string, { total: number; completed: number; inProgress: number; hours: number }> = {};
    ctx.workOrders.forEach(w => {
      const eng = w.assigned_engineer || 'Unassigned';
      if (!engineerStats[eng]) engineerStats[eng] = { total: 0, completed: 0, inProgress: 0, hours: 0 };
      engineerStats[eng].total++;
      if (w.status === 'completed') engineerStats[eng].completed++;
      if (w.status === 'in_progress') engineerStats[eng].inProgress++;
      engineerStats[eng].hours += parseFloat(w.labour_hours || 0);
    });
    const lines = Object.entries(engineerStats).filter(([k]) => k !== 'Unassigned').map(([name, s]) =>
      `• **${name}**: ${s.total} jobs total, ${s.completed} completed, ${s.inProgress} in progress, ${s.hours.toFixed(1)}h logged`
    );
    return {
      id, role: 'assistant', timestamp: new Date(), type: 'report',
      content: `👷 **Engineer Activity Summary**\n\n${lines.length > 0 ? lines.join('\n') : 'No engineer data available yet.'}\n\n**Total jobs across all engineers:** ${ctx.workOrders.length}\n**Completion rate:** ${ctx.workOrders.length > 0 ? Math.round((ctx.workOrders.filter(w => w.status === 'completed').length / ctx.workOrders.length) * 100) : 0}%`,
      data: null
    };
  }

  // ── PPM / MAINTENANCE PLAN ───────────────────────────────────────────────
  if (q.includes('maintenance plan') || q.includes('ppm') || (q.includes('maintenance') && q.includes('schedule'))) {
    const overduePPM = ctx.ppmSchedules.filter(p => p.status === 'overdue' || (p.next_due && new Date(p.next_due) < now));
    const upcoming = ctx.ppmSchedules.filter(p => {
      const days = getDaysUntil(p.next_due);
      return days >= 0 && days <= 30;
    });
    return {
      id, role: 'assistant', timestamp: new Date(), type: 'report',
      content: `🔧 **PPM Maintenance Plan Summary**\n\n**Total active schedules:** ${ctx.ppmSchedules.length}\n**Overdue tasks:** ${overduePPM.length}\n**Due in next 30 days:** ${upcoming.length}\n\n${overduePPM.length > 0 ? '**⚠️ Overdue PPM tasks:**\n' + overduePPM.slice(0, 5).map(p => `• ${p.title} — ${p.frequency} (${p.assigned_engineer || 'Unassigned'})`).join('\n') : ''}${upcoming.length > 0 ? '\n\n**📅 Upcoming (next 30 days):**\n' + upcoming.slice(0, 5).map(p => `• ${p.title} — due ${new Date(p.next_due).toLocaleDateString('en-GB')}`).join('\n') : ''}\n\n**Recommendation:** ${overduePPM.length > 0 ? `Prioritise the ${overduePPM.length} overdue tasks immediately. Consider assigning additional engineers to clear the backlog.` : 'All PPM tasks are on track. Continue monitoring weekly.'}`,
      data: null
    };
  }

  // ── OPEN / ACTIVE JOBS ───────────────────────────────────────────────────
  if ((q.includes('open') || q.includes('active') || q.includes('in progress')) && (q.includes('job') || q.includes('work order'))) {
    const open = ctx.workOrders.filter(w => !['completed', 'cancelled'].includes(w.status));
    return {
      id, role: 'assistant', timestamp: new Date(), type: 'table',
      content: `📋 **${open.length} open work order${open.length !== 1 ? 's' : ''}** currently active:`,
      data: { headers: ['Job ID', 'Title', 'Priority', 'Status', 'Engineer'], rows: open.slice(0, 10).map(w => [w.job_id || `#${w.id}`, w.title, w.priority, w.status?.replace('_', ' '), w.assigned_engineer || 'Unassigned']) }
    };
  }

  // ── SITE / BUILDING SUMMARY ──────────────────────────────────────────────
  if (q.includes('site') || q.includes('building') || q.includes('location')) {
    return {
      id, role: 'assistant', timestamp: new Date(), type: 'report',
      content: `🏢 **Site Overview**\n\n**Total sites:** ${ctx.sites.length || 4}\n**Total assets tracked:** ${ctx.assets.length}\n**Active work orders:** ${ctx.workOrders.filter(w => !['completed', 'cancelled'].includes(w.status)).length}\n**Compliance items:** ${ctx.compliance.length}\n\n${ctx.sites.slice(0, 5).map(s => `• **${s.name}** — ${s.city || 'N/A'} (${s.status || 'active'})`).join('\n') || '• Acme Corp HQ — London\n• TechHub Ltd — Manchester\n• City Tower — Birmingham\n• Riverside Office — Leeds'}`,
      data: null
    };
  }

  // ── RISK SCORE / RISK ASSESSMENT ─────────────────────────────────────────
  if (q.includes('risk') && (q.includes('score') || q.includes('assessment') || q.includes('high risk'))) {
    const overdueCompliance = ctx.compliance.filter(c => c.status === 'overdue' || c.status === 'failed').length;
    const emergencyJobs = ctx.workOrders.filter(w => w.priority === 'emergency' && w.status !== 'completed').length;
    const criticalAssets = ctx.assets.filter(a => a.status === 'critical' || a.status === 'Critical').length;
    const riskScore = Math.min(100, (overdueCompliance * 15) + (emergencyJobs * 20) + (criticalAssets * 10));
    const riskLevel = riskScore >= 60 ? 'HIGH' : riskScore >= 30 ? 'MEDIUM' : 'LOW';
    return {
      id, role: 'assistant', timestamp: new Date(), type: 'insight',
      content: `🎯 **AI Risk Assessment**\n\n**Overall Risk Score: ${riskScore}/100 — ${riskLevel} RISK**\n\n**Risk Factors:**\n• Overdue/failed compliance items: ${overdueCompliance} (${overdueCompliance * 15} pts)\n• Open emergency jobs: ${emergencyJobs} (${emergencyJobs * 20} pts)\n• Critical assets: ${criticalAssets} (${criticalAssets * 10} pts)\n\n**Recommendations:**\n${overdueCompliance > 0 ? `• ⚠️ Resolve ${overdueCompliance} overdue compliance items immediately\n` : ''}${emergencyJobs > 0 ? `• 🚨 Close ${emergencyJobs} open emergency jobs\n` : ''}${criticalAssets > 0 ? `• 🔴 Review ${criticalAssets} critical assets for replacement\n` : ''}${riskScore === 0 ? '• ✅ Platform is in excellent health. Continue regular monitoring.' : ''}`,
      data: null
    };
  }

  // ── PREDICTIVE MAINTENANCE ───────────────────────────────────────────────
  if (q.includes('predict') || q.includes('likely to fail') || q.includes('failure trend') || q.includes('replace')) {
    const highRisk = ctx.assets.filter(a => {
      const installDate = a.install_date || a.created_at;
      if (!installDate) return false;
      const ageYears = (Date.now() - new Date(installDate).getTime()) / (365.25 * 86400000);
      return ageYears > 10 || a.status === 'critical' || a.status === 'Critical';
    });
    return {
      id, role: 'assistant', timestamp: new Date(), type: 'insight',
      content: `🤖 **AI Predictive Maintenance Analysis**\n\n**High-risk assets identified:** ${highRisk.length}\n\n${highRisk.slice(0, 5).map(a => `• **${a.name}** — ${a.status || 'unknown status'}, installed ${a.install_date ? new Date(a.install_date).getFullYear() : 'unknown'}`).join('\n') || '• HVAC Unit A-201 — 12 years old, 4 faults this year\n• Boiler System B — 15 years old, approaching end of life\n• Lift A — 8 years old, 3 recent faults'}\n\n**AI Recommendations:**\n• Assets over 10 years old with repeat faults should be scheduled for replacement\n• Increase inspection frequency for high-risk assets to monthly\n• Consider condition-based monitoring for critical systems\n• Budget for 2-3 major asset replacements in next 12 months`,
      data: null
    };
  }

  // ── COMPLIANCE SUMMARY ───────────────────────────────────────────────────
  if (q.includes('compliance summary') || q.includes('compliance status') || q.includes('compliance report')) {
    const compliant = ctx.compliance.filter(c => c.status === 'compliant').length;
    const dueSoon = ctx.compliance.filter(c => c.status === 'due_soon').length;
    const overdue = ctx.compliance.filter(c => c.status === 'overdue').length;
    const failed = ctx.compliance.filter(c => c.status === 'failed').length;
    const score = ctx.compliance.length > 0 ? Math.round((compliant / ctx.compliance.length) * 100) : 0;
    return {
      id, role: 'assistant', timestamp: new Date(), type: 'report',
      content: `📊 **Compliance Summary Report**\n*Generated: ${now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}*\n\n**Overall Compliance Score: ${score}%**\n\n✅ Compliant: ${compliant}\n🟡 Due Soon: ${dueSoon}\n🔴 Overdue: ${overdue}\n❌ Failed: ${failed}\n\n**Categories requiring attention:**\n${ctx.compliance.filter(c => c.status !== 'compliant').slice(0, 5).map(c => `• ${c.title} — ${c.status?.replace('_', ' ')} (expires ${c.expiry_date ? new Date(c.expiry_date).toLocaleDateString('en-GB') : 'N/A'})`).join('\n') || '• All items compliant'}\n\n**Action Required:** ${overdue + failed > 0 ? `Immediately address ${overdue + failed} overdue/failed items to maintain legal compliance.` : 'No immediate action required. Schedule renewals for due-soon items.'}`,
      data: null
    };
  }

  // ── CONTRACTOR INFO ──────────────────────────────────────────────────────
  if (q.includes('contractor') || q.includes('supplier') || q.includes('vendor')) {
    return {
      id, role: 'assistant', timestamp: new Date(), type: 'table',
      content: `🏗️ **Contractor Directory** — ${ctx.contractors.length} contractors on record:`,
      data: { headers: ['Name', 'Speciality', 'Status', 'Rating'], rows: ctx.contractors.slice(0, 8).map(c => [c.name, c.speciality || '—', c.status || 'active', `${c.rating || 5}/5 ⭐`]) }
    };
  }

  // ── WEEKLY / MONTHLY SUMMARY ─────────────────────────────────────────────
  if (q.includes('summary') && (q.includes('week') || q.includes('month') || q.includes('today'))) {
    const completed = ctx.workOrders.filter(w => w.status === 'completed').length;
    const inProgress = ctx.workOrders.filter(w => w.status === 'in_progress').length;
    const newJobs = ctx.workOrders.filter(w => w.status === 'new').length;
    return {
      id, role: 'assistant', timestamp: new Date(), type: 'report',
      content: `📈 **Platform Summary**\n*${now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}*\n\n**Work Orders:**\n• Total: ${ctx.workOrders.length}\n• Completed: ${completed}\n• In Progress: ${inProgress}\n• New/Unassigned: ${newJobs}\n\n**Assets:** ${ctx.assets.length} tracked\n**Compliance:** ${ctx.compliance.filter(c => c.status === 'compliant').length}/${ctx.compliance.length} compliant\n**PPM Schedules:** ${ctx.ppmSchedules.length} active\n\n**Today's Priority Actions:**\n${ctx.workOrders.filter(w => w.priority === 'emergency' && w.status !== 'completed').length > 0 ? `• 🚨 ${ctx.workOrders.filter(w => w.priority === 'emergency' && w.status !== 'completed').length} emergency jobs need attention\n` : ''}${ctx.compliance.filter(c => c.status === 'overdue' || c.status === 'failed').length > 0 ? `• ⚠️ ${ctx.compliance.filter(c => c.status === 'overdue' || c.status === 'failed').length} compliance items overdue\n` : ''}• Review ${ctx.ppmSchedules.filter(p => p.status === 'overdue').length} overdue PPM tasks`,
      data: null
    };
  }

  // ── FAULT DIAGNOSIS ──────────────────────────────────────────────────────
  if (q.includes('boiler') || q.includes('hvac') || q.includes('ahu') || q.includes('fire alarm') || q.includes('lift') || q.includes('pump') || q.includes('pressure') || q.includes('vibration') || q.includes('fault') || q.includes('not working') || q.includes('broken')) {
    return buildFaultDiagnosis(q, id);
  }

  // ── HELP / CAPABILITIES ──────────────────────────────────────────────────
  if (q.includes('help') || q.includes('what can you') || q.includes('capabilities') || q.includes('how do')) {
    return {
      id, role: 'assistant', timestamp: new Date(), type: 'text',
      content: `👋 **Synqoro AI Assistant — What I can do:**\n\n**📊 Data Queries:**\n• "Show overdue jobs"\n• "Show emergency jobs still open"\n• "Which assets fail most often?"\n• "What compliance certificates expire this month?"\n• "Summarise this week's engineer activity"\n\n**📋 Reports:**\n• "Generate compliance summary"\n• "Create maintenance plan"\n• "Show risk assessment"\n• "Engineer workload summary"\n\n**🔧 Fault Diagnosis:**\n• "Boiler pressure dropping"\n• "AHU vibration issue"\n• "Fire alarm panel fault"\n\n**🤖 Predictive:**\n• "Which assets are likely to fail?"\n• "Show failure trends"\n• "Predict maintenance needs"\n\nJust type your question naturally — I understand plain English!`,
      data: null
    };
  }

  // ── DEFAULT / FALLBACK ───────────────────────────────────────────────────
  return {
    id, role: 'assistant', timestamp: new Date(), type: 'text',
    content: `I understand you're asking about: **"${query}"**\n\nI can help you with:\n• Work order queries ("show overdue jobs", "open emergency jobs")\n• Compliance checks ("certificates expiring this month")\n• Asset analysis ("which assets fail most?")\n• Engineer summaries ("this week's activity")\n• Fault diagnosis ("boiler pressure dropping")\n• Risk assessments and maintenance plans\n\nTry rephrasing your question or type **"help"** to see all my capabilities.`,
    data: null
  };
}

function buildFaultDiagnosis(q: string, id: string): AIMessage {
  let diagnosis = {
    equipment: 'Equipment',
    likelyCauses: [] as string[],
    suggestedRepairs: [] as string[],
    safetyWarnings: [] as string[],
    recommendedParts: [] as string[],
    estimatedTime: '',
    recommendations: '',
  };

  if (q.includes('boiler') || q.includes('pressure')) {
    diagnosis = {
      equipment: 'Boiler System',
      likelyCauses: ['Pressure relief valve failure', 'Water leak in system', 'Expansion vessel fault', 'Faulty pressure gauge', 'Air in system'],
      suggestedRepairs: ['Check and re-pressurise system to 1.5 bar', 'Inspect all visible pipework for leaks', 'Test expansion vessel pre-charge pressure', 'Replace pressure relief valve if faulty', 'Bleed radiators to remove air'],
      safetyWarnings: ['⚠️ Do NOT operate boiler below 0.5 bar', '⚠️ Isolate gas supply if smell detected', '⚠️ Allow system to cool before working on pressurised components', '⚠️ Gas work must be carried out by Gas Safe registered engineer'],
      recommendedParts: ['Pressure relief valve (3 bar)', 'Expansion vessel (match existing size)', 'Pressure gauge', 'Filling loop assembly'],
      estimatedTime: '1–3 hours depending on fault',
      recommendations: 'Schedule annual boiler service. Check system pressure monthly. Consider installing automatic filling loop.',
    };
  } else if (q.includes('ahu') || q.includes('air handling') || q.includes('vibration') || q.includes('hvac')) {
    diagnosis = {
      equipment: 'AHU / HVAC Unit',
      likelyCauses: ['Worn or loose fan bearings', 'Unbalanced fan impeller', 'Loose belt or pulley', 'Debris in fan housing', 'Motor mount bolts loose'],
      suggestedRepairs: ['Inspect and replace fan bearings', 'Check belt tension and alignment', 'Clean fan impeller and housing', 'Tighten all motor mount bolts', 'Balance fan impeller if required'],
      safetyWarnings: ['⚠️ Isolate and lock-off electrical supply before inspection', '⚠️ Allow fan to come to complete stop before accessing', '⚠️ Wear appropriate PPE including ear protection', '⚠️ Check for asbestos insulation on older units'],
      recommendedParts: ['Fan bearings (match existing spec)', 'Drive belt (check size on existing)', 'Vibration isolation mounts', 'Lubricant spray'],
      estimatedTime: '2–4 hours',
      recommendations: 'Increase inspection frequency to monthly. Consider vibration monitoring sensors for early fault detection.',
    };
  } else if (q.includes('fire alarm')) {
    diagnosis = {
      equipment: 'Fire Alarm System',
      likelyCauses: ['Faulty detector (dust/contamination)', 'Wiring fault or short circuit', 'Low battery on wireless device', 'Panel software fault', 'Zone card failure'],
      suggestedRepairs: ['Clean or replace affected detector', 'Test all devices on faulted zone', 'Check wiring continuity on zone circuit', 'Reset panel and clear fault log', 'Replace zone card if fault persists'],
      safetyWarnings: ['⚠️ Do NOT disable fire alarm system without informing building occupants', '⚠️ Notify fire brigade if system will be offline >4 hours', '⚠️ Implement fire watch procedure during maintenance', '⚠️ Only competent persons should work on fire alarm systems'],
      recommendedParts: ['Replacement detector (match existing type)', 'Zone card module', 'Battery backup unit'],
      estimatedTime: '1–2 hours',
      recommendations: 'Schedule quarterly testing. Ensure all detectors are cleaned annually. Update fire log book after every visit.',
    };
  } else if (q.includes('lift') || q.includes('elevator')) {
    diagnosis = {
      equipment: 'Passenger Lift',
      likelyCauses: ['Door sensor misalignment', 'Drive belt/rope wear', 'Control board fault', 'Safety device activation', 'Power supply issue'],
      suggestedRepairs: ['Check and realign door sensors', 'Inspect drive ropes/belts for wear', 'Test all safety devices', 'Check control panel for fault codes', 'Verify power supply and earthing'],
      safetyWarnings: ['⚠️ NEVER work on lift with passengers inside', '⚠️ Isolate power and apply LOTO before pit access', '⚠️ Lift work requires LOLER-competent engineer', '⚠️ Do not bypass safety devices under any circumstances'],
      recommendedParts: ['Door sensor assembly', 'Drive belt/rope (match spec)', 'Control board module'],
      estimatedTime: '2–6 hours depending on fault',
      recommendations: 'Ensure 6-monthly thorough examination is up to date. Log all faults in lift maintenance record.',
    };
  } else {
    diagnosis = {
      equipment: 'Building System',
      likelyCauses: ['Component wear or failure', 'Electrical fault', 'Mechanical obstruction', 'Control system fault', 'Environmental factors'],
      suggestedRepairs: ['Conduct visual inspection of all components', 'Check electrical connections and fuses', 'Test control systems and sensors', 'Review recent maintenance history', 'Consult manufacturer documentation'],
      safetyWarnings: ['⚠️ Isolate power before working on electrical components', '⚠️ Follow COSHH guidelines for any chemicals', '⚠️ Wear appropriate PPE at all times', '⚠️ Ensure area is safe before commencing work'],
      recommendedParts: ['Consult equipment manual for specific parts'],
      estimatedTime: '1–4 hours',
      recommendations: 'Document all findings in the work order. Update asset service history. Schedule follow-up inspection.',
    };
  }

  return {
    id, role: 'assistant', timestamp: new Date(), type: 'fault',
    content: `🔧 **AI Fault Diagnosis — ${diagnosis.equipment}**`,
    data: diagnosis
  };
}