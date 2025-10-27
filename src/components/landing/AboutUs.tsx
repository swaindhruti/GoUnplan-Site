"use client";

import Image from "next/image";
import { PrimaryButton, SectionLabel } from "./common";
import { useRouter } from "next/navigation";

export default function AboutUs() {
  const router = useRouter();
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-purple-100 min-h-screen flex flex-col items-center px-6 md:px-20 py-16"
    >
      {/* Section Header */}
      <div
        onClick={() => {
          router.push("/contact");
        }}
        className="w-full text-center mb-12"
      >
        <SectionLabel label="About Us" />
      </div>

      {/* Image + Text Side-by-Side */}
      <div className="flex flex-col lg:flex-row items-center justify-center max-w-6xl w-full gap-10">
        {/* Left Side Image */}
        <div className="w-full lg:w-1/2">
          <Image
            src="https://res.cloudinary.com/dfe8sdlkc/image/upload/v1752733322/hand-drawn-people-with-suitcase-silhouette_rwflee.png"
            alt="About Us Illustration"
            width={600}
            height={600}
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Right Side Text */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bricolage leading-[1.05] tracking-tighter font-extrabold text-gray-800">
           We’re building a new way to <span className="text-purple-600">travel</span>
          </h2>

          <p className="text-base md:text-lg font-instrument text-gray-700 leading-relaxed mt-6">
              We started this because we were tired of cookie-cutter trips.
              Here, travel isn’t about packages, it’s about people.
              A host who shares their world.
              A traveler who finds their tribe.
              And stories that stay long after the trip ends.
 
            <br className="hidden sm:block" />
            {/*  <span className="block mt-4">
              From spontaneous weekend getaways to immersive cultural
              expeditions, we believe travel should go beyond checklists. Our
              team brings years of experience, insider access, and local
              knowledge to design every itinerary with care. We don’t just book
              trips — we design experiences that leave you with stories worth
              telling.
            </span> */}
          </p>

          <div
            onClick={() => router.push("/contact")}
            className="pt-8 max-md:flex max-md:justify-center"
          >
            <PrimaryButton label="Contact Us" />
          </div>
        </div>
      </div>
    </section>
  );
}
