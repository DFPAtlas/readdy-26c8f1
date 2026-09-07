'use client';

import { supabase } from './supabase';

export interface SubscriptionLimits {
  plan: string;
  status: string;
  maxUsers: number;
  maxAssets: number;
  maxSites: number;
  currentUsers: number;
  currentAssets: number;
  currentSites: number;
  trialEndsAt: string | null;
  billingCycle: string;
}

export interface LimitCheck {
  allowed: boolean;
  current: number;
  max: number;
  percentage: number;
  message: string;
  upgradeUrl: string;
}

const PRICING_URL = '/?checkout=upgrade#pricing';

export async function getSubscriptionLimits(companyId: string): Promise<SubscriptionLimits | null> {
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan, status, max_users, max_assets, trial_ends_at, billing_cycle')
    .eq('company_id', companyId)
    .maybeSingle();

  if (!sub) return null;

  const [{ count: userCount }, { count: assetCount }, { count: siteCount }] = await Promise.all([
    supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('company_id', companyId),
    supabase.from('assets').select('*', { count: 'exact', head: true }).eq('company_id', companyId),
    supabase.from('asset_sites').select('*', { count: 'exact', head: true }).eq('tenant_id', 'default'),
  ]);

  const { data: planData } = await supabase
    .from('plans')
    .select('max_users, max_assets, max_sites')
    .eq('slug', sub.plan)
    .maybeSingle();

  return {
    plan: sub.plan,
    status: sub.status,
    maxUsers: sub.max_users ?? planData?.max_users ?? 10,
    maxAssets: sub.max_assets ?? planData?.max_assets ?? 100,
    maxSites: planData?.max_sites ?? 3,
    currentUsers: userCount ?? 0,
    currentAssets: assetCount ?? 0,
    currentSites: siteCount ?? 0,
    trialEndsAt: sub.trial_ends_at,
    billingCycle: sub.billing_cycle ?? 'monthly',
  };
}

export function checkAssetLimit(limits: SubscriptionLimits): LimitCheck {
  const pct = limits.maxAssets > 0 ? Math.round((limits.currentAssets / limits.maxAssets) * 100) : 0;
  return {
    allowed: limits.currentAssets < limits.maxAssets,
    current: limits.currentAssets,
    max: limits.maxAssets,
    percentage: pct,
    upgradeUrl: PRICING_URL,
    message: limits.currentAssets >= limits.maxAssets
      ? `Asset limit reached (${limits.currentAssets}/${limits.maxAssets}). Upgrade your plan to add more.`
      : `${limits.currentAssets} of ${limits.maxAssets} assets used`,
  };
}

export function checkUserLimit(limits: SubscriptionLimits): LimitCheck {
  const pct = limits.maxUsers > 0 ? Math.round((limits.currentUsers / limits.maxUsers) * 100) : 0;
  return {
    allowed: limits.currentUsers < limits.maxUsers,
    current: limits.currentUsers,
    max: limits.maxUsers,
    percentage: pct,
    upgradeUrl: PRICING_URL,
    message: limits.currentUsers >= limits.maxUsers
      ? `User limit reached (${limits.currentUsers}/${limits.maxUsers}). Upgrade your plan to add more.`
      : `${limits.currentUsers} of ${limits.maxUsers} users`,
  };
}

export function checkSiteLimit(limits: SubscriptionLimits): LimitCheck {
  const pct = limits.maxSites > 0 ? Math.round((limits.currentSites / limits.maxSites) * 100) : 0;
  return {
    allowed: limits.currentSites < limits.maxSites,
    current: limits.currentSites,
    max: limits.maxSites,
    percentage: pct,
    upgradeUrl: PRICING_URL,
    message: limits.currentSites >= limits.maxSites
      ? `Site limit reached (${limits.currentSites}/${limits.maxSites}). Upgrade your plan to add more.`
      : `${limits.currentSites} of ${limits.maxSites} sites`,
  };
}

export function isNearLimit(check: LimitCheck): boolean {
  return check.percentage >= 80 && check.allowed;
}

export function isAtLimit(check: LimitCheck): boolean {
  return !check.allowed;
}