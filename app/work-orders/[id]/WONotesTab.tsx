'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const NOTE_TYPES = [
  { k: 'internal', label: 'Internal', color: 'bg-gray-100 text-gray-600', icon: 'ri-lock-line' },
  { k: 'engineer', label: 'Engineer', color: 'bg-blue-100 text-blue-600', icon: 'ri-user-settings-line' },
  { k: 'client', label: 'Client', color: 'bg-green-100 text-green-600', icon: 'ri-user-line' },
];

const DEMO_NOTES = [
  { id: 1, note: 'Job assigned to engineer. Parts ordered from supplier.', note_type: 'system', author: 'System', author_role: 'system', created_at: '2026-05-09T09:00:00Z' },
  { id: 2, note: 'Arrived on site. Bearing confirmed failed. Replacement part ordered - ETA 2 days.', note_type: 'engineer', author: 'Mike Johnson', author_role: 'engineer', created_at: '2026-05-09T11:30:00Z' },
  { id: 3, note: 'When will this be fixed? We have a board meeting on the 16th and need the AC working.', note_type: 'client', author: 'John Smith', author_role: 'client', created_at: '2026-05-10T14:00:00Z' },
];

const noteTypeColor: Record<string, string> = {
  internal: 'bg-gray-100 text-gray-600 border-gray-200',
  engineer: 'bg-blue-100 text-blue-600 border-blue-200',
  client: 'bg-green-100 text-green-600 border-green-200',
  system: 'bg-purple-100 text-purple-600 border-purple-200',
};

export default function WONotesTab({ workOrderId }: { workOrderId: number }) {
  const [notes, setNotes] = useState(DEMO_NOTES);
  const [noteText, setNoteText] = useState('');
  const [noteType, setNoteType] = useState('internal');
  const [author, setAuthor] = useState('FM Manager');
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!noteText.trim()) return;
    setSaving(true);
    const newNote = { work_order_id: workOrderId, note: noteText, note_type: noteType, author, author_role: noteType, created_at: new Date().toISOString() };
    try {
      const { data, error } = await supabase.from('work_order_notes').insert([newNote]).select().maybeSingle();
      if (!error && data) setNotes(prev => [...prev, data]);
      else setNotes(prev => [...prev, { ...newNote, id: Date.now() }]);
    } catch {
      setNotes(prev => [...prev, { ...newNote, id: Date.now() }]);
    }
    setNoteText('');
    setSaving(false);
  };

  const formatTime = (d: string) => new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {notes.map(note => (
          <div key={note.id} className="flex gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-gray-600 text-xs font-medium">{note.author[0]}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-800">{note.author}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${noteTypeColor[note.note_type] || noteTypeColor.internal}`}>
                  {note.note_type}
                </span>
                <span className="text-xs text-gray-400">{formatTime(note.created_at)}</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-100">
                {note.note}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-sm font-medium text-gray-700 mb-3">Add Note</p>
        <div className="flex gap-2 mb-3">
          {NOTE_TYPES.map(t => (
            <button key={t.k} onClick={() => setNoteType(t.k)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${noteType === t.k ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
              <i className={t.icon}></i>{t.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mb-2">
          <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Your name"
            className="w-40 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
        </div>
        <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={3} maxLength={500}
          placeholder="Add a note, update, or comment..."
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 resize-none mb-2" />
        <button onClick={handleAdd} disabled={saving || !noteText.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 cursor-pointer transition-colors whitespace-nowrap">
          {saving ? 'Saving...' : 'Add Note'}
        </button>
      </div>
    </div>
  );
}