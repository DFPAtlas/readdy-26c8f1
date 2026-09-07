'use client';

import Link from 'next/link';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  completed: boolean;
}

interface CDOnboardingProps {
  steps: OnboardingStep[];
  companyName: string;
}

export default function CDOnboarding({ steps, companyName }: CDOnboardingProps) {
  const completedCount = steps.filter((s) => s.completed).length;
  const progress = Math.round((completedCount / steps.length) * 100);

  if (completedCount === steps.length) return null;

  return (
    <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl p-6 shadow-lg text-white mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold mb-1">Welcome to Synqoro, {companyName}!</h2>
          <p className="text-blue-100 text-sm">Complete your setup to get the most out of your workspace.</p>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <div className="text-3xl font-bold">{progress}%</div>
          <div className="text-blue-200 text-xs">Complete</div>
        </div>
      </div>

      <div className="w-full bg-white/20 rounded-full h-2 mb-6">
        <div
          className="h-2 bg-white rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {steps.map((step) => (
          <Link
            key={step.id}
            href={step.href}
            className={`flex items-start space-x-3 p-3 rounded-xl transition-all cursor-pointer ${
              step.completed
                ? 'bg-white/10 opacity-60'
                : 'bg-white/15 hover:bg-white/25'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              step.completed ? 'bg-emerald-400' : 'bg-white/20'
            }`}>
              <i className={`${step.completed ? 'ri-check-line' : step.icon} text-white text-sm`}></i>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white leading-tight">{step.title}</p>
              <p className="text-xs text-blue-200 mt-0.5 leading-tight">{step.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}