'use client';

interface FiltersProps {
  search: string;
  onSearch: (v: string) => void;
  siteFilter: string;
  onSiteFilter: (v: string) => void;
  categoryFilter: string;
  onCategoryFilter: (v: string) => void;
  statusFilter: string;
  onStatusFilter: (v: string) => void;
  complianceFilter: string;
  onComplianceFilter: (v: string) => void;
  warrantyFilter: string;
  onWarrantyFilter: (v: string) => void;
  sites: { id: number; name: string }[];
  categories: { id: number; name: string }[];
}

export default function AssetFilters({
  search, onSearch, siteFilter, onSiteFilter, categoryFilter, onCategoryFilter,
  statusFilter, onStatusFilter, complianceFilter, onComplianceFilter,
  warrantyFilter, onWarrantyFilter, sites, categories
}: FiltersProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="lg:col-span-2">
          <div className="relative">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search assets..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <select value={siteFilter} onChange={(e) => onSiteFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 pr-8">
            <option value="">All Sites</option>
            {sites.map(s => <option key={s.id} value={String(s.id)}>{s.name}</option>)}
          </select>
        </div>

        <div>
          <select value={categoryFilter} onChange={(e) => onCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 pr-8">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <select value={statusFilter} onChange={(e) => onStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 pr-8">
            <option value="">All Statuses</option>
            <option value="Operational">Operational</option>
            <option value="Maintenance Required">Maintenance Required</option>
            <option value="Inspection Due">Inspection Due</option>
            <option value="Critical">Critical</option>
            <option value="Out of Service">Out of Service</option>
          </select>
        </div>

        <div>
          <select value={complianceFilter} onChange={(e) => onComplianceFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 pr-8">
            <option value="">All Compliance</option>
            <option value="Compliant">Compliant</option>
            <option value="Due for Review">Due for Review</option>
            <option value="Non-Compliant">Non-Compliant</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3">
        <span className="text-xs text-gray-500 font-medium">Warranty:</span>
        {['', '30', '60', '90', 'expired'].map((v) => (
          <button key={v} onClick={() => onWarrantyFilter(v)}
            className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap transition-colors ${
              warrantyFilter === v ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {v === '' ? 'All' : v === 'expired' ? 'Expired' : `< ${v} days`}
          </button>
        ))}
      </div>
    </div>
  );
}