"use client";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

export const ReadyToStart = () => {
  return (
    <div className="relative py-36">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://res.cloudinary.com/dfe8sdlkc/image/upload/v1751841633/derek-thomson-TWoL-QCZubY-unsplash_2_lpbmix.jpg)"
        }}
      >
        {/* Blurred Overlay */}
        <div className="absolute inset-0 backdrop-blur-md" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="container mx-auto px-8">
          <div className="text-white max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl p-10 rounded-xl">
            <h1 className="text-6xl font-bold leading-tight mb-6">
              Ready to Start Your
              <br />
              Adventure?
            </h1>

            <p className="text-xl mb-8 leading-relaxed opacity-90">
              Let us help you create the perfect journey. Our travel experts are
              ready to craft your dream vacation.
            </p>

            <Button className="bg-white text-purple-600 px-8 py-8 rounded-lg font-semibold text-xl hover:bg-purple-50 transition-colors duration-200 flex items-center gap-3 group">
              Start Planning
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
