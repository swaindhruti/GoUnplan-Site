"use client";
import Image from "next/image";
import { FindPackagesButton, SectionLabel } from "./common";

export const FindMyVibe = () => {
  const vibes = [
    {
      label: "Cultural",
      src: "https://res.cloudinary.com/dfe8sdlkc/image/upload/v1751841633/derek-thomson-TWoL-QCZubY-unsplash_2_lpbmix.jpg"
    },
    {
      label: "Cultural",
      src: "https://res.cloudinary.com/dfe8sdlkc/image/upload/v1751841644/freddy-rezvanian-Eelegt4hFNc-unsplash_cplvmo.jpg"
    },
    {
      label: "Cultural",
      src: "https://res.cloudinary.com/dfe8sdlkc/image/upload/v1751847044/joshua-earle--87JyMb9ZfU-unsplash_accpod.jpg"
    },
    {
      label: "Cultural",
      src: "https://res.cloudinary.com/dfe8sdlkc/image/upload/v1751841633/derek-thomson-TWoL-QCZubY-unsplash_2_lpbmix.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-purple-500/[0.05]  justify-center px-4 sm:px-6 md:px-10 py-10 md:py-20 flex flex-col lg:flex-row items-center gap-10">
      {/* Left Section */}
      <div className="w-full lg:w-1/4 flex flex-col items-center gap-y-10">
        {/* Text Section */}
        <div className="space-y-4 max-w-md text-center lg:text-left">
          <SectionLabel label="Choose Your Vibe!" />

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-gray-900 leading-tight">
            Popular
            <br />
            <span className="text-gray-800">Vibes</span>
          </h1>

          <p className="text-[15px] sm:text-[16px] mb-8 font-roboto text-gray-600">
            Join us as we explore the wonders of the globe, one incredible
            journey at a time.
          </p>

          <div className="flex justify-center lg:justify-start">
            <FindPackagesButton label="Find Packages" />
          </div>
        </div>

        {/* Featured Image */}
        <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] relative">
          <Image
            src="https://res.cloudinary.com/dfe8sdlkc/image/upload/v1751841644/freddy-rezvanian-Eelegt4hFNc-unsplash_cplvmo.jpg"
            alt="Find My Vibe"
            fill
            className="object-cover rounded-[60px] sm:rounded-[80px] shadow-lg"
          />
          <div className="text-xl sm:text-2xl md:text-3xl font-playfair font-semibold absolute bottom-4 w-full text-center text-white">
            Cultural
          </div>
        </div>
      </div>

      {/* Right Section: Vibe Grid */}
      <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {vibes.map((vibe, index) => (
          <div
            key={index}
            className="relative h-[250px] sm:h-[300px] md:h-[350px] w-full rounded-[60px] sm:rounded-[80px] overflow-hidden shadow-lg"
          >
            <Image
              src={vibe.src}
              alt={vibe.label}
              fill
              className="object-cover"
            />
            <div className="text-xl sm:text-2xl md:text-3xl font-playfair font-semibold absolute bottom-4 w-full text-center text-white">
              {vibe.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
