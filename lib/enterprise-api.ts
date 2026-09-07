import { supabase } from './supabase'
import type {
  EnterpriseClient,
  ClientDeployment,
  DeploymentHealth,
  DeploymentSyncEvent,
  DeploymentAlert,
  LicenceStatus,
  DeploymentVersion,
  CloudSyncConflict,
  SupportAccessLog,
  CloudAuditLog,
  EnterpriseDashboardStats,
} from './enterprise-types'

export async function fetchAllEnterpriseClients(): Promise<EnterpriseClient[]> {
  const { data } = await supabase
    .from('enterprise_clients')
    .select('*')
    .order('client_name', { ascending: true })
  return (data || []) as EnterpriseClient[]
}

export async function fetchEnterpriseClient(id: number): Promise<EnterpriseClient | null> {
  const { data } = await supabase
    .from('enterprise_clients')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  return (data || null) as EnterpriseClient | null
}

export async function fetchAllDeployments(): Promise<ClientDeployment[]> {
  const { data } = await supabase
    .from('client_deployments')
    .select('*, enterprise_clients(*)')
    .order('deployment_name', { ascending: true })
  return (data || []) as ClientDeployment[]
}

export async function fetchDeployment(id: number): Promise<ClientDeployment | null> {
  const { data } = await supabase
    .from('client_deployments')
    .select('*, enterprise_clients(*)')
    .eq('id', id)
    .maybeSingle()
  return (data || null) as ClientDeployment | null
}

export async function fetchDeploymentsByClient(clientId: number): Promise<ClientDeployment[]> {
  const { data } = await supabase
    .from('client_deployments')
    .select('*, enterprise_clients(*)')
    .eq('enterprise_client_id', clientId)
    .order('deployment_name', { ascending: true })
  return (data || []) as ClientDeployment[]
}

export async function fetchDeploymentHealth(deploymentId: number, limit = 20): Promise<DeploymentHealth[]> {
  const { data } = await supabase
    .from('deployment_health')
    .select('*')
    .eq('deployment_id', deploymentId)
    .order('checked_at', { ascending: false })
    .limit(limit)
  return (data || []) as DeploymentHealth[]
}

export async function fetchSyncEvents(deploymentId?: number, limit = 50): Promise<DeploymentSyncEvent[]> {
  let query = supabase
    .from('deployment_sync_events')
    .select('*, client_deployments(deployment_name, site_name)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (deploymentId) {
    query = query.eq('deployment_id', deploymentId)
  }

  const { data } = await query
  return (data || []) as DeploymentSyncEvent[]
}

export async function fetchAlerts(resolved?: boolean, limit = 50): Promise<DeploymentAlert[]> {
  let query = supabase
    .from('deployment_alerts')
    .select('*, client_deployments(deployment_name, site_name), enterprise_clients(client_name)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (resolved !== undefined) {
    query = query.eq('resolved', resolved)
  }

  const { data } = await query
  return (data || []) as DeploymentAlert[]
}

export async function fetchLicenceStatuses(): Promise<LicenceStatus[]> {
  const { data } = await supabase
    .from('licence_status')
    .select('*')
    .order('expires_at', { ascending: true })
  return (data || []) as LicenceStatus[]
}

export async function fetchDeploymentVersions(deploymentId?: number): Promise<DeploymentVersion[]> {
  let query = supabase
    .from('deployment_versions')
    .select('*')
    .order('deployed_at', { ascending: false })

  if (deploymentId) {
    query = query.eq('deployment_id', deploymentId)
  }

  const { data } = await query
  return (data || []) as DeploymentVersion[]
}

export async function fetchSyncConflicts(status?: string, limit = 50): Promise<CloudSyncConflict[]> {
  let query = supabase
    .from('cloud_sync_conflicts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (status) {
    query = query.eq('conflict_status', status)
  }

  const { data } = await query
  return (data || []) as CloudSyncConflict[]
}

export async function fetchSupportAccessLogs(limit = 50): Promise<SupportAccessLog[]> {
  const { data } = await supabase
    .from('support_access_logs')
    .select('*')
    .order('session_start', { ascending: false })
    .limit(limit)
  return (data || []) as SupportAccessLog[]
}

export async function fetchCloudAuditLogs(limit = 100): Promise<CloudAuditLog[]> {
  const { data } = await supabase
    .from('cloud_audit_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data || []) as CloudAuditLog[]
}

export async function acknowledgeAlert(alertId: number, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('deployment_alerts')
    .update({
      acknowledged: true,
      acknowledged_by: userId,
      acknowledged_at: new Date().toISOString(),
    })
    .eq('id', alertId)
  return !error
}

export async function resolveAlert(alertId: number): Promise<boolean> {
  const { error } = await supabase
    .from('deployment_alerts')
    .update({
      resolved: true,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', alertId)
  return !error
}

export async function fetchEnterpriseDashboardStats(): Promise<EnterpriseDashboardStats> {
  const [clientsResult, deploymentsResult, syncBacklogResult, alertsResult, licenceResult] =
    await Promise.all([
      supabase.from('enterprise_clients').select('id,licence_status,is_online'),
      supabase.from('client_deployments').select('id,is_online,backup_status,app_version,storage_used_mb,last_sync_success'),
      supabase.from('deployment_sync_events').select('id', { count: 'exact', head: true }).eq('sync_status', 'pending'),
      supabase.from('deployment_alerts').select('id,severity,resolved'),
      supabase.from('licence_status').select('id,status'),
    ])

  const clients = clientsResult.data || []
  const deployments = deploymentsResult.data || []
  const alerts = alertsResult.data || []
  const licences = licenceResult.data || []

  const LATEST_VERSION = '3.2.1'

  return {
    totalClients: clients.length,
    onlineDeployments: deployments.filter((d) => d.is_online).length,
    offlineDeployments: deployments.filter((d) => !d.is_online).length,
    totalDeployments: deployments.length,
    syncBacklog: syncBacklogResult.count || 0,
    criticalAlerts: alerts.filter((a) => a.severity === 'critical' && !a.resolved).length,
    licenceIssues: licences.filter((l) => l.status !== 'active').length,
    failedBackups: deployments.filter((d) => d.backup_status === 'failed').length,
    outdatedVersions: deployments.filter((d) => d.app_version && d.app_version < LATEST_VERSION).length,
    totalStorageUsedMb: deployments.reduce((sum, d) => sum + (d.storage_used_mb || 0), 0),
    lastGlobalSync: deployments
      .filter((d) => d.last_sync_success)
      .map((d) => d.last_sync_success)
      .sort()
      .pop() || null,
  }
}