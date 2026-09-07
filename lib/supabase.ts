import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  department: string;
  status: string;
  last_login: string;
  permissions: string[];
  created_at: string;
}

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  assigned_to: string;
  facility_id: string;
  asset_id: string;
  due_date: string;
  created_at: string;
  completed_at: string;
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  location: string;
  status: string;
  last_maintenance: string;
  next_maintenance: string;
  facility_id: string;
  created_at: string;
}

export interface Facility {
  id: string;
  name: string;
  address: string;
  type: string;
  size: number;
  status: string;
  manager_id: string;
  created_at: string;
}

export interface Staff {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hire_date: string;
  status: string;
  created_at: string;
}

export interface Vendor {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  service_type: string;
  status: string;
  rating: number;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  event_type: string;
  start_time: string;
  end_time: string;
  location: string;
  organizer_id: string;
  status: string;
  created_at: string;
}

export interface MaintenanceSchedule {
  id: string;
  asset_id: string;
  title: string;
  description: string;
  frequency: string;
  next_due_date: string;
  assigned_to: string;
  status: string;
  created_at: string;
}

export interface SecurityLog {
  id: string;
  incident_type: string;
  description: string;
  location: string;
  severity: string;
  reported_by: string;
  status: string;
  incident_time: string;
  created_at: string;
}

export interface AssetSite {
  id: number;
  tenant_id: string;
  name: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
  site_manager: string;
  phone: string;
  email: string;
  status: string;
  created_at: string;
}

export interface AssetCategory {
  id: number;
  name: string;
  icon: string;
  color: string;
  sort_order: number;
}

export interface AssetRecord {
  id: number;
  tenant_id: string;
  asset_id: string;
  name: string;
  category_id: number;
  site_id: number;
  manufacturer: string;
  model: string;
  serial_number: string;
  location: string;
  floor_level: string;
  install_date: string;
  warranty_expiry: string;
  service_interval_days: number;
  last_service_date: string;
  next_service_date: string;
  status: string;
  compliance_status: string;
  qr_code: string;
  notes: string;
  created_at: string;
}

export interface AssetServiceRecord {
  id: number;
  asset_id: number;
  service_type: string;
  description: string;
  performed_by: string;
  company: string;
  service_date: string;
  next_service_date: string;
  cost: number;
  status: string;
  notes: string;
  created_at: string;
}

export interface AssetDocument {
  id: number;
  asset_id: number;
  name: string;
  document_type: string;
  url: string;
  expiry_date: string;
  uploaded_by: string;
  created_at: string;
}

export interface WorkOrderFull {
  id: number;
  job_id: string;
  title: string;
  description: string;
  type: 'reactive' | 'planned' | 'inspection' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'new' | 'assigned' | 'in_progress' | 'awaiting_parts' | 'on_hold' | 'completed' | 'cancelled';
  site_id: number;
  asset_id: number;
  assigned_engineer: string;
  assigned_engineer_id: string;
  due_date: string;
  sla_breached: boolean;
  labour_hours: number;
  materials_cost: number;
  client_name: string;
  client_email: string;
  client_signature: string;
  ai_summary: string;
  ai_troubleshooting: string;
  ai_recommendations: string;
  tenant_id: string;
  created_by: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface WorkOrderNote {
  id: number;
  work_order_id: number;
  note: string;
  note_type: 'internal' | 'client' | 'engineer' | 'system';
  author: string;
  author_role: string;
  created_at: string;
}

export interface WorkOrderMaterial {
  id: number;
  work_order_id: number;
  name: string;
  quantity: number;
  unit: string;
  unit_cost: number;
  total_cost: number;
  supplier: string;
  part_number: string;
  created_at: string;
}

export interface EngineerTimesheet {
  id: number;
  work_order_id: number;
  engineer_name: string;
  engineer_id: string;
  clock_in: string;
  clock_out: string;
  hours_worked: number;
  travel_time: number;
  notes: string;
  created_at: string;
}

export interface SpaceBooking {
  id: string;
  space_name: string;
  booked_by: string;
  start_time: string;
  end_time: string;
  purpose: string;
  status: string;
  created_at: string;
}
