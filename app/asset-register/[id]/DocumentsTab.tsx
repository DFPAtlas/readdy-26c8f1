'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Doc {
  id: number;
  name: string;
  document_type: string;
  url: string;
  expiry_date: string;
  uploaded_by: string;
  created_at: string;
}

interface Props {
  assetId: number;
  documents: Doc[];
  onRefresh: () => void;
}

function fmt(d: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function isExpired(d: string) {
  return d && new Date(d) < new Date();
}

const docTypes = ['Service Certificate', 'Gas Safe Certificate', 'EICR Certificate', 'LOLER Certificate', 'Fire Alarm Inspection Report', 'Test Certificate', 'Performance Report', 'MOT Certificate', 'Service Record', 'Risk Assessment', 'Compliance Certificate', 'Other'];

export default function DocumentsTab({ assetId, documents, onRefresh }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', document_type: 'Service Certificate', expiry_date: '', uploaded_by: '' });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('asset_documents').insert({
      asset_id: assetId,
      name: form.name,
      document_type: form.document_type,
      url: '#',
      expiry_date: form.expiry_date || null,
      uploaded_by: form.uploaded_by || null,
    });
    setSaving(false);
    setShowForm(false);
    setForm({ name: '', document_type: 'Service Certificate', expiry_date: '', uploaded_by: '' });
    onRefresh();
  };

  const handleDelete = async (id: number) => {
    await supabase.from('asset_documents').delete().eq('id', id);
    onRefresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Documents & Certificates ({documents.length})</h3>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 cursor-pointer whitespace-nowrap">
          <i className="ri-upload-line"></i> Upload Document
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Document Name *</label>
              <input required value={form.name} onChange={e => set('name', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm bg-white" placeholder="e.g. Gas Safety Certificate 2025" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Document Type</label>
              <select value={form.document_type} onChange={e => set('document_type', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm bg-white pr-8">
                {docTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Expiry Date</label>
              <input type="date" value={form.expiry_date} onChange={e => set('expiry_date', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Uploaded By</label>
              <input value={form.uploaded_by} onChange={e => set('uploaded_by', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm bg-white" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving}
              className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap disabled:opacity-50">
              {saving ? 'Saving...' : 'Add Document'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-4 py-1.5 bg-white text-gray-600 border border-gray-200 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap">
              Cancel
            </button>
          </div>
        </form>
      )}

      {documents.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <i className="ri-file-list-3-line text-3xl mb-2 block"></i>
          <p className="text-sm">No documents uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map(doc => (
            <div key={doc.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
              <div className="w-9 h-9 flex items-center justify-center bg-blue-50 rounded-lg flex-shrink-0">
                <i className="ri-file-pdf-line text-blue-600"></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">{doc.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-400">{doc.document_type}</span>
                  {doc.expiry_date && (
                    <span className={`text-xs font-medium ${isExpired(doc.expiry_date) ? 'text-red-500' : 'text-gray-400'}`}>
                      {isExpired(doc.expiry_date) ? 'Expired' : 'Expires'}: {fmt(doc.expiry_date)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 flex items-center justify-center text-blue-500 hover:bg-blue-50 rounded cursor-pointer">
                  <i className="ri-download-line text-sm"></i>
                </button>
                <button onClick={() => handleDelete(doc.id)}
                  className="w-7 h-7 flex items-center justify-center text-red-400 hover:bg-red-50 rounded cursor-pointer">
                  <i className="ri-delete-bin-line text-sm"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}