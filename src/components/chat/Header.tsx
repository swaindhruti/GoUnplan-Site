"use client";

import { useState, useEffect } from "react";
import { getUnreadCount } from "@/actions/chat/actions";
import Link from "next/link";

interface HeaderProps {
  userId?: string;
}

export function Header({ userId }: HeaderProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const fetchUnreadCount = async () => {
      const result = await getUnreadCount(userId);
      if (result.success) {
        setUnreadCount(result?.count || 0);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          TravelApp
        </Link>

        <nav className="flex items-center space-x-6">
          <Link
            href="/travel-plans"
            className="text-gray-700 hover:text-blue-600"
          >
            Travel Plans
          </Link>

          {userId && (
            <Link
              href="/chat"
              className="relative text-gray-700 hover:text-blue-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a9.863 9.863 0 01-4.906-1.294L3 21l1.294-5.094A9.863 9.863 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          )}

          <Link href="/profile" className="text-gray-700 hover:text-blue-600">
            Profile
          </Link>
        </nav>
      </div>
    </header>
  );
}
