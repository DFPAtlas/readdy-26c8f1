'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

function DocumentsContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const categories = [
    { id: 'all', name: 'All Documents' },
    { id: 'manuals', name: 'Equipment Manuals' },
    { id: 'procedures', name: 'Procedures' },
    { id: 'contracts', name: 'Contracts' },
    { id: 'certificates', name: 'Certificates' },
    { id: 'reports', name: 'Reports' },
    { id: 'templates', name: 'Templates' }
  ];

  const documents = [
    { id: 'DOC-001', name: 'HVAC System Manual', category: 'Equipment Manuals', type: 'PDF', size: '2.4 MB', version: '1.2', author: 'John Smith', created: '2024-01-15', modified: '2024-01-20', status: 'Current', tags: ['HVAC', 'Manual', 'Maintenance'] },
    { id: 'DOC-002', name: 'Emergency Evacuation Plan', category: 'Procedures', type: 'PDF', size: '1.8 MB', version: '2.1', author: 'Sarah Johnson', created: '2024-01-10', modified: '2024-01-18', status: 'Current', tags: ['Emergency', 'Safety', 'Evacuation'] },
    { id: 'DOC-003', name: 'Cleaning Services Contract', category: 'Contracts', type: 'DOCX', size: '856 KB', version: '1.0', author: 'Mike Davis', created: '2024-01-05', modified: '2024-01-05', status: 'Signed', tags: ['Contract', 'Cleaning', 'Vendor'] },
    { id: 'DOC-004', name: 'Fire Safety Certificate', category: 'Certificates', type: 'PDF', size: '542 KB', version: '1.0', author: 'Fire Department', created: '2023-12-20', modified: '2023-12-20', status: 'Valid', tags: ['Certificate', 'Fire Safety', 'Compliance'] },
    { id: 'DOC-005', name: 'Monthly Maintenance Report', category: 'Reports', type: 'PDF', size: '3.2 MB', version: '1.0', author: 'David Wilson', created: '2024-01-01', modified: '2024-01-01', status: 'Final', tags: ['Report', 'Maintenance', 'Monthly'] },
    { id: 'DOC-006', name: 'Work Order Template', category: 'Templates', type: 'DOCX', size: '124 KB', version: '1.5', author: 'Admin', created: '2023-11-15', modified: '2024-01-10', status: 'Active', tags: ['Template', 'Work Order', 'Form'] }
  ];

  const filteredDocuments = documents.filter((doc: any) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || doc.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === categories.find((c: any) => c.id === selectedCategory)?.name;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) { case 'Current': case 'Active': case 'Valid': return 'bg-green-100 text-green-700'; case 'Signed': case 'Final': return 'bg-blue-100 text-blue-700'; case 'Expired': return 'bg-red-100 text-red-700'; case 'Draft': return 'bg-yellow-100 text-yellow-700'; default: return 'bg-gray-100 text-gray-700'; }
  };

  const getFileIcon = (type: string) => {
    switch (type) { case 'PDF': return 'ri-file-pdf-line'; case 'DOCX': return 'ri-file-word-line'; case 'XLSX': return 'ri-file-excel-line'; default: return 'ri-file-line'; }
  };

  const handleUploadSubmit = (e: any) => { e.preventDefault(); setShowUploadModal(false); };

  return (
    <div className="flex min-h-screen bg-[#030912]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Document Management" />
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Document Management</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewModel === 'grid' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-gray-400'} cursor-pointer`}>
                  <i className="ri-grid-line"></i>
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewModel === 'list' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-gray-400'} cursor-pointer`}>
                  <i className="ri-list-check"></i>
                </button>
              </div>
              <button onClick={() => setShowUploadModal(true)} className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-cyan-400 transition-colors whitespace-nowrap cursor-pointer">
                <i className="ri-upload-line mr-2"></i>Upload Document
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[{ icon: 'ri-file-list-line', color: 'bg-cyan-500', label: 'Total Documents', value: '1,247' }, { icon: 'ri-hard-drive-line', color: 'bg-emerald-500', label: 'Storage Used', value: '2.4 GB' }, { icon: 'ri-alarm-warning-line', color: 'bg-amber-500', label: 'Expiring Soon', value: '8' }, { icon: 'ri-share-line', color: 'bg-violet-500', label: 'Shared Documents', value: '156' }].map((s: any, i: number) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm text-gray-400 mb-1">{s.label}</p><p className="text-2xl font-bold text-white">{s.value}</p></div>
                  <div className={`w-12 h-12 ${s.color} rounded-lg flex items-center justify-center`}><i className={`${s.icon} text-white`}></i></div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Search Documents</label>
                <div className="relative">
                  <input type="text" placeholder="Search by name or tags..." value={searchTerm} onChange={(e: any) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-white placeholder-gray-500" />
                  <i className="ri-search-line absolute left-3 top-2.5 text-gray-500"></i>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                <select value={selectedCategory} onChange={(e: any) => setSelectedCategory(e.target.value)} className="w-full pr-8 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-white">
                  {categories.map((category: any) => (<option key={category.id} value={category.id}>{category.name}</option>))}
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-cyan-400 transition-colors whitespace-nowrap cursor-pointer"><i className="ri-filter-line mr-2"></i>Advanced Filter</button>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-white/10"><h2 className="text-lg font-semibold text-white">Documents ({filteredDocuments.length})</h2></div>
            {viewModel === 'grid' ? (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDocuments.map((doc: any) => (
                    <div key={doc.id} className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-500/20 rounded-lg flex items-center justify-center"><i className={`${getFileIcon(doc.type)} text-cyan-400`}></i></div>
                          <div><h3 className="font-medium text-white">{doc.name}</h3><p className="text-sm text-gray-500">{doc.type} • {doc.size}</p></div>
                        </div>
                        <button className="text-gray-500 hover:text-gray-300 cursor-pointer"><i className="ri-more-2-line"></i></button>
                      </div>
                      <div className="mb-3"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>{doc.status}</span></div>
                      <div className="text-sm text-gray-400 mb-2"><p>Version: {doc.version}</p><p>Author: {doc.author}</p><p>Modified: {doc.modified}</p></div>
                      <div className="flex flex-wrap gap-1">{doc.tags.map((tag: string, idx: number) => (<span key={idx} className="px-2 py-1 bg-white/10 text-gray-400 text-xs rounded-md">{tag}</span>))}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-white/10">{['Document','Category','Type','Size','Version','Status','Modified','Actions'].map((h: string)=>(<th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>))}</tr></thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredDocuments.map((doc: any) => (
                      <tr key={doc.id} className="hover:bg-white/5">
                        <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center mr-3"><i className={`${getFileIcon(doc.type)} text-cyan-400`}></i></div><div><div className="text-sm font-medium text-white">{doc.name}</div><div className="text-sm text-gray-500">{doc.id}</div></div></div></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{doc.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{doc.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{doc.size}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{doc.version}</td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>{doc.status}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{doc.modified}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm"><div className="flex space-x-2"><button className="text-cyan-400 hover:text-cyan-300 cursor-pointer"><i className="ri-download-line"></i></button><button className="text-gray-500 hover:text-gray-300 cursor-pointer"><i className="ri-edit-line"></i></button><button className="text-emerald-400 hover:text-emerald-300 cursor-pointer"><i className="ri-share-line"></i></button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#080f20] border border-white/10 rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-white/10"><div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-white">Upload Document</h3><button onClick={() => setShowUploadModal(false)} className="text-gray-500 hover:text-gray-300 cursor-pointer"><i className="ri-close-line"></i></button></div></div>
            <form onSubmit={handleUploadSubmit} className="p-6">
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-400 mb-2">Document Name</label><input type="text" name="documentName" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-white" placeholder="Enter document name" required /></div>
                <div><label className="block text-sm font-medium text-gray-400 mb-2">Category</label><select name="category" className="w-full pr-8 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-white" required><option value="">Select category</option><option value="manuals">Equipment Manuals</option><option value="procedures">Procedures</option><option value="contracts">Contracts</option><option value="certificates">Certificates</option><option value="reports">Reports</option><option value="templates">Templates</option></select></div>
                <div><label className="block text-sm font-medium text-gray-400 mb-2">File Upload</label><div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center"><input type="file" name="file" className="hidden" id="fileInput" accept=".pdf,.doc,.docx,.xlsx,.xls" required /><label htmlFor="fileInput" className="cursor-pointer"><i className="ri-upload-cloud-line text-4xl text-gray-500 mb-2"></i><p className="text-sm text-gray-400 mb-1">Click to upload or drag and drop</p><p className="text-xs text-gray-500">PDF, DOC, DOCX, XLSX up to 10MB</p></label></div></div>
                <div><label className="block text-sm font-medium text-gray-400 mb-2">Description</label><textarea name="description" rows={3} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-white" placeholder="Optional description" /></div>
                <div><label className="block text-sm font-medium text-gray-400 mb-2">Tags</label><input type="text" name="tags" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-white" placeholder="Add tags separated by commas" /></div>
              </div>
              <div className="flex space-x-3 mt-6"><button type="submit" className="flex-1 bg-cyan-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-cyan-400 transition-colors cursor-pointer">Upload Document</button><button type="button" onClick={() => setShowUploadModal(false)} className="flex-1 bg-white/10 text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-white/20 transition-colors cursor-pointer">Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="flex min-h-screen bg-[#030912] items-center justify-center"><i className="ri-loader-4-line animate-spin text-cyan-400 text-3xl"></i></div>}>
        <DocumentsContent />
      </Suspense>
    </AuthGuard>
  );
}