"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PrimaryButton, SectionLabel } from "./common";

const vibeDescriptions: Record<string, string> = {
  Cultural:
    "Immerse yourself in local traditions, art, and history for a truly authentic experience.",
  Adventure: "Thrilling activities and wild landscapes for adrenaline seekers.",
  Relaxation: "Unwind in serene destinations designed for peace and comfort.",
  Nature: "Explore breathtaking natural wonders and scenic escapes.",
};

export const FindMyVibe = () => {
  const router = useRouter();

  const vibes = [
    {
      label: "Cultural",
      src: "https://res.cloudinary.com/dz4b2cmjo/image/upload/v1752791020/pexels-emre-simsek-27565013-33041565_uqwqch.jpg",
    },
    {
      label: "Adventure",
      src: "https://res.cloudinary.com/dz4b2cmjo/image/upload/v1752791121/pexels-marius-mann-772581-33021041_fvxvqj.jpg",
    },
    {
      label: "Relaxation",
      src: "https://res.cloudinary.com/dz4b2cmjo/image/upload/v1752791236/pexels-kubra-ercan-2154019843-33019785_qdfrky.jpg",
    },
    {
      label: "Nature",
      src: "https://res.cloudinary.com/dz4b2cmjo/image/upload/v1752791316/pexels-ishahidsultan-33048368_vwox3l.jpg",
    },
  ];

  const handleVibeClick = (vibeLabel: string) => {
    router.push(`/trips?vibe=${encodeURIComponent(vibeLabel)}`);
  };

  return (
    <div
      id="vibes"
      className="min-h-screen bg-purple-500/[0.05] justify-center px-4 sm:px-6 md:px-10 py-10 md:py-20 flex flex-col lg:flex-row items-center gap-16"
    >
      <div className="w-full lg:w-1/4 flex flex-col items-center gap-y-16">
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
            <PrimaryButton label="Find Packages" />
          </div>
        </div>
        <div
          onClick={() => handleVibeClick("Adventure")}
          className="w-full h-[300px] cursor-pointer sm:h-[350px] md:h-[400px] relative group"
        >
          <Image
            src="https://res.cloudinary.com/dfe8sdlkc/image/upload/v1751841644/freddy-rezvanian-Eelegt4hFNc-unsplash_cplvmo.jpg"
            alt="Adventure"
            fill
            className="object-cover rounded-[60px] sm:rounded-[80px] shadow-lg"
          />
          <div className="absolute inset-0 rounded-[60px] sm:rounded-[80px] bg-black/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center px-6">
            <div className="text-2xl sm:text-3xl md:text-4xl font-playfair font-semibold text-white mb-2">
              Adventure
            </div>
            <div className="text-base sm:text-lg text-white/90 font-roboto text-center">
              {vibeDescriptions["Adventure"]}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-16">
        {vibes.map((vibe, index) => (
          <div
            key={index}
            onClick={() => handleVibeClick(vibe.label)}
            className="relative h-[250px] sm:h-[300px] md:h-[350px] w-full rounded-[60px] sm:rounded-[80px] overflow-hidden shadow-lg cursor-pointer hover:scale-[102%] duration-300 transition-transform group"
          >
            <Image
              src={vibe.src}
              alt={vibe.label}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 rounded-[60px] sm:rounded-[80px] bg-black/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center px-6">
              <div className="text-2xl sm:text-3xl md:text-4xl font-playfair font-semibold text-white mb-2">
                {vibe.label}
              </div>
              <div className="text-base sm:text-lg text-white/90 font-roboto text-center">
                {vibeDescriptions[vibe.label]}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
