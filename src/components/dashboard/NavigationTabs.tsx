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
  // Define tabs with professional colors
  const tabs = [
    {
      id: "profile",
      label: "PROFILE",
      icon: <User className="w-5 h-5" />,
      color: "bg-slate-700",
    },
    {
      id: "bookings",
      label: "BOOKINGS",
      icon: <Calendar className="w-5 h-5" />,
      color: "bg-slate-700",
    },
    {
      id: "explore",
      label: "EXPLORE",
      icon: <BookOpen className="w-5 h-5" />,
      color: "bg-slate-700",
    },
    {
      id: "messages",
      label: "MESSAGES",
      icon: <MessageSquare className="w-5 h-5" />,
      color: "bg-slate-700",
    },
    {
      id: "reviews",
      label: "REVIEWS",
      icon: <Star className="w-5 h-5" />,
      color: "bg-slate-700",
    },
    {
      id: "settings",
      label: "SETTINGS",
      icon: <Settings className="w-5 h-5" />,
      color: "bg-slate-700",
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative px-6 py-3 font-semibold text-sm uppercase tracking-wider
                rounded-lg transition-all duration-300 flex items-center gap-3
                ${
                  activeTab === tab.id
                    ? `${tab.color} text-white shadow-sm`
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
