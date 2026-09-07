'use client';

const statusConfig: Record<string, { label: string; color: string; icon: string; dot: string }> = {
  compliant: { label: 'Compliant', color: 'bg-green-100 text-green-700 border-green-200', icon: 'ri-checkbox-circle-line', dot: 'bg-green-500' },
  due_soon: { label: 'Due Soon', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: 'ri-time-line', dot: 'bg-amber-500' },
  overdue: { label: 'Overdue', color: 'bg-red-100 text-red-700 border-red-200', icon: 'ri-alarm-warning-line', dot: 'bg-red-500' },
  failed: { label: 'Failed', color: 'bg-red-200 text-red-800 border-red-300', icon: 'ri-close-circle-line', dot: 'bg-red-700' },
};

const categoryConfig: Record<string, { label: string; icon: string; color: string }> = {
  fire_safety: { label: 'Fire Safety', icon: 'ri-fire-line', color: 'bg-red-100 text-red-600' },
  emergency_lighting: { label: 'Emergency Lighting', icon: 'ri-flashlight-line', color: 'bg-yellow-100 text-yellow-600' },
  gas_safety: { label: 'Gas Safety', icon: 'ri-fire-fill', color: 'bg-orange-100 text-orange-600' },
  electrical: { label: 'Electrical', icon: 'ri-flashlight-fill', color: 'bg-blue-100 text-blue-600' },
  water_hygiene: { label: 'Water Hygiene', icon: 'ri-drop-line', color: 'bg-cyan-100 text-cyan-600' },
  asbestos: { label: 'Asbestos', icon: 'ri-alert-line', color: 'bg-gray-100 text-gray-600' },
  hvac: { label: 'HVAC', icon: 'ri-temp-cold-line', color: 'bg-indigo-100 text-indigo-600' },
  lift_inspection: { label: 'Lift Inspection', icon: 'ri-arrow-up-down-line', color: 'bg-purple-100 text-purple-600' },
  pat_testing: { label: 'PAT Testing', icon: 'ri-plug-line', color: 'bg-teal-100 text-teal-600' },
  risk_assessment: { label: 'Risk Assessment', icon: 'ri-shield-check-line', color: 'bg-green-100 text-green-600' },
  insurance: { label: 'Insurance', icon: 'ri-secure-payment-line', color: 'bg-blue-100 text-blue-600' },
  health_safety: { label: 'Health & Safety', icon: 'ri-heart-pulse-line', color: 'bg-pink-100 text-pink-600' },
  security: { label: 'Security', icon: 'ri-shield-line', color: 'bg-slate-100 text-slate-600' },
  building: { label: 'Building', icon: 'ri-building-line', color: 'bg-stone-100 text-stone-600' },
};

export function ComplianceStatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] || statusConfig['compliant'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
      <i className={`${cfg.icon} text-xs`}></i>
      {cfg.label}
    </span>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  const cfg = categoryConfig[category] || { label: category, icon: 'ri-file-line', color: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${cfg.color}`}>
      <i className={`${cfg.icon} text-xs`}></i>
      {cfg.label}
    </span>
  );
}

export function getDaysUntilExpiry(expiryDate: string): number {
  if (!expiryDate) return 999;
  return Math.ceil((new Date(expiryDate).getTime() - Date.now()) / 86400000);
}

export function getAutoStatus(expiryDate: string, currentStatus: string): string {
  if (currentStatus === 'failed') return 'failed';
  const days = getDaysUntilExpiry(expiryDate);
  if (days < 0) return 'overdue';
  if (days <= 30) return 'due_soon';
  return 'compliant';
}

export { categoryConfig, statusConfig };