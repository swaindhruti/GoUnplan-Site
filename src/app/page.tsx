"use client";
import AboutUs from "@/components/landing/AboutUs";
import { FilterAndTrip } from "@/components/landing/FilterAndTrip";
import { FindMyVibe } from "@/components/landing/FindMyVibe";
import { HeroSection } from "@/components/landing/HeroSectiom";
import { ReadyToStart } from "@/components/landing/ReadyToStart";
import { TopDestinations } from "@/components/landing/TopDestinations";
import { WhyUsSection } from "@/components/landing/WhyUs";
import { HowItWorksSection } from "@/components/landing/HowItWorks";
import ReviewSection from "@/components/landing/ReviewSection";
import FAQSection from "@/components/landing/Faqs";
import { TopHosts } from "@/components/landing/TopHosts";

export default function Home() {
  return (
    <main className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth">
      <section
        id="home"
        className="min-h-screen snap-start snap-always flex flex-col"
      >
        <HeroSection />
      </section>
      <section
        id="vibes"
        className="min-h-screen snap-start snap-always flex flex-col"
      >
        <FilterAndTrip />
      </section>
      <section className="min-h-screen snap-start snap-always flex flex-col">
        <FindMyVibe />
      </section>
      <section className="min-h-screen snap-start snap-always flex flex-col">
        <TopDestinations />
      </section>
      <section className="min-h-screen snap-start snap-always flex flex-col">
        <WhyUsSection />
      </section>
      <section className="min-h-screen snap-start snap-always flex flex-col">
        <HowItWorksSection />
      </section>
      <section className="min-h-screen snap-start snap-always flex flex-col">
        <ReviewSection />
      </section>
      <section className="min-h-screen snap-start snap-always flex flex-col">
        <TopHosts />
      </section>
      <section
        id="about"
        className="min-h-screen snap-start snap-always flex flex-col"
      >
        <AboutUs />
      </section>
      <section className="min-h-screen snap-start snap-always flex flex-col">
        <ReadyToStart />
      </section>
      <section className="min-h-screen snap-start snap-always flex flex-col">
        <FAQSection />
      </section>
    </main>
  );
}
