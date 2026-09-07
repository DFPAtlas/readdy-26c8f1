import { supabase } from './supabase'

interface CachedLicence {
  licence_key: string
  status: string
  plan_tier: string
  max_users: number
  max_sites: number
  enabled_modules: string[]
  support_tier: string
  grace_period_days: number
  expires_at: string | null
  last_validated_at: string
  cached_at: string
}

const LICENCE_CACHE_KEY = 'synoro_licence_cache'
const LICENCE_WARN_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000

function getCachedLicence(): CachedLicence | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(LICENCE_CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as CachedLicence
  } catch {
    return null
  }
}

function setCachedLicence(licence: CachedLicence): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(LICENCE_CACHE_KEY, JSON.stringify(licence))
  } catch {
    // localStorage full or unavailable
  }
}

export function clearCachedLicence(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(LICENCE_CACHE_KEY)
}

export async function fetchLicenceFromCloud(licenceKey: string): Promise<CachedLicence | null> {
  const { data } = await supabase
    .from('licence_status')
    .select('*')
    .eq('licence_key', licenceKey)
    .maybeSingle()

  if (!data) return null

  const licence: CachedLicence = {
    licence_key: data.licence_key,
    status: data.status,
    plan_tier: data.plan_tier,
    max_users: data.max_users,
    max_sites: data.max_sites,
    enabled_modules: data.enabled_modules || [],
    support_tier: data.support_tier,
    grace_period_days: data.grace_period_days,
    expires_at: data.expires_at,
    last_validated_at: data.last_validated_at,
    cached_at: new Date().toISOString(),
  }

  setCachedLicence(licence)
  return licence
}

export function getLicenceStatus(): CachedLicence | null {
  return getCachedLicence()
}

export function isLicenceValid(): { valid: boolean; reason: string } {
  const cached = getCachedLicence()
  if (!cached) {
    return { valid: false, reason: 'No cached licence found' }
  }

  if (cached.status === 'revoked') {
    return { valid: false, reason: 'Licence has been revoked' }
  }

  if (cached.expires_at) {
    const expiry = new Date(cached.expires_at)
    if (expiry < new Date()) {
      return { valid: false, reason: 'Licence has expired' }
    }
  }

  const lastValidated = new Date(cached.last_validated_at)
  const timeSinceValidation = Date.now() - lastValidated.getTime()

  if (timeSinceValidation > LICENCE_WARN_THRESHOLD_MS) {
    if (cached.grace_period_days > 0) {
      const graceMs = cached.grace_period_days * 24 * 60 * 60 * 1000
      if (timeSinceValidation > LICENCE_WARN_THRESHOLD_MS + graceMs) {
        return {
          valid: true,
          reason: `Licence not validated in ${Math.floor(timeSinceValidation / (24 * 60 * 60 * 1000))} days. Grace period active.`,
        }
      }
    }
    return {
      valid: true,
      reason: `Licence cache stale (last validated ${Math.floor(timeSinceValidation / (24 * 60 * 60 * 1000))} days ago). Online sync recommended.`,
    }
  }

  return { valid: true, reason: 'Licence valid' }
}

export function hasModuleAccess(moduleName: string): boolean {
  const cached = getCachedLicence()
  if (!cached) return false
  return cached.enabled_modules.includes(moduleName)
}

export function getUserLimit(): number {
  const cached = getCachedLicence()
  return cached?.max_users || 10
}

export function getSiteLimit(): number {
  const cached = getCachedLicence()
  return cached?.max_sites || 3
}

export async function validateAndRefreshLicence(licenceKey: string): Promise<boolean> {
  try {
    const fresh = await fetchLicenceFromCloud(licenceKey)
    return fresh !== null && fresh.status === 'active'
  } catch {
    return isLicenceValid().valid
  }
}