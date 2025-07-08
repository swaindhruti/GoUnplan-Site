"use client";

import AboutUs from "@/components/landing/AboutUs";
import { FilterAndTrip } from "@/components/landing/FilterAndTrip";
import { FindMyVibe } from "@/components/landing/FindMyVibe";
import { HeroSection } from "@/components/landing/HeroSectiom";
import { ReadyToStart } from "@/components/landing/ReadyToStart";
import { WhyUsSection } from "@/components/landing/WhyUs";
import { HowItWorksSection } from "@/components/landing/HowItWorks";
import ReviewSection from "@/components/landing/ReviewSection";
import FAQSection from "@/components/landing/Faqs";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FilterAndTrip />
      <FindMyVibe />
      <ReadyToStart />
      <AboutUs />
      <WhyUsSection />
      <HowItWorksSection />
      <ReviewSection />
      <FAQSection />
    </>
  );
}
