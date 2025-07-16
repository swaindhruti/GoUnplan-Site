import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface PlaceholderTabProps {
  setActiveTab: (tab: string) => void;
}

export function PlaceholderTab({ setActiveTab }: PlaceholderTabProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-slate-50 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Coming Soon
            </h3>
            <p className="text-gray-600 font-medium">
              This feature is under development
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-slate-100 p-6 rounded-2xl mb-6">
          <Settings className="h-12 w-12 text-slate-600" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Under Construction
        </h3>
        <p className="text-gray-600 font-medium text-center max-w-md mb-8">
          We&apos;re working hard to bring you this feature. Please check back
          soon!
        </p>
        <Button
          onClick={() => setActiveTab("profile")}
          className="bg-slate-700 text-white hover:bg-slate-800 font-semibold px-8 py-3 shadow-sm"
        >
          Back to Profile
        </Button>
      </div>
    </div>
  );
}
