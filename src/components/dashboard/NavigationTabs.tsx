import {
  User,
  Calendar,
  MessageSquare,
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
  // Define tabs with clean, simple styling
  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: <User className="w-4 h-4" />,
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: "messages",
      label: "Messages",
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: <Star className="w-4 h-4" />,
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-x-2 py-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative px-4 py-2 font-semibold transition-all duration-300 rounded-lg group
                ${
                  activeTab === tab.id
                    ? "text-purple-600 bg-purple-50"
                    : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                }
                focus:outline-none focus:ring-2 focus:ring-purple-300
              `}
            >
              <div className="flex items-center gap-2 font-instrument">
                {tab.icon}
                <span>{tab.label}</span>
              </div>
              <span 
                className={`
                  absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 
                  bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300 
                  rounded-full
                  ${
                    activeTab === tab.id 
                      ? "w-3/4" 
                      : "group-hover:w-3/4"
                  }
                `}
              />
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
