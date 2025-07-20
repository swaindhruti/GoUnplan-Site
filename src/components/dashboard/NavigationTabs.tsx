import {
  User,
  Calendar,
  BookOpen,
  MessageSquare,
  Settings,
  Star,
} from "lucide-react";

interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function NavigationTabs({
  activeTab,
  setActiveTab,
}: NavigationTabsProps) {
  // Define tabs with sophisticated styling and descriptions
  const tabs = [
    {
      id: "profile",
      label: "PROFILE",
      icon: <User className="w-5 h-5" />,
      description: "Personal Settings",
    },
    {
      id: "bookings",
      label: "BOOKINGS",
      icon: <Calendar className="w-5 h-5" />,
      description: "Travel History",
    },
    {
      id: "explore",
      label: "EXPLORE",
      icon: <BookOpen className="w-5 h-5" />,
      description: "Discover Trips",
    },
    {
      id: "messages",
      label: "MESSAGES",
      icon: <MessageSquare className="w-5 h-5" />,
      description: "Communication",
    },
    {
      id: "reviews",
      label: "REVIEWS",
      icon: <Star className="w-5 h-5" />,
      description: "Your Feedback",
    },
    {
      id: "settings",
      label: "SETTINGS",
      icon: <Settings className="w-5 h-5" />,
      description: "Preferences",
    },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-3 overflow-x-auto overflow-y-hidden scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative group px-8 py-6 font-semibold text-sm uppercase tracking-wider
                rounded-xl transition-all duration-300 flex flex-col items-center gap-3 min-w-[140px] flex-shrink-0
                ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 scale-105"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:scale-102"
                }
              `}
            >
              <div
                className={`
                p-3 rounded-lg transition-all duration-300 flex-shrink-0
                ${
                  activeTab === tab.id
                    ? "bg-white/20"
                    : "bg-slate-100 group-hover:bg-slate-200"
                }
              `}
              >
                {tab.icon}
              </div>
              <div className="text-center space-y-1 flex-shrink-0">
                <div className="font-semibold text-sm whitespace-nowrap">
                  {tab.label}
                </div>
                <div
                  className={`text-xs font-medium whitespace-nowrap ${
                    activeTab === tab.id ? "text-white/80" : "text-slate-500"
                  }`}
                >
                  {tab.description}
                </div>
              </div>
              {activeTab === tab.id && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
