import { Search, Calendar, MapPin } from "lucide-react";

import Image from "next/image";

export const HowItWorksSection = () => {
  return (
    <div className="relative min-h-screen  flex items-stretch">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-screen">
        <div className="relative hidden lg:block bg-purple-200">
          <Image
            src="https://res.cloudinary.com/dfe8sdlkc/image/upload/v1754610239/pexels-rpnickson-2661176_mhopaa.jpg"
            alt="How it works background"
            fill
            className="object-cover object-center scale-80 shadow-lg "
            priority
          />
        </div>
        <div className="flex items-center justify-center bg-purple-200 px-6 py-16 lg:py-0">
          <div className="max-w-lg w-full text-center lg:text-left">
            <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-black/20 rounded-full text-black text-xs sm:text-sm font-bold mb-6 border border-white/30 drop-shadow-lg">
              HOW IT WORKS
            </span>
            <h1 className="text-2xl font-bricolage leading-[1.05] tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-medium text-black  drop-shadow-2xl mb-8">
              Travel, <span className="text-purple-600">Simplified.</span>
            </h1>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center border border-white/30 mt-1">
                  <Search className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-bricolage leading-[1.05] tracking-tighter font-normal text-black mb-1">
                   Explore trips designed by real hosts.
                  </h3>
                   <p className="text-sm font-instrument text-black/90 leading-relaxed font-medium">
                    Browse through our curated collection of unique destinations
                    and experiences tailored to your interests and preferences.
                  </p>
                 
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center border border-white/30 mt-1">
                  <Calendar className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-bricolage leading-[1.05] tracking-tighter font-normal text-black mb-1">
                    Match with people your age who vibe like you.

                  </h3>
                  <p className="text-sm font-instrument text-black/90 leading-relaxed font-medium">
                    Work with our expert team to customize your itinerary,
                    select accommodations, and plan activities that match your
                    style.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center border border-white/30 mt-1">
                  <MapPin className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-bricolage leading-[1.05] tracking-tighter font-normal text-black mb-1">
                   Go. Experience. Belong.
                  </h3>
                  <p className="text-sm font-instrument text-black/90 leading-relaxed font-medium">
                    Confirm your booking and embark on your unforgettable
                    journey with 24/7 support throughout your adventure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right: Image with overlay */}
      </div>
    </div>
  );
};
