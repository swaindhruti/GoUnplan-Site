'use client';
import AboutUs from '@/components/landing/AboutUs';
import { FilterAndTrip } from '@/components/landing/FilterAndTrip';
import { FindMyVibe } from '@/components/landing/FindMyVibe';
import { HeroSection } from '@/components/landing/HeroSectiom';
import { ReadyToStart } from '@/components/landing/ReadyToStart';
import { TopDestinations } from '@/components/landing/TopDestinations';
import { WhyUsSection } from '@/components/landing/WhyUs';
import { HowItWorksSection } from '@/components/landing/HowItWorks';
import ReviewSection from '@/components/landing/ReviewSection';
import FAQSection from '@/components/landing/Faqs';
import { TopHosts } from '@/components/landing/TopHosts';
import { SectionJoinerMarquee } from '@/components/landing/common';
import { Footer } from '@/components/landing/Footer';
import { MessageComponent } from '@/components/landing/messageComponent';
import { StickyBanner } from '@/components/landing/StickyBanner';

export default function Home() {
  return (
    <main className="min-h-screen ">
      <MessageComponent />
      <HeroSection />
      <FilterAndTrip />
      <FindMyVibe />
      <TopDestinations />
      <WhyUsSection />
      <SectionJoinerMarquee />
      <HowItWorksSection />
      <ReviewSection />
      <TopHosts />
      <AboutUs />
      <ReadyToStart />
      <FAQSection />
      <StickyBanner />
      <Footer />
    </main>
  );
}
