export function AssetStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Operational': 'bg-green-100 text-green-700',
    'Maintenance Required': 'bg-orange-100 text-orange-700',
    'Inspection Due': 'bg-yellow-100 text-yellow-700',
    'Critical': 'bg-red-100 text-red-700',
    'Out of Service': 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

export function ComplianceBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Compliant': 'bg-green-100 text-green-700',
    'Due for Review': 'bg-yellow-100 text-yellow-700',
    'Non-Compliant': 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}