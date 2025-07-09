import {
  ArrowRight,
  Check
  //   ChevronRight,
  //   Star,
  //   Users,
  //   MapPin
  //   Settings
} from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { SectionLabel } from "./common";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-purple-500/[0.1] px-10 py-10 relative overflow-hidden">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          <div className="relative"></div>
          <div className="space-y-5">
            <div className="flex items-center gap-2 rounded-full">
              <SectionLabel label="About Us" />
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl w-[70%] lg:text-5xl font-bold text-gray-900 leading-tight">
                Your Journey, Our Passion
              </h1>
              <p className="text-lg text-gray-600 ">
                We believe that travel is more than just visiting new places;
                it&apos;s about creating memories, experiencing diverse
                cultures, and discovering the wonders of the world. With years
                of experience in the travel industry, our dedicated team is
                committed to providing exceptional travel experiences tailored
                to your unique desires and needs.
              </p>
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Budget-Friendly
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Luxurious Getaways
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Trusted Local Guides
                  </span>{" "}
                </div>
              </div>
              <div>
                <Button
                  className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-6 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  size="lg"
                >
                  Find Packages
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
