'use client';

import Link from 'next/link';
import { AssetStatusBadge, ComplianceBadge } from './AssetStatusBadge';

interface Asset {
  id: number;
  asset_id: string;
  name: string;
  category_id: number;
  site_id: number;
  manufacturer: string;
  model: string;
  location: string;
  status: string;
  compliance_status: string;
  next_service_date: string;
  warranty_expiry: string;
  asset_categories?: { name: string; icon: string; color: string };
  asset_sites?: { name: string };
}

interface Props {
  assets: Asset[];
  onDelete: (id: number) => void;
}

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function isOverdue(d: string | null) {
  if (!d) return false;
  return new Date(d) < new Date();
}

function daysUntil(d: string | null) {
  if (!d) return null;
  const diff = new Date(d).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function AssetTable({ assets, onDelete }: Props) {
  if (assets.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mx-auto mb-4">
          <i className="ri-database-2-line text-gray-400 text-2xl"></i>
        </div>
        <p className="text-gray-500 font-medium">No assets found</p>
        <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or add a new asset</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Asset</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Site / Location</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Compliance</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Next Service</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Warranty</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {assets.map((asset) => {
              const serviceDays = daysUntil(asset.next_service_date);
              const warrantyDays = daysUntil(asset.warranty_expiry);
              return (
                <tr key={asset.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{asset.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{asset.asset_id} · {asset.manufacturer} {asset.model}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{asset.asset_categories?.name || '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-700">{asset.asset_sites?.name || '—'}</div>
                    <div className="text-xs text-gray-400">{asset.location}</div>
                  </td>
                  <td className="px-4 py-3">
                    <AssetStatusBadge status={asset.status} />
                  </td>
                  <td className="px-4 py-3">
                    <ComplianceBadge status={asset.compliance_status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className={`text-sm font-medium ${isOverdue(asset.next_service_date) ? 'text-red-600' : serviceDays !== null && serviceDays <= 30 ? 'text-yellow-600' : 'text-gray-700'}`}>
                      {formatDate(asset.next_service_date)}
                    </div>
                    {isOverdue(asset.next_service_date) && (
                      <div className="text-xs text-red-500">Overdue</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className={`text-sm font-medium ${warrantyDays !== null && warrantyDays < 0 ? 'text-red-600' : warrantyDays !== null && warrantyDays <= 90 ? 'text-yellow-600' : 'text-gray-700'}`}>
                      {formatDate(asset.warranty_expiry)}
                    </div>
                    {warrantyDays !== null && warrantyDays < 0 && (
                      <div className="text-xs text-red-500">Expired</div>
                    )}
                    {warrantyDays !== null && warrantyDays >= 0 && warrantyDays <= 90 && (
                      <div className="text-xs text-yellow-600">{warrantyDays}d left</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/asset-register/${asset.id}`}
                        className="w-7 h-7 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded cursor-pointer transition-colors">
                        <i className="ri-eye-line text-sm"></i>
                      </Link>
                      <button onClick={() => onDelete(asset.id)}
                        className="w-7 h-7 flex items-center justify-center text-red-500 hover:bg-red-50 rounded cursor-pointer transition-colors">
                        <i className="ri-delete-bin-line text-sm"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}