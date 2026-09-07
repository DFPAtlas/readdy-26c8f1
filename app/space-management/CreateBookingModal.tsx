'use client';

import { useState } from 'react';

interface Space {
  id: string;
  space_id: string;
  name: string;
  type: string;
  floor: string;
  capacity: number;
  features: string[];
}

interface Props {
  spaces: Space[];
  preselectedSpace?: Space | null;
  onClose: () => void;
  onCreated: (booking: any) => void;
}

export default function CreateBookingModal({ spaces, preselectedSpace, onClose, onCreated }: Props) {
  const [step, setStep] = useState(1);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(preselectedSpace || null);
  const [form, setForm] = useState({
    booked_by: '',
    booked_by_email: '',
    department: '',
    booking_date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '10:00',
    purpose: '',
    attendees: 1,
    booking_type: 'single',
    recurrence_pattern: '',
    visitor_name: '',
    visitor_company: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const availableSpaces = spaces.filter(s => s.status === 'available' || s.id === preselectedSpace?.id);

  const handleSubmit = async () => {
    if (!selectedSpace) return;
    setSubmitting(true);
    const ref = 'BK-' + Date.now().toString().slice(-6);
    const booking = {
      id: Date.now().toString(),
      booking_ref: ref,
      space_id: selectedSpace.id,
      space_name: selectedSpace.name,
      space_type: selectedSpace.type,
      floor: selectedSpace.floor,
      ...form,
      status: 'confirmed',
      created_at: new Date().toISOString(),
    };
    await new Promise(r => setTimeout(r, 800));
    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      onCreated(booking);
      onClose();
    }, 1200);
  };

  const typeLabel: Record<string, string> = {
    hot_desk: 'Hot Desk', fixed_desk: 'Fixed Desk', meeting_room: 'Meeting Room',
    boardroom: 'Boardroom', training_room: 'Training Room', parking: 'Parking',
    locker: 'Locker', equipment: 'Equipment',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">New Booking</h2>
            <p className="text-sm text-gray-500 mt-0.5">Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer text-gray-400">
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        <div className="flex gap-0 border-b border-gray-100">
          {['Select Space', 'Booking Details', 'Confirm'].map((s, i) => (
            <div key={s} className={`flex-1 py-3 text-center text-xs font-medium transition-colors ${step === i + 1 ? 'text-blue-600 border-b-2 border-blue-600' : step > i + 1 ? 'text-emerald-600' : 'text-gray-400'}`}>
              {step > i + 1 ? <i className="ri-check-line mr-1"></i> : null}{s}
            </div>
          ))}
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-check-line text-3xl text-emerald-600"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Booking Confirmed!</h3>
              <p className="text-gray-500 text-sm">Your space has been successfully booked.</p>
            </div>
          ) : step === 1 ? (
            <div>
              <p className="text-sm text-gray-600 mb-4">Select an available space to book:</p>
              <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto pr-1">
                {spaces.filter(s => ['available','reserved'].includes(s.status)).map(space => (
                  <div
                    key={space.id}
                    onClick={() => setSelectedSpace(space)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedSpace?.id === space.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-800">{space.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{typeLabel[space.type]} · {space.floor} · Cap: {space.capacity}</div>
                      </div>
                      {selectedSpace?.id === space.id && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <i className="ri-check-line text-white text-xs"></i>
                        </div>
                      )}
                    </div>
                    {space.features?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {space.features.slice(0, 4).map(f => (
                          <span key={f} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{f.replace(/_/g, ' ')}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!selectedSpace}
                className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap transition-colors"
              >
                Continue
              </button>
            </div>
          ) : step === 2 ? (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-3">
                <i className="ri-map-pin-line text-blue-600"></i>
                <div>
                  <div className="text-sm font-semibold text-blue-800">{selectedSpace?.name}</div>
                  <div className="text-xs text-blue-600">{selectedSpace?.floor} · Cap: {selectedSpace?.capacity}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Your Name *</label>
                  <input type="text" value={form.booked_by} onChange={e => setForm({...form, booked_by: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Full name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={form.booked_by_email} onChange={e => setForm({...form, booked_by_email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="email@company.com" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
                  <input type="text" value={form.department} onChange={e => setForm({...form, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Engineering" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Booking Type</label>
                  <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                    {['single','recurring','team','visitor'].map(t => (
                      <button key={t} onClick={() => setForm({...form, booking_type: t})}
                        className={`flex-1 py-1 rounded-md text-xs font-medium cursor-pointer whitespace-nowrap transition-all capitalize ${form.booking_type === t ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date *</label>
                  <input type="date" value={form.booking_date} onChange={e => setForm({...form, booking_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Start Time *</label>
                  <input type="time" value={form.start_time} onChange={e => setForm({...form, start_time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">End Time *</label>
                  <input type="time" value={form.end_time} onChange={e => setForm({...form, end_time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>

              {form.booking_type === 'visitor' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Visitor Name</label>
                    <input type="text" value={form.visitor_name} onChange={e => setForm({...form, visitor_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Visitor Company</label>
                    <input type="text" value={form.visitor_company} onChange={e => setForm({...form, visitor_company: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Purpose</label>
                  <input type="text" value={form.purpose} onChange={e => setForm({...form, purpose: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Meeting purpose..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Attendees</label>
                  <input type="number" min={1} max={selectedSpace?.capacity || 100} value={form.attendees} onChange={e => setForm({...form, attendees: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200 cursor-pointer whitespace-nowrap">Back</button>
                <button onClick={() => setStep(3)} disabled={!form.booked_by}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-40 cursor-pointer whitespace-nowrap">
                  Review Booking
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h3 className="font-semibold text-gray-800 text-sm">Booking Summary</h3>
                {[
                  ['Space', selectedSpace?.name],
                  ['Floor', selectedSpace?.floor],
                  ['Booked By', form.booked_by],
                  ['Department', form.department || '—'],
                  ['Date', new Date(form.booking_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })],
                  ['Time', `${form.start_time} – ${form.end_time}`],
                  ['Purpose', form.purpose || '—'],
                  ['Attendees', form.attendees],
                  ['Type', form.booking_type],
                ].map(([label, value]) => (
                  <div key={label as string} className="flex justify-between text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200 cursor-pointer whitespace-nowrap">Back</button>
                <button onClick={handleSubmit} disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 cursor-pointer whitespace-nowrap flex items-center justify-center gap-2">
                  {submitting ? <><i className="ri-loader-4-line animate-spin"></i> Confirming...</> : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}