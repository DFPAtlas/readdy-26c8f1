'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { getRoleDashboard } from '@/lib/auth';
import type { UserRole } from '@/lib/auth';
import LandingNav from './landing/LandingNav';
import HeroSection from './landing/HeroSection';
import PlatformOverview from './landing/PlatformOverview';
import FeaturesSection from './landing/FeaturesSection';
import DigitalTwinSection from './landing/DigitalTwinSection';
import PricingSection from './landing/PricingSection';
import ContactSection from './landing/ContactSection';
import LandingFooter from './landing/LandingFooter';

export default function RootPage() {
  const { session, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (session && profile) {
      router.push(getRoleDashboard(profile.role as UserRole));
    }
  }, [session, profile, loading, router]);

  return (
    <main className="bg-[#030912]">
      <LandingNav />
      <HeroSection />
      <PlatformOverview />
      <FeaturesSection />
      <DigitalTwinSection />
      <PricingSection />
      <ContactSection />
      <LandingFooter />
    </main>
  );
}