import { Plane, Mountain, Armchair } from "lucide-react";
import { Card } from "@/components/ui/card";

export const WhyUsSection = () => {
  return (
    <div className="relative py-20">
      {/* Background Image Section */}
      <div className="h=full">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(https://res.cloudinary.com/dfe8sdlkc/image/upload/v1751841633/derek-thomson-TWoL-QCZubY-unsplash_2_lpbmix.jpg)`
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-28 items-center max-w-6xl mx-auto">
              {/* Left Content Card */}
              <Card className="p-4 sm:p-6 lg:p-12 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl order-2 lg:order-1 max-w-lg mx-auto lg:mx-0">
                <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                  {/* Customized Packages */}
                  <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-white/30">
                        <Plane className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <h3 className="text-base font-playfair sm:text-lg lg:text-xl font-bold text-white drop-shadow-lg">
                        Customized Packages
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm lg:text-base font-roboto text-white/90 leading-relaxed font-normal drop-shadow-md">
                      Tailor-made itineraries to suit your preferences and
                      interests, ensuring a unique travel experience every time.
                    </p>
                  </div>

                  {/* Divider Line */}
                  <div className="border-t border-white/30"></div>

                  {/* Adventure Tours */}
                  <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-white/30">
                        <Mountain className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <h3 className="text-base font-playfair sm:text-lg lg:text-xl font-bold text-white drop-shadow-lg">
                        Adventure Tours
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm lg:text-base font-roboto text-white/90 leading-relaxed font-normal drop-shadow-md">
                      Explore thrilling destinations and activities, from
                      mountain trekking to scuba diving, for the adrenaline
                      seekers.
                    </p>
                  </div>

                  {/* Divider Line */}
                  <div className="border-t border-white/30"></div>

                  {/* Luxury Vacations */}
                  <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-white/30">
                        <Armchair className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <h3 className="text-base font-playfair sm:text-lg lg:text-xl font-bold text-white drop-shadow-lg">
                        Luxury Vacations
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm lg:text-base font-roboto text-white/90 leading-relaxed font-normal drop-shadow-md">
                      Indulge in opulent accommodations and exclusive
                      experiences, designed for those seeking a lavish escape.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Right Content */}
              <div className="text-center lg:text-left order-1 lg:order-2 px-4">
                <div>
                  <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-white/30 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-bold mb-4 sm:mb-6 border border-white/40 drop-shadow-lg">
                    WHY US
                  </span>
                  <h1 className="text-2xl font-playfair sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-2xl">
                    Crafting
                    <br />
                    Unforgettable
                    <br />
                    Journeys
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
