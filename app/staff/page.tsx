'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthContext';
import { checkUserLimit } from '@/lib/subscription-limits';

const demoStaff = [
  { id: '1', full_name: 'Michael Johnson', email: 'michael.johnson@synqoro.com', phone: '(555) 234-5678', position: 'Senior HVAC Technician', department: 'Maintenance', hire_date: '2021-03-15', status: 'Active', created_at: '2021-03-15' },
  { id: '2', full_name: 'Sarah Chen', email: 'sarah.chen@synqoro.com', phone: '(555) 345-6789', position: 'Security Supervisor', department: 'Security', hire_date: '2020-08-20', status: 'Active', created_at: '2020-08-20' },
  { id: '3', full_name: 'Tom Wilson', email: 'tom.wilson@synqoro.com', phone: '(555) 456-7890', position: 'Plumbing Specialist', department: 'Maintenance', hire_date: '2022-01-10', status: 'Active', created_at: '2022-01-10' },
  { id: '4', full_name: 'Alex Davis', email: 'alex.davis@synqoro.com', phone: '(555) 567-8901', position: 'Electrical Engineer', department: 'Maintenance', hire_date: '2021-11-05', status: 'Active', created_at: '2021-11-05' },
  { id: '5', full_name: 'Jennifer Lee', email: 'jennifer.lee@synqoro.com', phone: '(555) 678-9012', position: 'Facilities Coordinator', department: 'Facilities', hire_date: '2022-06-15', status: 'Active', created_at: '2022-06-15' },
  { id: '6', full_name: 'Robert Martinez', email: 'robert.martinez@synqoro.com', phone: '(555) 789-0123', position: 'Operations Manager', department: 'Operations', hire_date: '2019-04-01', status: 'Active', created_at: '2019-04-01' },
  { id: '7', full_name: 'Emily Thompson', email: 'emily.thompson@synqoro.com', phone: '(555) 890-1234', position: 'Administrative Assistant', department: 'Administration', hire_date: '2023-02-20', status: 'Active', created_at: '2023-02-20' },
  { id: '8', full_name: 'David Brown', email: 'david.brown@synqoro.com', phone: '(555) 901-2345', position: 'Security Officer', department: 'Security', hire_date: '2022-09-12', status: 'Active', created_at: '2022-09-12' },
  { id: '9', full_name: 'Lisa Wang', email: 'lisa.wang@synqoro.com', phone: '(555) 012-3456', position: 'Safety Officer', department: 'Facilities', hire_date: '2021-07-08', status: 'Active', created_at: '2021-07-08' },
  { id: '10', full_name: 'James Anderson', email: 'james.anderson@synqoro.com', phone: '(555) 123-4567', position: 'Maintenance Technician', department: 'Maintenance', hire_date: '2023-05-01', status: 'On Leave', created_at: '2023-05-01' },
  { id: '11', full_name: 'Maria Garcia', email: 'maria.garcia@synqoro.com', phone: '(555) 234-5679', position: 'Cleaning Supervisor', department: 'Operations', hire_date: '2020-11-15', status: 'Active', created_at: '2020-11-15' },
  { id: '12', full_name: 'Kevin Park', email: 'kevin.park@synqoro.com', phone: '(555) 345-6780', position: 'IT Support Specialist', department: 'Administration', hire_date: '2022-03-28', status: 'Active', created_at: '2022-03-28' },
];

export default function Staff() {
  const { limits, refreshLimits } = useAuth();
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [limitBlocked, setLimitBlocked] = useState<{ message: string; upgradeUrl: string } | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    position: '',
    department: 'Maintenance',
    hire_date: '',
    status: 'Active'
  });

  const userCheck = limits ? checkUserLimit(limits) : null;

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    filterStaff();
  }, [staff, searchTerm, filterDepartment, filterStatus]);

  const handleAddClick = () => {
    if (userCheck && !userCheck.allowed) {
      setLimitBlocked(userCheck);
      setTimeout(() => setLimitBlocked(null), 4000);
      return;
    }
    setShowCreateModal(true);
  };

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStaff(data && data.length > 0 ? data : demoStaff);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setStaff(demoStaff);
    } finally {
      setLoading(false);
    }
  };

  const filterStaff = () => {
    let filtered = [...staff];

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.position?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterDepartment !== 'All') {
      filtered = filtered.filter(member => member.department === filterDepartment);
    }

    if (filterStatus !== 'All') {
      filtered = filtered.filter(member => member.status === filterStatus);
    }

    setFilteredStaff(filtered);
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('staff')
        .insert([formData]);

      if (error) throw error;

      setShowCreateModal(false);
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        position: '',
        department: 'Maintenance',
        hire_date: '',
        status: 'Active'
      });
      fetchStaff();
    } catch (error) {
      console.error('Error creating staff:', error);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;

    try {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchStaff();
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-700';
      case 'Inactive':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">N</span>
            </div>
            <span className="text-lg font-semibold">Synqoro</span>
          </div>

          <nav className="space-y-2">
            <div className="text-xs uppercase text-gray-400 mb-4">MAIN</div>
            <Link href="/" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg cursor-pointer">
              <i className="ri-dashboard-line"></i>
              <span>Dashboard</span>
            </Link>
            <Link href="/facilities" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg cursor-pointer">
              <i className="ri-building-line"></i>
              <span>Facilities</span>
            </Link>
            <Link href="/work-orders" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg cursor-pointer">
              <i className="ri-tools-line"></i>
              <span>Work Orders</span>
            </Link>
            <Link href="/maintenance" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg cursor-pointer">
              <i className="ri-settings-line"></i>
              <span>Preventive Maintenance</span>
            </Link>

            <div className="text-xs uppercase text-gray-400 mb-4 mt-8">MANAGEMENT</div>
            <Link href="/assets" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg cursor-pointer">
              <i className="ri-database-line"></i>
              <span>Assets</span>
            </Link>
            <Link href="/space" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg cursor-pointer">
              <i className="ri-map-line"></i>
              <span>Space Management</span>
            </Link>
            <Link href="/events" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg cursor-pointer">
              <i className="ri-calendar-event-line"></i>
              <span>Events</span>
            </Link>
            <Link href="/reception" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg cursor-pointer">
              <i className="ri-customer-service-line"></i>
              <span>Reception</span>
            </Link>
            <Link href="/post-room" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg cursor-pointer">
              <i className="ri-mail-line"></i>
              <span>Post Room</span>
            </Link>
            <Link href="/security" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg cursor-pointer">
              <i className="ri-shield-check-line"></i>
              <span>Security</span>
            </Link>
            <Link href="/hr" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg cursor-pointer">
              <i className="ri-user-heart-line"></i>
              <span>HR</span>
            </Link>
            <Link href="/inventory" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg cursor-pointer">
              <i className="ri-archive-line"></i>
              <span>Inventory</span>
            </Link>
            <Link href="/vendors" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg cursor-pointer">
              <i className="ri-truck-line"></i>
              <span>Vendors</span>
            </Link>
            <Link href="/payroll" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg cursor-pointer">
              <i className="ri-money-dollar-circle-line"></i>
              <span>Payroll</span>
            </Link>
            <Link href="/staff" className="flex items-center space-x-3 px-3 py-2 bg-blue-600 rounded-lg">
              <i className="ri-team-line"></i>
              <span>Staff Management</span>
            </Link>

            <div className="text-xs uppercase text-gray-400 mb-4 mt-8">REPORTS</div>
            <Link href="/analytics" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg cursor-pointer">
              <i className="ri-line-chart-line"></i>
              <span>Analytics</span>
            </Link>
            <Link href="/reports" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg cursor-pointer">
              <i className="ri-file-chart-line"></i>
              <span>Reports</span>
            </Link>

            <div className="text-xs uppercase text-gray-400 mb-4 mt-8">SETTINGS</div>
            <Link href="/users" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg cursor-pointer">
              <i className="ri-user-line"></i>
              <span>Users</span>
            </Link>
            <Link href="/settings" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg cursor-pointer">
              <i className="ri-settings-2-line"></i>
              <span>Settings</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <button
            onClick={handleAddClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-add-line mr-2"></i>Add Staff Member
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search staff..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm pr-8"
              >
                <option>All</option>
                <option>Maintenance</option>
                <option>Security</option>
                <option>Facilities</option>
                <option>Administration</option>
                <option>Operations</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm pr-8"
              >
                <option>All</option>
                <option>Active</option>
                <option>On Leave</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <i className="ri-loader-4-line text-4xl text-blue-500 animate-spin"></i>
              <p className="mt-4 text-gray-600">Loading staff...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hire Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-600 text-sm font-medium">
                                {member.full_name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{member.full_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.position}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(member.hire_date)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                            {member.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleDeleteStaff(member.id)}
                            className="text-red-600 hover:text-red-800 cursor-pointer"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                        No staff members found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Add Staff Member</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateStaff} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                    >
                      <option>Maintenance</option>
                      <option>Security</option>
                      <option>Facilities</option>
                      <option>Administration</option>
                      <option>Operations</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hire Date</label>
                    <input
                      type="date"
                      value={formData.hire_date}
                      onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                    >
                      <option>Active</option>
                      <option>On Leave</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Add Staff Member
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {limitBlocked && (
        <div className="fixed bottom-6 right-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl shadow-lg text-sm font-medium z-50 flex flex-col gap-3 max-w-sm">
          <div className="flex items-center gap-2">
            <i className="ri-alert-line text-red-500"></i>
            <span>{limitBlocked.message}</span>
          </div>
          <Link
            href={limitBlocked.upgradeUrl}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 cursor-pointer transition-colors whitespace-nowrap"
          >
            <span>Upgrade Plan</span>
            <div className="w-3 h-3 flex items-center justify-center">
              <i className="ri-arrow-right-up-line"></i>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
