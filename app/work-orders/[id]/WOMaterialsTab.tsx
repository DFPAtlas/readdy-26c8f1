'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const DEMO_MATERIALS = [
  { id: 1, name: 'HVAC Fan Bearing 6205-2RS', quantity: 2, unit: 'unit', unit_cost: 45.00, total_cost: 90.00, supplier: 'HVAC Parts Direct', part_number: 'BRG-6205-2RS' },
  { id: 2, name: 'Lubricant Spray 500ml', quantity: 1, unit: 'can', unit_cost: 12.00, total_cost: 12.00, supplier: 'Maintenance Supplies Co', part_number: 'LUB-500' },
];

export default function WOMaterialsTab({ workOrderId }: { workOrderId: number }) {
  const [materials, setMaterials] = useState(DEMO_MATERIALS);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', quantity: '1', unit: 'unit', unit_cost: '', supplier: '', part_number: '' });

  const totalCost = materials.reduce((sum, m) => sum + m.total_cost, 0);

  const handleAdd = async () => {
    if (!form.name) return;
    const qty = parseFloat(form.quantity) || 1;
    const cost = parseFloat(form.unit_cost) || 0;
    const item = { work_order_id: workOrderId, name: form.name, quantity: qty, unit: form.unit, unit_cost: cost, total_cost: qty * cost, supplier: form.supplier, part_number: form.part_number };
    try {
      const { data, error } = await supabase.from('work_order_materials').insert([item]).select().maybeSingle();
      if (!error && data) setMaterials(prev => [...prev, data]);
      else setMaterials(prev => [...prev, { ...item, id: Date.now() }]);
    } catch {
      setMaterials(prev => [...prev, { ...item, id: Date.now() }]);
    }
    setForm({ name: '', quantity: '1', unit: 'unit', unit_cost: '', supplier: '', part_number: '' });
    setShowAdd(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-700">Materials & Parts Used</p>
          <p className="text-xs text-gray-400">Total cost: <span className="font-semibold text-gray-700">£{totalCost.toFixed(2)}</span></p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer transition-colors whitespace-nowrap">
          <i className="ri-add-line"></i> Add Material
        </button>
      </div>

      {showAdd && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="col-span-2">
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Material / Part name *"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <input value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} placeholder="Qty" type="number"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white" />
            <input value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="Unit (unit, m, kg...)"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white" />
            <input value={form.unit_cost} onChange={e => setForm(f => ({ ...f, unit_cost: e.target.value }))} placeholder="Unit cost (£)" type="number"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white" />
            <input value={form.supplier} onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))} placeholder="Supplier"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white" />
            <input value={form.part_number} onChange={e => setForm(f => ({ ...f, part_number: e.target.value }))} placeholder="Part number"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer whitespace-nowrap">Save</button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 cursor-pointer whitespace-nowrap">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Item</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Part No.</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Qty</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Unit Cost</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Supplier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {materials.map(m => (
              <tr key={m.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{m.name}</td>
                <td className="px-4 py-3 text-xs font-mono text-gray-500">{m.part_number || '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{m.quantity} {m.unit}</td>
                <td className="px-4 py-3 text-sm text-gray-600">£{m.unit_cost.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-800">£{m.total_cost.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{m.supplier || '—'}</td>
              </tr>
            ))}
            <tr className="bg-gray-50">
              <td colSpan={4} className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">Total Materials Cost:</td>
              <td className="px-4 py-3 text-sm font-bold text-gray-900">£{totalCost.toFixed(2)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}