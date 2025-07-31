import { Search, Calendar, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

export const HowItWorksSection = () => {
  return (
    <div className="relative h-screen">
      <div className="h-full">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(https://res.cloudinary.com/dfe8sdlkc/image/upload/v1751841644/freddy-rezvanian-Eelegt4hFNc-unsplash_cplvmo.jpg)`
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-28 items-center max-w-6xl mx-auto">
              <div className="text-center lg:text-left order-1 px-4">
                <div>
                  <span className="inline-block px-3  py-1.5 sm:px-4 sm:py-2 bg-white/30 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-bold mb-4 sm:mb-6 border border-white/40 drop-shadow-lg">
                    HOW IT WORKS
                  </span>
                  <h1 className="text-2xl font-bricolage sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-2xl">
                    Simple
                    <br />
                    Steps to
                    <br />
                    Adventure
                  </h1>
                </div>
              </div>
              <Card className="p-4 sm:p-6 lg:p-12 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl order-2 max-w-lg mx-auto lg:mx-0">
                <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                  <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-white/30">
                        <Search className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bricolage lg:text-xl font-bold text-white drop-shadow-lg">
                        Search & Discover
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm  font-instrument lg:text-base text-white/90 leading-relaxed font-medium drop-shadow-md">
                      Browse through our curated collection of unique
                      destinations and experiences tailored to your interests
                      and preferences.
                    </p>
                  </div>
                  <div className="border-t border-white/30"></div>

                  <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-white/30">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <h3 className="text-base font-bricolage sm:text-lg lg:text-xl font-bold text-white drop-shadow-lg">
                        Plan & Customize
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm  font-instrument lg:text-base text-white/90 leading-relaxed font-medium drop-shadow-md">
                      Work with our expert team to customize your itinerary,
                      select accommodations, and plan activities that match your
                      style.
                    </p>
                  </div>
                  <div className="border-t border-white/30"></div>
                  <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-white/30">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <h3 className="text-base  font-bricolage sm:text-lg lg:text-xl font-bold text-white drop-shadow-lg">
                        Book & Explore
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm font-instrument lg:text-base text-white/90 leading-relaxed font-medium drop-shadow-md">
                      Confirm your booking and embark on your unforgettable
                      journey with 24/7 support throughout your adventure.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
