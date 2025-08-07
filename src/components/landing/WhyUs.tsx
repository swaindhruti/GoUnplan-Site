import { Search, Calendar, MapPin } from "lucide-react";
import Image from "next/image";

export const WhyUsSection = () => {
  return (
    <div className="relative min-h-screen flex items-stretch bg-gradient-to-l from-purple-100 via-purple-200 to-purple-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-screen">
        {/* Left: Image with overlay */}
        <div className="relative hidden lg:block">
          <Image
            src="https://res.cloudinary.com/dfe8sdlkc/image/upload/v1751841633/derek-thomson-TWoL-QCZubY-unsplash_2_lpbmix.jpg"
            alt="Why us background"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        {/* Right: Solid color with text */}
        <div className="flex items-center justify-center bg-purple-500 px-6 py-16 lg:py-0">
          <div className="max-w-lg w-full text-center lg:text-left">
            <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-white/30 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-bold mb-6 border border-white/40 drop-shadow-lg">
              WHY US
            </span>
            <h1 className="text-2xl font-bricolage sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-medium text-white leading-tight tracking-tight drop-shadow-2xl mb-8">
              Crafting Unforgettable
              <br />
              Journeys
            </h1>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center border border-white/30 mt-1">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bricolage font-normal text-white mb-1">
                    Customized Packages
                  </h3>
                  <p className="text-sm font-instrument text-white/90 leading-relaxed font-medium">
                    Tailor-made itineraries to suit your preferences and
                    interests, ensuring a unique travel experience every time.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center border border-white/30 mt-1">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bricolage font-normal text-white mb-1">
                    Adventure Tours
                  </h3>
                  <p className="text-sm font-instrument text-white/90 leading-relaxed font-medium">
                    Explore thrilling destinations and activities, from mountain
                    trekking to scuba diving, for the adrenaline seekers.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center border border-white/30 mt-1">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bricolage font-normal text-white mb-1">
                    Luxury Vacations
                  </h3>
                  <p className="text-sm font-instrument text-white/90 leading-relaxed font-medium">
                    Indulge in opulent accommodations and exclusive experiences,
                    designed for those seeking a lavish escape.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
