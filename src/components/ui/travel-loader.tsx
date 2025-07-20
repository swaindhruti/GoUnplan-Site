"use client";

import { cn } from "@/lib/utils";

interface TravelLoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function TravelLoader({ size = "md", className }: TravelLoaderProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg
        className={cn("animate-spin", sizeClasses[size])}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Airplane */}
        <g className="origin-center animate-bounce">
          <path
            d="M50 20 L70 40 L50 35 L30 40 Z"
            fill="#8b5cf6"
            className="animate-pulse"
          />
          <path d="M45 35 L55 35 L55 45 L45 45 Z" fill="#7c3aed" />
          <path d="M40 45 L60 45 L55 55 L45 55 Z" fill="#6d28d9" />
        </g>

        {/* Rotating circle */}
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="3"
        />
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="3"
          strokeDasharray="110"
          strokeDashoffset="110"
          className="animate-[spin_2s_linear_infinite]"
          style={{
            strokeLinecap: "round",
          }}
        />
      </svg>
    </div>
  );
}

export function CompassLoader({ size = "md", className }: TravelLoaderProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg
        className={cn(sizeClasses[size])}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Compass outer circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="2"
        />

        {/* Compass inner circle */}
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="3"
          className="animate-pulse"
        />

        {/* North arrow */}
        <path
          d="M50 15 L55 35 L50 30 L45 35 Z"
          fill="#ef4444"
          className="animate-bounce"
        />

        {/* South arrow */}
        <path d="M50 85 L45 65 L50 70 L55 65 Z" fill="#3b82f6" />

        {/* East arrow */}
        <path d="M85 50 L65 55 L70 50 L65 45 Z" fill="#10b981" />

        {/* West arrow */}
        <path d="M15 50 L35 45 L30 50 L35 55 Z" fill="#f59e0b" />

        {/* Center dot */}
        <circle cx="50" cy="50" r="3" fill="#8b5cf6" className="animate-ping" />
      </svg>
    </div>
  );
}

export function MapLoader({ size = "md", className }: TravelLoaderProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg
        className={cn("animate-pulse", sizeClasses[size])}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Map outline */}
        <path
          d="M20 20 L80 20 L80 80 L20 80 Z"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="2"
          className="animate-pulse"
        />

        {/* Map lines */}
        <path d="M20 40 L80 40" stroke="#e2e8f0" strokeWidth="1" />
        <path d="M20 60 L80 60" stroke="#e2e8f0" strokeWidth="1" />
        <path d="M40 20 L40 80" stroke="#e2e8f0" strokeWidth="1" />
        <path d="M60 20 L60 80" stroke="#e2e8f0" strokeWidth="1" />

        {/* Location markers */}
        <circle
          cx="35"
          cy="35"
          r="3"
          fill="#ef4444"
          className="animate-bounce"
        />
        <circle
          cx="65"
          cy="45"
          r="3"
          fill="#10b981"
          className="animate-bounce"
          style={{ animationDelay: "0.2s" }}
        />
        <circle
          cx="45"
          cy="65"
          r="3"
          fill="#f59e0b"
          className="animate-bounce"
          style={{ animationDelay: "0.4s" }}
        />
        <circle
          cx="70"
          cy="70"
          r="3"
          fill="#8b5cf6"
          className="animate-bounce"
          style={{ animationDelay: "0.6s" }}
        />
      </svg>
    </div>
  );
}

export function SuitcaseLoader({ size = "md", className }: TravelLoaderProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg
        className={cn("animate-bounce", sizeClasses[size])}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Suitcase body */}
        <rect
          x="25"
          y="30"
          width="50"
          height="40"
          rx="5"
          fill="#8b5cf6"
          className="animate-pulse"
        />

        {/* Suitcase handle */}
        <rect x="40" y="25" width="20" height="8" rx="4" fill="#7c3aed" />

        {/* Suitcase details */}
        <rect x="30" y="40" width="40" height="2" fill="#6d28d9" />
        <rect x="30" y="50" width="40" height="2" fill="#6d28d9" />
        <rect x="30" y="60" width="40" height="2" fill="#6d28d9" />

        {/* Lock */}
        <circle cx="50" cy="45" r="3" fill="#fbbf24" className="animate-ping" />
      </svg>
    </div>
  );
}

export function MountainLoader({ size = "md", className }: TravelLoaderProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg
        className={cn(sizeClasses[size])}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Mountains */}
        <path
          d="M10 80 L30 40 L50 60 L70 30 L90 80 Z"
          fill="#8b5cf6"
          className="animate-pulse"
        />

        {/* Snow caps */}
        <path
          d="M25 45 L30 40 L35 45 Z"
          fill="white"
          className="animate-ping"
        />
        <path
          d="M65 35 L70 30 L75 35 Z"
          fill="white"
          className="animate-ping"
          style={{ animationDelay: "0.3s" }}
        />

        {/* Sun */}
        <circle
          cx="80"
          cy="20"
          r="8"
          fill="#fbbf24"
          className="animate-spin"
          style={{ animationDuration: "3s" }}
        />

        {/* Clouds */}
        <circle
          cx="20"
          cy="25"
          r="4"
          fill="#e2e8f0"
          className="animate-bounce"
        />
        <circle
          cx="25"
          cy="25"
          r="5"
          fill="#e2e8f0"
          className="animate-bounce"
          style={{ animationDelay: "0.2s" }}
        />
        <circle
          cx="30"
          cy="25"
          r="4"
          fill="#e2e8f0"
          className="animate-bounce"
          style={{ animationDelay: "0.4s" }}
        />
      </svg>
    </div>
  );
}

export function BeachLoader({ size = "md", className }: TravelLoaderProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg
        className={cn(sizeClasses[size])}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ocean waves */}
        <path
          d="M0 70 Q25 60 50 70 Q75 80 100 70 L100 100 L0 100 Z"
          fill="#3b82f6"
          className="animate-pulse"
        />

        {/* Sand */}
        <path
          d="M0 70 Q25 80 50 70 Q75 60 100 70 L100 100 L0 100 Z"
          fill="#fbbf24"
        />

        {/* Sun */}
        <circle
          cx="80"
          cy="20"
          r="10"
          fill="#fbbf24"
          className="animate-spin"
          style={{ animationDuration: "4s" }}
        />

        {/* Palm tree */}
        <rect x="45" y="50" width="10" height="20" fill="#059669" />

        {/* Palm leaves */}
        <path
          d="M50 50 Q40 40 35 45 Q30 50 35 55 Q40 60 50 50"
          fill="#059669"
          className="animate-bounce"
        />
        <path
          d="M50 50 Q60 40 65 45 Q70 50 65 55 Q60 60 50 50"
          fill="#059669"
          className="animate-bounce"
          style={{ animationDelay: "0.2s" }}
        />

        {/* Beach ball */}
        <circle
          cx="20"
          cy="80"
          r="8"
          fill="#ef4444"
          className="animate-bounce"
          style={{ animationDelay: "0.4s" }}
        />
      </svg>
    </div>
  );
}
