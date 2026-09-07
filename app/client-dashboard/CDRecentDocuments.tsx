'use client';

interface Document {
  id: number;
  name: string;
  document_type: string;
  uploaded_by: string;
  created_at: string;
  expiry_date?: string;
}

interface CDRecentDocumentsProps {
  documents: Document[];
  loading: boolean;
}

const typeIcons: Record<string, { icon: string; color: string }> = {
  certificate: { icon: 'ri-award-line', color: 'text-blue-400 bg-blue-500/10 border border-blue-500/20' },
  report: { icon: 'ri-file-chart-line', color: 'text-violet-400 bg-violet-500/10 border border-violet-500/20' },
  manual: { icon: 'ri-book-line', color: 'text-teal-400 bg-teal-500/10 border border-teal-500/20' },
  invoice: { icon: 'ri-bill-line', color: 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' },
  photo: { icon: 'ri-image-line', color: 'text-pink-400 bg-pink-500/10 border border-pink-500/20' },
  contract: { icon: 'ri-file-text-line', color: 'text-amber-400 bg-amber-500/10 border border-amber-500/20' },
  other: { icon: 'ri-file-line', color: 'text-gray-400 bg-gray-500/10 border border-gray-500/20' },
};

export default function CDRecentDocuments({ documents, loading }: CDRecentDocumentsProps) {
  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
            <i className="ri-folder-line text-emerald-400"></i>
          </div>
          <div>
            <h2 className="font-semibold text-white">Recent Documents</h2>
            <p className="text-xs text-gray-500">Latest uploads</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-3">
              <div className="w-9 h-9 bg-white/10 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-3 bg-white/10 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-6 text-gray-500 text-sm">No documents uploaded yet</div>
      ) : (
        <div className="space-y-2">
          {documents.slice(0, 6).map((doc) => {
            const cfg = typeIcons[doc.document_type] || typeIcons.other;
            return (
              <div key={doc.id} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                  <i className={`${cfg.icon} text-sm`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{doc.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{doc.document_type} · {doc.uploaded_by}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                  {new Date(doc.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}