import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface PlaceholderTabProps {
  setActiveTab: (tab: string) => void;
}

export function PlaceholderTab({ setActiveTab }: PlaceholderTabProps) {
  return (
    <div className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden">
      <div className="border-b-4 border-black bg-green-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-black uppercase">
              Coming Soon
            </h3>
            <p className="text-sm font-bold text-black">
              This feature is under development
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-yellow-300 border-3 border-black p-4 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
          <Settings className="h-8 w-8 text-black" />
        </div>
        <h3 className="text-2xl font-black text-black mb-2">
          Under Construction
        </h3>
        <p className="text-gray-700 font-bold text-center max-w-md mb-6">
          We&apos;re working hard to bring you this feature. Please check back
          soon!
        </p>
        <Button
          onClick={() => setActiveTab("profile")}
          className="bg-blue-400 text-black hover:bg-blue-500 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all font-extrabold"
        >
          Back to Profile
        </Button>
      </div>
    </div>
  );
}
