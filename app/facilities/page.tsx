'use client';

import { useState, useEffect, Suspense } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const demoFacilities = [
  { id: '1', name: 'Synqoro Tower A', location: '100 Corporate Drive, Downtown', type: 'Office Building', status: 'Active', capacity: 850, floor_count: 15, created_at: '2023-01-01' },
  { id: '2', name: 'Synqoro Tower B', location: '102 Corporate Drive, Downtown', type: 'Office Building', status: 'Active', capacity: 620, floor_count: 12, created_at: '2023-01-01' },
  { id: '3', name: 'Central Warehouse', location: '45 Industrial Blvd, East District', type: 'Warehouse', status: 'Active', capacity: 200, floor_count: 2, created_at: '2023-02-15' },
  { id: '4', name: 'Innovation Hub', location: '78 Tech Park Lane, West Campus', type: 'Mixed Use', status: 'Active', capacity: 350, floor_count: 8, created_at: '2023-03-10' },
  { id: '5', name: 'Retail Center North', location: '200 Commerce St, North Plaza', type: 'Retail Space', status: 'Active', capacity: 1200, floor_count: 3, created_at: '2023-04-20' },
  { id: '6', name: 'Manufacturing Plant', location: '500 Factory Road, Industrial Zone', type: 'Manufacturing', status: 'Maintenance', capacity: 400, floor_count: 1, created_at: '2023-05-05' },
  { id: '7', name: 'Executive Conference Center', location: '100 Corporate Drive, Annex', type: 'Office Building', status: 'Active', capacity: 180, floor_count: 4, created_at: '2023-06-12' },
  { id: '8', name: 'South Parking Structure', location: '110 Corporate Drive, South Lot', type: 'Mixed Use', status: 'Active', capacity: 1500, floor_count: 6, created_at: '2023-07-01' },
  { id: '9', name: 'Data Center Facility', location: '300 Secure Ave, Tech District', type: 'Office Building', status: 'Active', capacity: 50, floor_count: 2, created_at: '2023-08-15' },
  { id: '10', name: 'Old Warehouse B', location: '47 Industrial Blvd, East District', type: 'Warehouse', status: 'Inactive', capacity: 150, floor_count: 1, created_at: '2023-01-01' },
];

function FacilitiesContent() {
  const [loading, setLoading] = useState(true);
  const [facilities, setFacilities] = useState<typeof demoFacilities>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<typeof demoFacilities>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: 'Office Building',
    status: 'Active',
    capacity: 0,
    floor_count: 0
  });

  useEffect(() => {
    fetchFacilities();
  }, []);

  useEffect(() => {
    filterFacilities();
  }, [facilities, searchTerm, filterStatus]);

  const fetchFacilities = () => {
    setLoading(true);
    setFacilities(demoFacilities);
    setLoading(false);
  };

  const filterFacilities = () => {
    let filtered = [...facilities];

    if (searchTerm) {
      filtered = filtered.filter((facility: any) =>
        facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'All') {
      filtered = filtered.filter((facility: any) => facility.status === filterStatus);
    }

    setFilteredFacilities(filtered);
  };

  const handleCreateFacility = (e: any) => {
    e.preventDefault();
    const newFacility = { ...formData, id: String(Date.now()), created_at: new Date().toISOString() };
    setFacilities((prev: any) => [newFacility, ...prev]);
    setShowCreateModal(false);
    setFormData({ name: '', location: '', type: 'Office Building', status: 'Active', capacity: 0, floor_count: 0 });
  };

  const handleDeleteFacility = (id: string) => {
    setFacilities((prev: any) => prev.filter((f: any) => f.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-700';
      case 'Inactive':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#030912]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Facilities" />
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Facilities</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-cyan-400 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-add-line mr-2"></i>Add Facility
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search facilities..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-white placeholder-gray-500"
                />
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
                  <option>Maintenance</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <i className="ri-loader-4-line text-4xl text-cyan-500 animate-spin"></i>
                <p className="mt-4 text-gray-500">Loading facilities...</p>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Floors</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredFacilities.length > 0 ? (
                      filteredFacilities.map((facility: any) => (
                        <tr key={facility.id} className="hover:bg-white/5">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <i className="ri-building-line text-gray-500 mr-2"></i>
                              <span className="text-sm font-medium text-white">{facility.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{facility.location}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{facility.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{facility.capacity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{facility.floor_count}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(facility.status)}`}>
                              {facility.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleDeleteFacility(facility.id)}
                              className="text-red-400 hover:text-red-300 cursor-pointer"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                          No facilities found
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
                <h3 className="text-lg font-semibold text-white">Add Facility</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-300 cursor-pointer"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateFacility} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Facility Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white pr-8"
                    >
                      <option>Office Building</option>
                      <option>Warehouse</option>
                      <option>Retail Space</option>
                      <option>Manufacturing</option>
                      <option>Mixed Use</option>
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
                      <option>Maintenance</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Capacity</label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Floor Count</label>
                    <input
                      type="number"
                      value={formData.floor_count}
                      onChange={(e) => setFormData({ ...formData, floor_count: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-cyan-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-cyan-400 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Add Facility
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

export default function FacilitiesPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="flex min-h-screen bg-[#030912] items-center justify-center"><i className="ri-loader-4-line animate-spin text-cyan-400 text-3xl"></i></div>}>
        <FacilitiesContent />
      </Suspense>
    </AuthGuard>
  );
}