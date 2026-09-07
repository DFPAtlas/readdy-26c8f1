'use client';

import { supabase } from './supabase';

export type UserRole =
  | 'platform_owner'
  | 'super_admin'
  | 'company_admin'
  | 'fm_manager'
  | 'site_manager'
  | 'engineer'
  | 'client_user'
  | 'finance_user'
  | 'viewer';

export interface UserProfile {
  id: string;
  company_id: string;
  full_name: string;
  email: string;
  role: UserRole;
  status: string;
  avatar_url?: string;
  phone?: string;
  department?: string;
  job_title?: string;
  permissions: string[];
  last_login?: string;
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  billing_email: string;
  subscription_plan: string;
  account_status: string;
  logo_url?: string;
  address?: string;
  phone?: string;
  industry?: string;
  max_users?: number;
  created_at: string;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (data.user) {
    await supabase.from('user_profiles').update({ last_login: new Date().toISOString() }).eq('id', data.user.id);
    await logAuditAction(data.user.id, null, 'user_login', 'auth', data.user.id, { email });
  }
  return data;
}

export async function signOut() {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const profile = await getUserProfile(user.id);
    await logAuditAction(user.id, profile?.company_id || null, 'user_logout', 'auth', user.id, { email: user.email });
  }
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function signUp(
  email: string,
  password: string,
  fullName: string,
  companyName: string,
  planSlug: string = 'starter',
  billingCycle: string = 'monthly'
) {
  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
  if (authError) throw authError;
  if (!authData.user) throw new Error('No user returned');

  const { data: planData } = await supabase
    .from('plans')
    .select('*')
    .eq('slug', planSlug)
    .eq('is_active', true)
    .maybeSingle();

  const maxUsers = planData?.max_users || 10;
  const maxAssets = planData?.max_assets || 100;

  const { data: company, error: companyError } = await supabase
    .from('companies')
    .insert({ name: companyName, billing_email: email, subscription_plan: planSlug, account_status: 'trial' })
    .select()
    .maybeSingle();
  if (companyError) throw companyError;

  const { error: profileError } = await supabase.from('user_profiles').insert({
    id: authData.user.id,
    company_id: company!.id,
    full_name: fullName,
    email,
    role: 'company_admin',
    status: 'active',
    permissions: ['all'],
  });
  if (profileError) throw profileError;

  await supabase.from('subscriptions').insert({
    company_id: company!.id,
    plan: planSlug,
    status: 'trial',
    billing_cycle: billingCycle,
    price_per_month: 0,
    max_users: maxUsers,
    max_assets: maxAssets,
    trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  });

  return { user: authData.user, company, planSlug, billingCycle };
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) return null;
  return data;
}

export async function getCompany(companyId: string): Promise<Company | null> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', companyId)
    .maybeSingle();
  if (error) return null;
  return data;
}

export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function logAuditAction(
  userId: string,
  companyId: string | null,
  action: string,
  resourceType: string,
  resourceId: string,
  details: Record<string, unknown> = {}
) {
  try {
    await supabase.from('audit_logs').insert({
      user_id: userId,
      company_id: companyId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details,
    });
  } catch {}
}

export function getRoleDashboard(role: UserRole): string {
  switch (role) {
    case 'platform_owner':
    case 'super_admin':
      return '/super-admin';
    case 'engineer':
      return '/work-orders/engineer';
    case 'client_user':
    case 'viewer':
    case 'company_admin':
    case 'fm_manager':
    case 'site_manager':
    case 'finance_user':
      return '/client-dashboard';
    default:
      return '/client-dashboard';
  }
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    platform_owner: 'Platform Owner',
    super_admin: 'Super Admin',
    company_admin: 'Company Admin',
    fm_manager: 'FM Manager',
    site_manager: 'Site Manager',
    engineer: 'Engineer',
    client_user: 'Client User',
    finance_user: 'Finance User',
    viewer: 'Viewer',
  };
  return labels[role] || role;
}

export function getRoleColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    platform_owner: 'bg-purple-100 text-purple-700',
    super_admin: 'bg-red-100 text-red-700',
    company_admin: 'bg-blue-100 text-blue-700',
    fm_manager: 'bg-indigo-100 text-indigo-700',
    site_manager: 'bg-cyan-100 text-cyan-700',
    engineer: 'bg-green-100 text-green-700',
    client_user: 'bg-yellow-100 text-yellow-700',
    finance_user: 'bg-orange-100 text-orange-700',
    viewer: 'bg-gray-100 text-gray-700',
  };
  return colors[role] || 'bg-gray-100 text-gray-700';
}

export function canAccess(role: UserRole, resource: string): boolean {
  const readOnlyRoles: UserRole[] = ['viewer', 'client_user'];
  const engineerResources = ['work_orders', 'assets', 'compliance'];
  if (role === 'platform_owner' || role === 'super_admin') return true;
  if (role === 'engineer') return engineerResources.includes(resource);
  if (readOnlyRoles.includes(role)) return resource === 'read';
  return true;
}