"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

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
    <>
      <div className="min-h-screen bg-purple-500/[0.03] px-10 py-20 gap-6 flex justify-center items-center">
        <div className="w-1/4 flex flex-col items-center justify-center gap-y-5">
          <div className="h-[50vh]">
            <div className="space-y-12">
              <div className="space-y-5">
                <div className="inline-flex items-center px-6 py-4 bg-purple-100 rounded-full">
                  <span className="text-purple-600 text-lg font-semibold tracking-wide uppercase">
                    Choose Your Vibe!
                  </span>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Popular
                  <br />
                  <span className="text-gray-800">Vibes</span>
                </h1>

                <p className="text-[16px] text-gray-600 max-w-md">
                  Join us as we explore the wonders of the globe, one incredible
                  journey at a time.
                </p>
              </div>

              <Button
                className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-6 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                size="lg"
              >
                Find Packages
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="h-[60vh] w-full relative ">
            <Image
              src="https://res.cloudinary.com/dfe8sdlkc/image/upload/v1751841644/freddy-rezvanian-Eelegt4hFNc-unsplash_cplvmo.jpg"
              alt="Find My Vibe"
              fill
              className="object-cover rounded-[90px] shadow-lg"
            />
            <div className="text-3xl font-semibold absolute bottom-6 flex justify-center w-full font-mono tracking-tighter  text-white">
              Cultural
            </div>
          </div>
        </div>
        <div className="w-1/2 flex flex-wrap items-center gap-6 p-0  ">
          {vibes.map((vibe, index) => (
            <div
              key={index}
              className="h-[55vh] w-[48%] rounded-[90px] relative"
            >
              <Image
                src={vibe.src}
                alt={vibe.label}
                fill
                className="object-cover rounded-[90px] shadow-lg "
              />
              <div className="text-3xl font-semibold absolute bottom-6 flex justify-center w-full font-mono tracking-tighter  text-white">
                {vibe.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
