'use client';

import { useState, useEffect, Suspense } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { supabase } from '@/lib/supabase';

const demoVendors = [
  { id: '1', name: 'ProClimate HVAC Services', contact_person: 'Richard Hayes', email: 'richard@proclimate.com', phone: '(555) 100-2001', service_type: 'HVAC', status: 'Active', rating: 5, created_at: '2023-01-10' },
  { id: '2', name: 'BrightSpark Electrical', contact_person: 'Angela Torres', email: 'angela@brightspark.com', phone: '(555) 100-2002', service_type: 'Electrical', status: 'Active', rating: 4, created_at: '2023-02-15' },
  { id: '3', name: 'AquaFlow Plumbing Co.', contact_person: 'Derek Simmons', email: 'derek@aquaflow.com', phone: '(555) 100-2003', service_type: 'Plumbing', status: 'Active', rating: 4, created_at: '2023-03-20' },
  { id: '4', name: 'ShieldGuard Security', contact_person: 'Patricia Nguyen', email: 'patricia@shieldguard.com', phone: '(555) 100-2004', service_type: 'Security', status: 'Active', rating: 5, created_at: '2023-04-05' },
  { id: '5', name: 'GreenScape Landscaping', contact_person: 'Marcus Webb', email: 'marcus@greenscape.com', phone: '(555) 100-2005', service_type: 'Landscaping', status: 'Active', rating: 3, created_at: '2023-05-12' },
  { id: '6', name: 'SparkleClean Services', contact_person: 'Diana Reyes', email: 'diana@sparkleclean.com', phone: '(555) 100-2006', service_type: 'Cleaning', status: 'Active', rating: 4, created_at: '2023-06-18' },
  { id: '7', name: 'TechLift Elevator Corp.', contact_person: 'Howard Grant', email: 'howard@techlift.com', phone: '(555) 100-2007', service_type: 'Electrical', status: 'Active', rating: 5, created_at: '2023-07-22' },
  { id: '8', name: 'FireSafe Inspections', contact_person: 'Laura Kim', email: 'laura@firesafe.com', phone: '(555) 100-2008', service_type: 'Security', status: 'Active', rating: 5, created_at: '2023-08-01' },
  { id: '9', name: 'PipeMaster Solutions', contact_person: 'Carlos Mendez', email: 'carlos@pipemaster.com', phone: '(555) 100-2009', service_type: 'Plumbing', status: 'Inactive', rating: 3, created_at: '2023-09-10' },
  { id: '10', name: 'CoolBreeze AC Repair', contact_person: 'Samantha Cole', email: 'samantha@coolbreeze.com', phone: '(555) 100-2010', service_type: 'HVAC', status: 'Pending', rating: 4, created_at: '2024-01-05' },
];

function VendorsContent() {
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState<any[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterServiceType, setFilterServiceType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    service_type: 'HVAC',
    status: 'Active',
    rating: 5
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    filterVendors();
  }, [vendors, searchTerm, filterServiceType, filterStatus]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        setVendors(demoVendors);
      } else {
        setVendors(data);
      }
    } catch {
      setVendors(demoVendors);
    } finally {
      setLoading(false);
    }
  };

  const filterVendors = () => {
    let filtered = [...vendors];

    if (searchTerm) {
      filtered = filtered.filter((vendor: any) =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterServiceType !== 'All') {
      filtered = filtered.filter((vendor: any) => vendor.service_type === filterServiceType);
    }

    if (filterStatus !== 'All') {
      filtered = filtered.filter((vendor: any) => vendor.status === filterStatus);
    }

    setFilteredVendors(filtered);
  };

  const handleCreateVendor = async (e: any) => {
    e.preventDefault();
    const newVendor = {
      ...formData,
      id: String(Date.now()),
      created_at: new Date().toISOString()
    };
    try {
      const { error } = await supabase.from('vendors').insert([formData]);
      if (!error) {
        fetchVendors();
      } else {
        setVendors((prev: any) => [newVendor, ...prev]);
      }
    } catch {
      setVendors((prev: any) => [newVendor, ...prev]);
    }
    setShowCreateModal(false);
    setFormData({
      name: '',
      contact_person: '',
      email: '',
      phone: '',
      service_type: 'HVAC',
      status: 'Active',
      rating: 5
    });
  };

  const handleDeleteVendor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return;
    try {
      await supabase.from('vendors').delete().eq('id', id);
    } catch {
    }
    setVendors((prev: any) => prev.filter((v: any) => v.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Inactive':
        return 'bg-gray-100 text-gray-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1,2,3,4,5].map((i) => (
          <i
            key={i}
            className={i <= rating ? 'ri-star-fill text-yellow-400 text-sm' : 'ri-star-line text-yellow-400 text-sm'}
          ></i>
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#030912]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Vendors" />
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Vendors</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-cyan-400 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-add-line mr-2"></i>Add Vendor
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search vendors..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Service Type</label>
                <select
                  value={filterServiceType}
                  onChange={(e) => setFilterServiceType(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-white pr-8"
                >
                  <option>All</option>
                  <option>HVAC</option>
                  <option>Electrical</option>
                  <option>Plumbing</option>
                  <option>Cleaning</option>
                  <option>Security</option>
                  <option>Landscaping</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-white pr-8"
                >
                  <option>All</option>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Pending</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <i className="ri-loader-4-line text-4xl text-cyan-500 animate-spin"></i>
                <p className="mt-4 text-gray-500">Loading vendors...</p>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Person</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredVendors.length > 0 ? (
                      filteredVendors.map((vendor: any) => (
                        <tr key={vendor.id} className="hover:bg-white/5">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <i className="ri-truck-line text-gray-500 mr-2"></i>
                              <span className="text-sm font-medium text-white">{vendor.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{vendor.contact_person}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{vendor.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{vendor.phone}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{vendor.service_type}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{renderStars(vendor.rating)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vendor.status)}`}>
                              {vendor.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleDeleteVendor(vendor.id)}
                              className="text-red-400 hover:text-red-300 cursor-pointer"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                          No vendors found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#080f20] border border-white/10 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Add Vendor</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-300 cursor-pointer"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateVendor} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Vendor Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Service Type</label>
                    <select
                      value={formData.service_type}
                      onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white pr-8"
                    >
                      <option>HVAC</option>
                      <option>Electrical</option>
                      <option>Plumbing</option>
                      <option>Cleaning</option>
                      <option>Security</option>
                      <option>Landscaping</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white pr-8"
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                      <option>Pending</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Rating</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white pr-8"
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-cyan-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-cyan-400 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Add Vendor
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-white/10 text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-white/20 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VendorsPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="flex min-h-screen bg-[#030912] items-center justify-center"><i className="ri-loader-4-line animate-spin text-cyan-400 text-3xl"></i></div>}>
        <VendorsContent />
      </Suspense>
    </AuthGuard>
  );
}