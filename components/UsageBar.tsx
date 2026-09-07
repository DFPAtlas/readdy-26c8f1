'use client';

import Link from 'next/link';
import type { LimitCheck } from '@/lib/subscription-limits';

interface Props {
  label: string;
  check: LimitCheck;
  icon: string;
}

export default function UsageBar({ label, check, icon }: Props) {
  const pct = check.percentage;
  const atLimit = !check.allowed;
  const nearLimit = check.allowed && pct >= 80;

  const barColor = atLimit
    ? 'bg-red-500'
    : nearLimit
    ? 'bg-amber-500'
    : 'bg-emerald-500';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className={`${icon} text-gray-400`}></i>
          </div>
          <span className="text-gray-500">{label}</span>
        </div>
        <span className={`font-medium ${atLimit ? 'text-red-400' : nearLimit ? 'text-amber-400' : 'text-gray-400'}`}>
          {check.current}/{check.max}
        </span>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      {atLimit && (
        <Link
          href={check.upgradeUrl}
          className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer transition-colors mt-1"
        >
          <span>Upgrade plan</span>
          <div className="w-3 h-3 flex items-center justify-center">
            <i className="ri-arrow-right-up-line text-[10px]"></i>
          </div>
        </Link>
      )}
    </div>
  );
}