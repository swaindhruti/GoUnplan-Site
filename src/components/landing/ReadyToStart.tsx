"use client";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

export const ReadyToStart = () => {
  return (
    <div className="relative py-20 sm:py-28 md:py-36">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://res.cloudinary.com/dfe8sdlkc/image/upload/v1751841633/derek-thomson-TWoL-QCZubY-unsplash_2_lpbmix.jpg)"
        }}
      >
        <div className="absolute inset-0 backdrop-blur-md bg-black/30" />
      </div>
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="max-w-3xl w-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl p-6 sm:p-10 md:p-12 rounded-xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-playfair leading-snug sm:leading-tight mb-6 text-white">
            Ready to Start Your
            <br />
            Adventure?
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-white opacity-90 mb-8 font-roboto leading-relaxed">
            Let us help you create the perfect journey. Our travel experts are
            ready to craft your dream vacation.
          </p>

          <Button className="bg-white font-poppins text-purple-600 px-6 py-4 sm:px-8 sm:py-5 rounded-lg font-semibold text-base sm:text-lg md:text-xl hover:bg-purple-50 transition-colors duration-200 flex items-center justify-center gap-2 sm:gap-3 group">
            Start Planning
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
