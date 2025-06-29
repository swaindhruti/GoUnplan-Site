import { TrendingUp, TrendingDown } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { isUp: boolean; value: string } | null;
  subtitle?: string | null;
  color?: "purple" | "green" | "red" | "blue" | "yellow";
};

export const StatCard = ({
  title,
  value,
  icon,
  trend = null,
  subtitle = null,
  color = "purple",
}: StatCardProps) => {
  const colorClasses = {
    purple: "from-purple-500 to-indigo-600",
    green: "from-green-500 to-emerald-600",
    red: "from-red-500 to-rose-600",
    blue: "from-blue-500 to-sky-600",
    yellow: "from-yellow-500 to-amber-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 rounded-full bg-gradient-to-r ${colorClasses[color]} text-white`}
        >
          {icon}
        </div>
        {trend && (
          <div
            className={`flex items-center text-sm font-medium ${
              trend.isUp ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.isUp ? (
              <TrendingUp size={16} className="mr-1" />
            ) : (
              <TrendingDown size={16} className="mr-1" />
            )}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
      {subtitle && <div className="text-sm text-gray-500 mt-1">{subtitle}</div>}
    </div>
  );
};
