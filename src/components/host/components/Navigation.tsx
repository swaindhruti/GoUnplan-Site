import { TabType } from "../types";
import { Plane, User, Calendar, DollarSign, MessageSquare } from "lucide-react";

type NavigationProps = {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
};

export const Navigation = ({ activeTab, setActiveTab }: NavigationProps) => {
  // Define tabs with neobrutalist colors
  const tabs = [
    {
      id: "trips" as TabType,
      label: "TRIPS",
      icon: <Plane className="w-5 h-5" />,
      color: "bg-yellow-300",
    },
    {
      id: "profile" as TabType,
      label: "PROFILE",
      icon: <User className="w-5 h-5" />,
      color: "bg-blue-400",
    },
    {
      id: "bookings" as TabType,
      label: "BOOKINGS",
      icon: <Calendar className="w-5 h-5" />,
      color: "bg-green-500",
    },
    {
      id: "earnings" as TabType,
      label: "EARNINGS",
      icon: <DollarSign className="w-5 h-5" />,
      color: "bg-pink-500",
    },
    {
      id: "messages" as TabType,
      label: "MESSAGES",
      icon: <MessageSquare className="w-5 h-5" />,
      color: "bg-purple-400",
    },
  ];

  return (
    <div className="bg-purple-600 border-b-3 border-black relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-8 h-6 w-6 bg-yellow-300 border-2 border-black rounded-full -translate-y-1/2"></div>
      <div className="absolute top-1/2 right-8 h-8 w-8 bg-pink-500 border-2 border-black rounded-lg -translate-y-1/2 rotate-12"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
        <div className="flex py-4 space-x-4 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative px-5 py-3 font-extrabold text-sm uppercase tracking-wider
                border-3 border-black rounded-md 
                transition-all duration-150
                flex items-center gap-2
                ${
                  activeTab === tab.id
                    ? `${tab.color} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1`
                    : "bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"
                }
              `}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 border-2 border-black rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom decorative zigzag pattern */}
    </div>
  );
};
