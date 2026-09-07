'use client';

import { useState, useEffect, Suspense } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const demoAssets = [
  { id: '1', name: 'Central HVAC Unit A-201', type: 'HVAC', location: 'Building A - Floor 2', status: 'Operational', last_maintenance: '2024-01-15', next_maintenance: '2024-04-15', created_at: '2023-06-01' },
  { id: '2', name: 'Fire Alarm Panel FP-101', type: 'Fire Safety', location: 'Building A - Lobby', status: 'Operational', last_maintenance: '2024-01-10', next_maintenance: '2024-02-10', created_at: '2023-05-15' },
  { id: '3', name: 'Passenger Elevator EL-01', type: 'Elevator', location: 'Building A - Main Shaft', status: 'Maintenance Required', last_maintenance: '2023-11-20', next_maintenance: '2024-01-20', created_at: '2023-04-01' },
  { id: '4', name: 'Emergency Generator GEN-01', type: 'Electrical', location: 'Building A - Basement', status: 'Operational', last_maintenance: '2024-01-05', next_maintenance: '2024-04-05', created_at: '2023-03-10' },
  { id: '5', name: 'Rooftop Air Handler AHU-301', type: 'HVAC', location: 'Building A - Roof', status: 'Inspection Due', last_maintenance: '2023-10-15', next_maintenance: '2024-01-15', created_at: '2023-07-20' },
  { id: '6', name: 'Main Water Pump WP-01', type: 'Plumbing', location: 'Building B - Basement', status: 'Operational', last_maintenance: '2024-01-08', next_maintenance: '2024-07-08', created_at: '2023-02-15' },
  { id: '7', name: 'CCTV System CAM-Network', type: 'Security', location: 'Building A - All Floors', status: 'Operational', last_maintenance: '2024-01-20', next_maintenance: '2024-07-20', created_at: '2023-08-01' },
  { id: '8', name: 'Chiller Unit CH-02', type: 'HVAC', location: 'Building B - Mechanical Room', status: 'Critical', last_maintenance: '2023-09-10', next_maintenance: '2023-12-10', created_at: '2023-01-05' },
  { id: '9', name: 'Fire Suppression Sprinkler FS-201', type: 'Fire Safety', location: 'Building B - Floor 2', status: 'Operational', last_maintenance: '2024-01-12', next_maintenance: '2024-07-12', created_at: '2023-06-15' },
  { id: '10', name: 'Electrical Panel EP-Main', type: 'Electrical', location: 'Building A - Electrical Room', status: 'Operational', last_maintenance: '2024-01-18', next_maintenance: '2024-06-18', created_at: '2023-04-20' },
  { id: '11', name: 'Freight Elevator EL-02', type: 'Elevator', location: 'Building B - Service Shaft', status: 'Out of Service', last_maintenance: '2023-12-01', next_maintenance: '2024-02-01', created_at: '2023-05-01' },
  { id: '12', name: 'Boiler System BLR-01', type: 'HVAC', location: 'Building A - Boiler Room', status: 'Operational', last_maintenance: '2024-01-22', next_maintenance: '2024-04-22', created_at: '2023-03-25' },
  { id: '13', name: 'Access Control System ACS-01', type: 'Security', location: 'All Buildings - Entry Points', status: 'Operational', last_maintenance: '2024-01-14', next_maintenance: '2024-04-14', created_at: '2023-09-10' },
  { id: '14', name: 'Sewage Pump SP-01', type: 'Plumbing', location: 'Building A - Sub-Basement', status: 'Inspection Due', last_maintenance: '2023-10-25', next_maintenance: '2024-01-25', created_at: '2023-02-28' },
  { id: '15', name: 'UPS Battery Bank UPS-01', type: 'Electrical', location: 'Building A - Server Room', status: 'Maintenance Required', last_maintenance: '2023-11-15', next_maintenance: '2024-02-15', created_at: '2023-07-05' },
];

function AssetsContent() {
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<any[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'HVAC',
    location: '',
    status: 'Operational',
    last_maintenance: '',
    next_maintenance: ''
  });

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    filterAssets();
  }, [assets, searchTerm, filterStatus, filterType]);

  const fetchAssets = async () => {
    setLoading(true);
    setAssets(demoAssets);
    setLoading(false);
  };

  const filterAssets = () => {
    let filtered = [...assets];

    if (searchTerm) {
      filtered = filtered.filter((asset: any) =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'All') {
      filtered = filtered.filter((asset: any) => asset.status === filterStatus);
    }

    if (filterType !== 'All') {
      filtered = filtered.filter((asset: any) => asset.type === filterType);
    }

    setFilteredAssets(filtered);
  };

  const handleCreateAsset = async (e: any) => {
    e.preventDefault();
    const newAsset = {
      ...formData,
      id: String(Date.now()),
      created_at: new Date().toISOString()
    };
    setAssets([newAsset, ...assets]);
    setShowCreateModal(false);
    setFormData({
      name: '',
      type: 'HVAC',
      location: '',
      status: 'Operational',
      last_maintenance: '',
      next_maintenance: ''
    });
  };

  const handleDeleteAsset = async (id: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;
    setAssets(assets.filter((asset: any) => asset.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Operational':
        return 'bg-green-100 text-green-700';
      case 'Maintenance Required':
      case 'Critical':
        return 'bg-red-100 text-red-700';
      case 'Inspection Due':
        return 'bg-yellow-100 text-yellow-700';
      case 'Out of Service':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex min-h-screen bg-[#030912]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Assets" />
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Assets</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-cyan-400 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-add-line mr-2"></i>Add Asset
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
                  placeholder="Search assets..."
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
                  <option>Operational</option>
                  <option>Maintenance Required</option>
                  <option>Inspection Due</option>
                  <option>Critical</option>
                  <option>Out of Service</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-white pr-8"
                >
                  <option>All</option>
                  <option>HVAC</option>
                  <option>Electrical</option>
                  <option>Plumbing</option>
                  <option>Security</option>
                  <option>Fire Safety</option>
                  <option>Elevator</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <i className="ri-loader-4-line text-4xl text-cyan-500 animate-spin"></i>
                <p className="mt-4 text-gray-500">Loading assets...</p>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Maintenance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Maintenance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredAssets.length > 0 ? (
                      filteredAssets.map((asset: any) => (
                        <tr key={asset.id} className="hover:bg-white/5">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <i className="ri-tools-line text-gray-500 mr-2"></i>
                              <span className="text-sm font-medium text-white">{asset.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{asset.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{asset.location}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(asset.status)}`}>
                              {asset.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formatDate(asset.last_maintenance)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formatDate(asset.next_maintenance)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleDeleteAsset(asset.id)}
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
                          No assets found
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
                <h3 className="text-lg font-semibold text-white">Add New Asset</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-300 cursor-pointer"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateAsset} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Asset Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                      <option>HVAC</option>
                      <option>Electrical</option>
                      <option>Plumbing</option>
                      <option>Security</option>
                      <option>Fire Safety</option>
                      <option>Elevator</option>
                    </select>
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white pr-8"
                  >
                    <option>Operational</option>
                    <option>Maintenance Required</option>
                    <option>Inspection Due</option>
                    <option>Critical</option>
                    <option>Out of Service</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Last Maintenance</label>
                    <input
                      type="date"
                      value={formData.last_maintenance}
                      onChange={(e) => setFormData({ ...formData, last_maintenance: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Next Maintenance</label>
                    <input
                      type="date"
                      value={formData.next_maintenance}
                      onChange={(e) => setFormData({ ...formData, next_maintenance: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-cyan-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-cyan-400 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Add Asset
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

export default function AssetsPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="flex min-h-screen bg-[#030912] items-center justify-center"><i className="ri-loader-4-line animate-spin text-cyan-400 text-3xl"></i></div>}>
        <AssetsContent />
      </Suspense>
    </AuthGuard>
  );
}