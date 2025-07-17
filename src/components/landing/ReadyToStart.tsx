"use client";

import Image from "next/image";
import { PrimaryButton } from "./common";

export const ReadyToStart = () => {
  return (
    <div className="relative py-12 sm:py-16 md:py-20 lg:py-28 xl:py-36 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-white">
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-16 xl:gap-20 max-w-7xl mx-auto">
        {/* Left Text Section */}
        <div className="w-full lg:w-1/2 text-center lg:text-left order-2 lg:order-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-playfair leading-tight sm:leading-snug lg:leading-tight mb-4 sm:mb-6 text-black">
            Get started
            <br />
            with us
          </h1>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mb-6 sm:mb-8 font-roboto leading-relaxed max-w-lg lg:max-w-none mx-auto lg:mx-0">
            Let us help you create the perfect journey. Our travel experts are
            ready to craft your dream vacation.
          </p>

          <div className="flex justify-center lg:justify-start">
            <PrimaryButton label="Start Planning" />
          </div>
        </div>

        {/* Right Image Section */}
        <div className="w-full lg:w-1/2 order-1 lg:order-2 flex justify-center lg:justify-end">
          <Image
            src="https://res.cloudinary.com/dfe8sdlkc/image/upload/v1752687713/44654751_9058421_vdjhyw.svg"
            alt="Adventure illustration"
            className="w-full h-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
            width={500}
            height={500}
            priority
          />
        </div>
      </div>
    </div>
  );
};
