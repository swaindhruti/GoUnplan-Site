"use client";

import { FilterAndTrip } from "@/components/landing/FilterAndTrip";
import { FindMyVibe } from "@/components/landing/FindMyVibe";
import { HeroSection } from "@/components/landing/HeroSectiom";
import { ReadyToStart } from "@/components/landing/ReadyToStart";
// import { ReadyToStart } from "@/components/landing/ReadyTostart";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FilterAndTrip />
      <FindMyVibe />
      <ReadyToStart />
    </>
  );
}
