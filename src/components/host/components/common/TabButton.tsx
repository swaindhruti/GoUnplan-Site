import React from "react";

type TabButtonProps = {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
};

export const TabButton = ({
  label,
  icon,
  isActive,
  onClick,
}: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
      isActive
        ? "bg-purple-100 text-purple-700 border-b-2 border-purple-600"
        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);
