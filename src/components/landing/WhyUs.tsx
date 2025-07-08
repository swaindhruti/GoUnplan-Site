import { Plane, Mountain, Armchair } from "lucide-react";
import { Card } from "@/components/ui/card";

export const WhyUsSection = () => {
  return (
    <div className="relative">
      {/* Background Image Section */}
      <div className="h-[80vh] relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(https://res.cloudinary.com/dfe8sdlkc/image/upload/v1751841633/derek-thomson-TWoL-QCZubY-unsplash_2_lpbmix.jpg)`,
          }}
        >
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-28 items-center max-w-6xl mx-auto">
              {/* Left Content Card */}
              <Card className="p-8 lg:p-12 bg-white/95 backdrop-blur-sm shadow-2xl transform translate-y-20 relative z-30">
                <div className="space-y-8">
                  {/* Customized Packages */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Plane className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Customized Packages
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      Tailor-made itineraries to suit your preferences and
                      interests, ensuring a unique travel experience every time.
                    </p>
                  </div>

                  {/* Divider Line */}
                  <div className="border-t border-purple-200"></div>

                  {/* Adventure Tours */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Mountain className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Adventure Tours
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      Explore thrilling destinations and activities, from
                      mountain trekking to scuba diving, for the adrenaline
                      seekers.
                    </p>
                  </div>

                  {/* Divider Line */}
                  <div className="border-t border-purple-200"></div>

                  {/* Luxury Vacations */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Armchair className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Luxury Vacations
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      Indulge in opulent accommodations and exclusive
                      experiences, designed for those seeking a lavish escape.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Right Content */}
              <div className="text-left">
                <div>
                  <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                    WHY US
                  </span>
                  <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
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
