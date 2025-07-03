import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeroSectionProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const HeroSection = ({
  searchTerm,
  onSearchChange
}: HeroSectionProps) => {
  return (
    <div className="bg-purple-600 border-b-3 border-black text-white py-16 px-8 relative overflow-hidden">
      {/* Reduced set of decorative elements placed away from content */}
      <div className="absolute -left-12 -top-12 w-40 h-40 bg-yellow-300 border-4 border-black rounded-3xl rotate-12 z-0"></div>
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-pink-400 border-3 border-black rounded-full z-0"></div>

      {/* Bottom corner elements that won't interfere with content */}
      <div className="absolute bottom-4 left-16 h-10 w-10 bg-green-500 border-3 border-black rounded-lg rotate-12"></div>
      <div className="absolute bottom-12 right-16 h-8 w-8 bg-blue-400 border-2 border-black rounded-full"></div>

      {/* Single background accent that won't interfere with content */}
      <div className="absolute top-1/4 right-1/6 h-16 w-16 bg-orange-400 border-3 border-black rounded-lg rotate-45 opacity-70"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-wide">
          Discover Amazing Adventures
        </h1>
        <p className="text-xl md:text-2xl mb-10 text-white font-bold">
          Find and book unique travel experiences tailored to your interests
        </p>

        <div className="flex items-center gap-4 max-w-3xl">
          {/* Search icon as separate element */}
          <div className="bg-[#b7c3d0] p-3 rounded-lg border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
            <Search className="h-7 w-7 text-black" strokeWidth={2.5} />
          </div>

          {/* Search input styling */}
          <Input
            placeholder="Search destinations, activities, or experiences..."
            className="py-7 text-lg bg-white border-3 border-black rounded-xl 
            font-bold text-black placeholder:text-gray-600 
            shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]
            focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px]
            transition-all duration-200"
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>
      </div>

      {/* Bottom decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-black"></div>
    </div>
  );
};
