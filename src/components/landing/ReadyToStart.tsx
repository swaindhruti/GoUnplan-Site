"use client";

import Image from "next/image";
import { PrimaryButton } from "./common";

export const ReadyToStart = () => {
  return (
    <div className="relative py-20 sm:py-28 md:py-36 px-32 bg-white">
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 h-full px-4 sm:px-8 md:px-16">
        {/* Left Text Section */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-playfair leading-snug sm:leading-tight mb-6 text-black">
            Get started
            <br />
            with us
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 font-roboto leading-relaxed">
            Let us help you create the perfect journey. Our travel experts are
            ready to craft your dream vacation.
          </p>

          <PrimaryButton label="Start Planning" />
        </div>

        {/* Right Image Section */}
        <div className="w-full md:w-1/2">
          <Image
            src="https://res.cloudinary.com/dfe8sdlkc/image/upload/v1752687713/44654751_9058421_vdjhyw.svg"
            alt="Adventure illustration"
            className="w-full h-auto max-w-md mx-auto"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
};
