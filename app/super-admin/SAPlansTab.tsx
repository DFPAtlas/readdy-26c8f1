'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_monthly: number;
  price_annual: number;
  max_users: number;
  max_assets: number;
  max_sites: number;
  features: string[];
  is_active: boolean;
}

export default function SAPlansTab() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Plan | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    const { data } = await supabase.from('plans').select('*').order('sort_order');
    setPlans(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!editing) return;
    await supabase.from('plans').update({
      price_monthly: editing.price_monthly,
      price_annual: editing.price_annual,
      max_users: editing.max_users,
      max_assets: editing.max_assets,
      max_sites: editing.max_sites,
      is_active: editing.is_active,
    }).eq('id', editing.id);
    setEditing(null);
    loadPlans();
  };

  const planGradients: Record<string, string> = {
    starter: 'from-gray-500/20 to-gray-600/20 border-gray-500/30',
    professional: 'from-cyan-500/20 to-blue-600/20 border-cyan-500/30',
    enterprise: 'from-violet-500/20 to-purple-600/20 border-violet-500/30',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white font-semibold">Pricing Plans</h3>
          <p className="text-gray-500 text-sm">Manage subscription tiers and pricing</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div key={plan.id} className={`bg-gradient-to-br ${planGradients[plan.slug] || planGradients.starter} border rounded-2xl p-6`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">{plan.name}</h3>
                  <p className="text-gray-400 text-xs mt-0.5">{plan.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${plan.is_active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-500/20 text-gray-400'}`}>
                    {plan.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-3xl font-black text-white">£{plan.price_monthly}<span className="text-gray-400 text-sm font-normal">/mo</span></div>
                <div className="text-gray-400 text-xs mt-0.5">£{plan.price_annual}/mo billed annually</div>
              </div>

              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Max Users</span>
                  <span className="text-white font-medium">{plan.max_users === 999 ? 'Unlimited' : plan.max_users}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Max Assets</span>
                  <span className="text-white font-medium">{plan.max_assets === 99999 ? 'Unlimited' : plan.max_assets}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Max Sites</span>
                  <span className="text-white font-medium">{plan.max_sites === 999 ? 'Unlimited' : plan.max_sites}</span>
                </div>
              </div>

              <ul className="space-y-1.5 mb-5">
                {(plan.features || []).slice(0, 4).map((f) => (
                  <li key={f} className="flex items-center space-x-2 text-xs text-gray-300">
                    <i className="ri-check-line text-cyan-400 flex-shrink-0"></i>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setEditing({ ...plan })}
                className="w-full py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-sm cursor-pointer whitespace-nowrap transition-all"
              >
                Edit Plan
              </button>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditing(null)}></div>
          <div className="relative bg-[#0a1628] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-white font-bold text-lg mb-4">Edit {editing.name} Plan</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Monthly Price (£)</label>
                  <input type="number" value={editing.price_monthly} onChange={(e) => setEditing({ ...editing, price_monthly: Number(e.target.value) })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500/50" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Annual Price (£/mo)</label>
                  <input type="number" value={editing.price_annual} onChange={(e) => setEditing({ ...editing, price_annual: Number(e.target.value) })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500/50" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Max Users</label>
                  <input type="number" value={editing.max_users} onChange={(e) => setEditing({ ...editing, max_users: Number(e.target.value) })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500/50" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Max Assets</label>
                  <input type="number" value={editing.max_assets} onChange={(e) => setEditing({ ...editing, max_assets: Number(e.target.value) })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500/50" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Max Sites</label>
                  <input type="number" value={editing.max_sites} onChange={(e) => setEditing({ ...editing, max_sites: Number(e.target.value) })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500/50" />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <label className="text-sm text-gray-300">Active</label>
                <button onClick={() => setEditing({ ...editing, is_active: !editing.is_active })} className={`w-10 h-5 rounded-full transition-all cursor-pointer ${editing.is_active ? 'bg-cyan-500' : 'bg-gray-600'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-all mx-0.5 ${editing.is_active ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </button>
              </div>
              <div className="flex space-x-3 pt-2">
                <button onClick={() => setEditing(null)} className="flex-1 py-2.5 border border-white/10 text-gray-400 rounded-xl text-sm cursor-pointer whitespace-nowrap">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-medium cursor-pointer whitespace-nowrap">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}