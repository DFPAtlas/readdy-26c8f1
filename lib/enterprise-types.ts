export interface EnterpriseClient {
  id: number
  client_name: string
  company_id: string | null
  deployment_id: string
  contact_name: string | null
  contact_email: string | null
  plan_tier: string
  licence_status: string
  licence_key: string | null
  max_users: number
  max_sites: number
  enabled_modules: string[] | null
  support_tier: string
  licence_start_date: string
  licence_renewal_date: string | null
  grace_period_days: number
  last_sync_at: string | null
  is_online: boolean
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface ClientDeployment {
  id: number
  enterprise_client_id: number | null
  deployment_name: string
  site_name: string | null
  deployment_version: string
  app_version: string | null
  supabase_project_ref: string | null
  server_hostname: string | null
  server_ip: string | null
  os_info: string | null
  cpu_cores: number | null
  ram_gb: number | null
  disk_gb: number | null
  cpu_usage_pct: number | null
  ram_usage_pct: number | null
  disk_usage_pct: number | null
  db_status: string
  supabase_status: string
  app_status: string
  storage_used_mb: number | null
  backup_status: string
  backup_last_success: string | null
  sync_queue_size: number
  last_sync_success: string | null
  last_health_check: string | null
  is_online: boolean
  api_key_hash: string | null
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
  enterprise_clients?: EnterpriseClient
}

export interface DeploymentHealth {
  id: number
  deployment_id: number | null
  check_type: string
  status: string
  message: string | null
  details: Record<string, unknown> | null
  checked_at: string
}

export interface DeploymentSyncEvent {
  id: number
  deployment_id: number | null
  event_type: string
  event_payload: Record<string, unknown>
  idempotency_key: string | null
  source_updated_at: string | null
  cloud_received_at: string
  sync_status: string
  retry_count: number
  last_error: string | null
  record_version: number
  conflict_status: string
  conflict_reason: string | null
  source_deployment_id: string | null
  created_at: string
  client_deployments?: ClientDeployment
}

export interface DeploymentAlert {
  id: number
  deployment_id: number | null
  enterprise_client_id: number | null
  alert_type: string
  severity: string
  title: string
  message: string | null
  acknowledged: boolean
  acknowledged_by: string | null
  acknowledged_at: string | null
  resolved: boolean
  resolved_at: string | null
  metadata: Record<string, unknown> | null
  created_at: string
  client_deployments?: ClientDeployment
  enterprise_clients?: EnterpriseClient
}

export interface LicenceStatus {
  id: number
  enterprise_client_id: number | null
  licence_key: string
  status: string
  plan_tier: string
  max_users: number
  max_sites: number
  enabled_modules: string[] | null
  support_tier: string
  grace_period_days: number
  last_validated_at: string
  expires_at: string | null
  issued_at: string
  revoked_at: string | null
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface DeploymentVersion {
  id: number
  deployment_id: number | null
  app_version: string
  supabase_version: string | null
  release_channel: string
  deployed_at: string
  deployed_by: string | null
  rollback_version: string | null
  release_notes: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface CloudSyncConflict {
  id: number
  deployment_id: number | null
  sync_event_id: number | null
  table_name: string
  record_id: string
  local_data: Record<string, unknown> | null
  cloud_data: Record<string, unknown> | null
  resolved_data: Record<string, unknown> | null
  conflict_status: string
  resolved_by: string | null
  resolved_at: string | null
  notes: string | null
  created_at: string
}

export interface SupportAccessLog {
  id: number
  enterprise_client_id: number | null
  deployment_id: number | null
  support_agent_id: string | null
  support_agent_name: string | null
  access_type: string
  access_reason: string | null
  session_start: string
  session_end: string | null
  commands_executed: number
  audit_trail: Record<string, unknown>[] | null
  status: string
  created_at: string
}

export interface CloudAuditLog {
  id: number
  actor_id: string | null
  actor_name: string | null
  actor_role: string | null
  action: string
  target_type: string | null
  target_id: string | null
  details: Record<string, unknown> | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export interface EnterpriseDashboardStats {
  totalClients: number
  onlineDeployments: number
  offlineDeployments: number
  totalDeployments: number
  syncBacklog: number
  criticalAlerts: number
  licenceIssues: number
  failedBackups: number
  outdatedVersions: number
  totalStorageUsedMb: number
  lastGlobalSync: string | null
}

export interface SyncQueueItem {
  id: string
  event_type: string
  payload: Record<string, unknown>
  tenant_id: string
  deployment_id: string
  idempotency_key: string
  created_at: string
  retry_count: number
  status: 'pending' | 'syncing' | 'synced' | 'failed'
  last_error: string | null
}

export interface LocalHealthReport {
  deployment_id: string
  tenant_id: string
  timestamp: string
  cpu_usage_pct: number
  ram_usage_pct: number
  disk_usage_pct: number
  db_status: string
  supabase_status: string
  app_status: string
  storage_used_mb: number
  backup_status: string
  backup_last_success: string | null
  sync_queue_size: number
  app_version: string
  os_info: string
  cpu_cores: number
  ram_gb: number
  disk_gb: number
}