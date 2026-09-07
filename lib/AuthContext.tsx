'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from './supabase';
import { getUserProfile, getCompany, UserProfile, Company } from './auth';
import type { Session, User } from '@supabase/supabase-js';
import { getSubscriptionLimits, SubscriptionLimits } from './subscription-limits';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  company: Company | null;
  limits: SubscriptionLimits | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  refreshLimits: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  company: null,
  limits: null,
  loading: true,
  refreshProfile: async () => {},
  refreshLimits: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [limits, setLimits] = useState<SubscriptionLimits | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId: string) => {
    const p = await getUserProfile(userId);
    setProfile(p);
    if (p?.company_id) {
      const c = await getCompany(p.company_id);
      setCompany(c);
      const l = await getSubscriptionLimits(p.company_id);
      setLimits(l);
    }
  };

  const refreshProfile = async () => {
    if (user) await loadProfile(user.id);
  };

  const refreshLimits = async () => {
    if (profile?.company_id) {
      const l = await getSubscriptionLimits(profile.company_id);
      setLimits(l);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 5000);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id).finally(() => {
          clearTimeout(timeout);
          setLoading(false);
        });
      } else {
        clearTimeout(timeout);
        setLoading(false);
      }
    }).catch(() => {
      clearTimeout(timeout);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setCompany(null);
      }
    });

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, profile, company, limits, loading, refreshProfile, refreshLimits }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}