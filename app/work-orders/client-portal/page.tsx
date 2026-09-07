'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const DEMO_JOBS = [
  { id: 1, job_id: 'WO-2026-001', title: 'HVAC Unit A-201 Fault - Unusual Noise', type: 'reactive', priority: 'high', status: 'in_progress', due_date: '2026-05-15', assigned_engineer: 'Mike Johnson', created_at: '2026-05-09', description: 'Loud rattling noise from rooftop HVAC unit during operation. Possible bearing failure.' },
  { id: 2, job_id: 'WO-2026-002', title: 'Lobby Emergency Lighting Test', type: 'inspection', priority: 'medium', status: 'completed', due_date: '2026-05-10', assigned_engineer: 'Sarah Chen', created_at: '2026-05-05', description: 'Monthly emergency lighting test and battery check.' },
  { id: 5, job_id: 'WO-2026-005', title: 'Fire Alarm Panel Fault - Zone 4', type: 'reactive', priority: 'high', status: 'awaiting_parts', due_date: '2026-05-14', assigned_engineer: 'Mike Johnson', created_at: '2026-05-08', description: 'Fire alarm panel showing fault on Zone 4.' },
  { id: 3, job_id: 'WO-2026-003', title: 'Boiler Room Annual Service', type: 'planned', priority: 'high', status: 'assigned', due_date: '2026-05-20', assigned_engineer: 'Tom Wilson', created_at: '2026-05-10', description: 'Annual service and inspection of main boiler system.' },
];

const statusConfig: Record<string, { label: string; color: string; icon: string; step: number }> = {
  new: { label: 'Received', color: 'text-gray-500', icon: 'ri-inbox-line', step: 1 },
  assigned: { label: 'Engineer Assigned', color: 'text-blue-600', icon: 'ri-user-line', step: 2 },
  in_progress: { label: 'Work In Progress', color: 'text-indigo-600', icon: 'ri-tools-line', step: 3 },
  awaiting_parts: { label: 'Awaiting Parts', color: 'text-orange-600', icon: 'ri-time-line', step: 3 },
  on_hold: { label: 'On Hold', color: 'text-yellow-600', icon: 'ri-pause-circle-line', step: 3 },
  completed: { label: 'Completed', color: 'text-green-600', icon: 'ri-checkbox-circle-line', step: 4 },
  cancelled: { label: 'Cancelled', color: 'text-red-600', icon: 'ri-close-circle-line', step: 0 },
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600', medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700', emergency: 'bg-red-100 text-red-700',
};

export default function ClientPortalPage() {
  const [jobs] = useState(DEMO_JOBS);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showRaise, setShowRaise] = useState(false);
  const [comment, setComment] = useState('');
  const [commentSent, setCommentSent] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', contact_name: '', contact_email: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleRaise = async (e: React.FormEvent) => {
    e.preventDefault();
    const jobId = `WO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;
    try {
      await supabase.from('work_orders').insert([{ ...form, job_id: jobId, status: 'new', type: 'reactive', tenant_id: 'demo', client_name: form.contact_name, client_email: form.contact_email }]);
    } catch {}
    setSubmitted(true);
  };

  const handleComment = async () => {
    if (!comment.trim() || !selectedJob) return;
    try {
      await supabase.from('work_order_notes').insert([{ work_order_id: selectedJob.id, note: comment, note_type: 'client', author: 'Client', author_role: 'client' }]);
    } catch {}
    setComment('');
    setCommentSent(true);
    setTimeout(() => setCommentSent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">N</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Synqoro FM</p>
              <p className="text-xs text-gray-400">Client Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">Acme Corp</p>
              <p className="text-xs text-gray-400">facilities@acme.com</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-semibold">A</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {!selectedJob && !showRaise ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Service Requests</h1>
                <p className="text-sm text-gray-500 mt-1">Track and manage your facility maintenance requests</p>
              </div>
              <button onClick={() => setShowRaise(true)} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 cursor-pointer transition-colors whitespace-nowrap">
                <i className="ri-add-line"></i> Raise New Job
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Jobs', value: jobs.length, icon: 'ri-file-list-3-line', color: 'bg-blue-50 text-blue-600' },
                { label: 'In Progress', value: jobs.filter(j => j.status === 'in_progress').length, icon: 'ri-play-circle-line', color: 'bg-indigo-50 text-indigo-600' },
                { label: 'Awaiting', value: jobs.filter(j => ['new', 'assigned', 'awaiting_parts'].includes(j.status)).length, icon: 'ri-time-line', color: 'bg-orange-50 text-orange-600' },
                { label: 'Completed', value: jobs.filter(j => j.status === 'completed').length, icon: 'ri-checkbox-circle-line', color: 'bg-green-50 text-green-600' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className={`w-9 h-9 ${s.color} rounded-lg flex items-center justify-center mb-3`}>
                    <i className={`${s.icon}`}></i>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {jobs.map(job => {
                const cfg = statusConfig[job.status] || statusConfig['new'];
                return (
                  <div key={job.id} onClick={() => setSelectedJob(job)}
                    className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 cursor-pointer transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{job.job_id}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[job.priority]}`}>{job.priority}</span>
                          <span className="text-xs text-gray-400 capitalize">{job.type}</span>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1">{job.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{job.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className={`flex items-center gap-1.5 ${cfg.color} mb-1`}>
                          <i className={cfg.icon}></i>
                          <span className="text-sm font-medium">{cfg.label}</span>
                        </div>
                        {job.assigned_engineer && (
                          <p className="text-xs text-gray-400">{job.assigned_engineer}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">Due: {new Date(job.due_date).toLocaleDateString('en-GB')}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : showRaise ? (
          <div className="max-w-xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => { setShowRaise(false); setSubmitted(false); }} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
                <i className="ri-arrow-left-line"></i>
              </button>
              <h2 className="text-xl font-bold text-gray-900">Raise a New Job</h2>
            </div>
            {submitted ? (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-checkbox-circle-fill text-green-500 text-3xl"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Job Raised Successfully</h3>
                <p className="text-gray-500 text-sm mb-6">Your service request has been submitted. Our FM team will review and assign an engineer shortly. You'll receive email updates as the job progresses.</p>
                <button onClick={() => { setShowRaise(false); setSubmitted(false); setForm({ title: '', description: '', priority: 'medium', contact_name: '', contact_email: '' }); }}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 cursor-pointer whitespace-nowrap">
                  Back to My Jobs
                </button>
              </div>
            ) : (
              <form onSubmit={handleRaise} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Issue Title *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of the issue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Description *</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required rows={4} maxLength={500}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Please describe the issue in detail, including location and any relevant information..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['low', 'medium', 'high', 'emergency'].map(p => (
                      <button key={p} type="button" onClick={() => setForm(f => ({ ...f, priority: p }))}
                        className={`py-2 rounded-lg text-xs font-medium border cursor-pointer capitalize transition-colors ${form.priority === p ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name *</label>
                    <input value={form.contact_name} onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))} required
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="Full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                    <input type="email" value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} required
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="your@email.com" />
                  </div>
                </div>
                <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 cursor-pointer transition-colors whitespace-nowrap">
                  Submit Service Request
                </button>
              </form>
            )}
          </div>
        ) : selectedJob ? (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setSelectedJob(null)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
                <i className="ri-arrow-left-line"></i>
              </button>
              <h2 className="text-xl font-bold text-gray-900">Job Details</h2>
            </div>

            <div className="grid grid-cols-3 gap-5">
              <div className="col-span-2 space-y-4">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{selectedJob.job_id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[selectedJob.priority]}`}>{selectedJob.priority}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedJob.title}</h3>
                  <p className="text-sm text-gray-600">{selectedJob.description}</p>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="text-sm font-semibold text-gray-700 mb-4">Job Progress</p>
                  <div className="flex items-center gap-0">
                    {['Received', 'Assigned', 'In Progress', 'Completed'].map((step, i) => {
                      const currentStep = statusConfig[selectedJob.status]?.step || 1;
                      const active = i + 1 <= currentStep;
                      return (
                        <div key={step} className="flex items-center flex-1">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                              {active ? <i className="ri-check-line"></i> : i + 1}
                            </div>
                            <span className={`text-xs mt-1 whitespace-nowrap ${active ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>{step}</span>
                          </div>
                          {i < 3 && <div className={`flex-1 h-0.5 mx-1 mb-4 ${active && i + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`}></div>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Add Comment</p>
                  <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} maxLength={500}
                    placeholder="Add a comment or question for the FM team..."
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 resize-none mb-2" />
                  {commentSent && <p className="text-green-600 text-xs mb-2">Comment sent successfully!</p>}
                  <button onClick={handleComment} disabled={!comment.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 cursor-pointer whitespace-nowrap">
                    Send Comment
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Job Info</p>
                  <div className="space-y-3">
                    {[
                      { label: 'Status', value: statusConfig[selectedJob.status]?.label || selectedJob.status },
                      { label: 'Engineer', value: selectedJob.assigned_engineer || 'Unassigned' },
                      { label: 'Due Date', value: new Date(selectedJob.due_date).toLocaleDateString('en-GB') },
                      { label: 'Raised', value: new Date(selectedJob.created_at).toLocaleDateString('en-GB') },
                      { label: 'Type', value: selectedJob.type },
                    ].map(row => (
                      <div key={row.label}>
                        <p className="text-xs text-gray-400">{row.label}</p>
                        <p className="text-sm font-medium text-gray-700 capitalize">{row.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="w-full py-2.5 bg-gray-800 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 cursor-pointer transition-colors whitespace-nowrap">
                  <i className="ri-download-line mr-2"></i>Download Report
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}