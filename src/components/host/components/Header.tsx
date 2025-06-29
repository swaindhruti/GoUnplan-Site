import { User } from "lucide-react";
import { HostData } from "../types";

type HeaderProps = {
  hostData: HostData;
};

export const Header = ({ hostData }: HeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex justify-between px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage your trips, bookings, and profile
          </p>
        </div>
        <div className="text-2xl gap-2 flex items-center font-bold text-gray-900">
          <User size={30} />
          {hostData.name}
        </div>
      </div>
    </div>
  );
};
