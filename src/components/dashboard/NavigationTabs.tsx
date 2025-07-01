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
  const TabButton = ({
    label,
    icon,
    tabValue,
  }: {
    label: string;
    icon: React.ReactNode;
    tabValue: string;
  }) => (
    <button
      onClick={() => setActiveTab(tabValue)}
      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-extrabold border-3 transition-all ${
        activeTab === tabValue
          ? "bg-yellow-300 text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          : "text-black border-transparent hover:border-black hover:bg-blue-400"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="bg-white border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-4 py-4 overflow-x-auto">
          <TabButton
            label="Profile"
            icon={<User className="w-5 h-5" />}
            tabValue="profile"
          />
          <TabButton
            label="Bookings"
            icon={<Calendar className="w-5 h-5" />}
            tabValue="bookings"
          />
          <TabButton
            label="Explore"
            icon={<BookOpen className="w-5 h-5" />}
            tabValue="explore"
          />
          <TabButton
            label="Messages"
            icon={<MessageSquare className="w-5 h-5" />}
            tabValue="messages"
          />
          <TabButton
            label="Settings"
            icon={<Settings className="w-5 h-5" />}
            tabValue="settings"
          />
          <TabButton
            label="Reviews"
            icon={<Star className="w-5 h-5" />}
            tabValue="reviews"
          />
        </div>
      </div>
    </div>
  );
}
