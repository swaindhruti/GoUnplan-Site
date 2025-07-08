import { Search, Calendar, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

export const HowItWorksSection = () => {
  return (
    <div className="relative -mt-20">
      {/* Background Image Section */}
      <div className="h-[80vh] relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(https://res.cloudinary.com/dfe8sdlkc/image/upload/v1751841644/freddy-rezvanian-Eelegt4hFNc-unsplash_cplvmo.jpg)`,
          }}
        >
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-28 items-center max-w-6xl mx-auto">
              {/* Left Content */}
              <div className="text-left">
                <div>
                  <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                    HOW IT WORKS
                  </span>
                  <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                    Simple Steps to
                    <br />
                    Adventure
                  </h1>
                </div>
              </div>

              {/* Right Content Card */}
              <Card className="p-8 lg:p-12 bg-white/95 backdrop-blur-sm shadow-2xl transform translate-y-36 relative z-30">
                <div className="space-y-6">
                  {/* Step 1: Search & Discover */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Search className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Search & Discover
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      Browse through our curated collection of unique
                      destinations and experiences tailored to your interests
                      and preferences.
                    </p>
                  </div>

                  {/* Divider Line */}
                  <div className="border-t border-purple-200"></div>

                  {/* Step 2: Plan & Customize */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Plan & Customize
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      Work with our expert team to customize your itinerary,
                      select accommodations, and plan activities that match your
                      style.
                    </p>
                  </div>

                  {/* Divider Line */}
                  <div className="border-t border-purple-200"></div>

                  {/* Step 3: Book & Explore */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Book & Explore
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
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

      {/* Bottom spacing for the protruding card */}
      <div className="h-20 bg-purple-500/[0.1]"></div>
    </div>
  );
};
