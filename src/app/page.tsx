// 'use client';
import AboutUs from '@/components/landing/AboutUs';
import { FilterAndTrip } from '@/components/landing/FilterAndTrip';
import { FindMyVibe } from '@/components/landing/FindMyVibe';
import { HeroSection } from '@/components/landing/HeroSectiom';
import { ReadyToStart } from '@/components/landing/ReadyToStart';
// import { TopDestinations } from '@/components/landing/TopDestinations';
import { WhyUsSection } from '@/components/landing/WhyUs';
import { HowItWorksSection } from '@/components/landing/HowItWorks';
import ReviewSection from '@/components/landing/ReviewSection';
// import FAQSection from '@/components/landing/Faqs';
// import { TopHosts } from '@/components/landing/TopHosts';
import { SectionJoinerMarquee } from '@/components/landing/common';
import { Footer } from '@/components/landing/Footer';
import { MessageComponent } from '@/components/landing/messageComponent';
import BecomeAHostPage from '@/components/landing/BecomeHost';
// import { StickyBanner } from '@/components/landing/StickyBanner';
import { getAllActiveTrips } from '@/actions/trips/getAllActiveTrips';
import { Carousels } from '@/components/landing/common';

export default async function Page() {
  const res = await getAllActiveTrips();
  const hosts = Array.isArray(res?.hosts) ? res.hosts : [];
  const tripDestinationWithInfo = res?.TripDestinationWithInfo || [];

  console.log('Hosts on landing page:', hosts);
  console.log('trip: ', tripDestinationWithInfo);

  return (
    <main className="min-h-screen ">
      <MessageComponent />
      <HeroSection />
      <FilterAndTrip tripDestinationWithInfo={tripDestinationWithInfo} />
      <Carousels
        type="hosts"
        SectionTitle="Meet our hosts"
        Description="Local experts"
        hosts={hosts}
      />
      <FindMyVibe />
      {/* <TopDestinations /> */}
      <WhyUsSection />
      <SectionJoinerMarquee />
      <BecomeAHostPage />
      <HowItWorksSection />
      <ReviewSection />

      <AboutUs />
      <ReadyToStart />
      {/* <FAQSection /> */}
      {/* <StickyBanner /> */}
      <Footer />
    </main>
  );
}
