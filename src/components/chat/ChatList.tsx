"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { Search, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getUserChats } from "@/actions/chat/actions";
import type { TransformedChat, Role } from "@/types/chats";

interface ChatUser {
  id: string;
  name: string;
  image: string;
  role: Role;
}

interface ChatListProps {
  userId: string;
  onChatSelect: (chatId: string, otherUser: ChatUser) => void;
  initialChats?: TransformedChat[];
}

export default function ChatList({
  userId,
  onChatSelect,
  initialChats = []
}: ChatListProps) {
  const [chats, setChats] = useState<TransformedChat[]>(initialChats);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const refreshChats = () => {
      startTransition(async () => {
        const result = await getUserChats(userId);
        if (result.success) {
          setChats(result.chats ?? []);
        }
      });
    };

    if (initialChats.length === 0) {
      refreshChats();
    }
  }, [userId, initialChats.length]);

  const handleChatSelect = (chat: TransformedChat) => {
    if (chat.otherUser) {
      const chatUser: ChatUser = {
        id: chat.otherUser.id,
        name: chat.otherUser.name || "",
        image: chat.otherUser.image || "",
        role: chat.otherUser.role
      };
      onChatSelect(chat.id, chatUser);
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: string | Date) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffInHours =
      (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });
    } else if (diffInHours < 168) {
      // 7 days
      return messageDate.toLocaleDateString([], { weekday: "short" });
    } else {
      return messageDate.toLocaleDateString([], {
        month: "short",
        day: "numeric"
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
      {/* Header */}
      <div className="px-6 py-4 border-b-4 border-black bg-yellow-50 rounded-t-xl">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Messages
        </h1>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-2 border-black rounded-full font-bold focus:bg-yellow-50 focus:ring-2 focus:ring-blue-500 focus:border-black"
          />
        </div>
      </div>

      {/* Loading indicator */}
      {isPending && (
        <div className="px-6 py-2">
          <div className="bg-blue-50 text-blue-600 text-sm text-center py-2 rounded-lg">
            Refreshing conversations...
          </div>
        </div>
      )}

      {/* Chat List */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-300 scrollbar-track-transparent">
          {filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
              <div className="w-16 h-16 bg-yellow-100 border-4 border-black rounded-full flex items-center justify-center mb-4 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                <MessageCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {searchQuery
                  ? "No conversations found"
                  : "No conversations yet"}
              </h3>
              <p className="text-gray-700 max-w-sm font-medium">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Start a new conversation to see it here"}
              </p>
            </div>
          ) : (
            <div className="divide-y-2 divide-black">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleChatSelect(chat)}
                  className="px-6 py-4 hover:bg-yellow-50 cursor-pointer transition-colors duration-150 ease-in-out group"
                >
                  <div className="flex items-start space-x-4">
                    {/* Avatar with status */}
                    <div className="relative flex-shrink-0">
                      <Image
                        src={
                          chat.otherUser?.image ||
                          "/placeholder.svg?height=48&width=48"
                        }
                        alt={chat.otherUser?.name || "User"}
                        width={48}
                        height={48}
                        className="rounded-full object-cover border-2 border-black group-hover:ring-yellow-300 transition-all"
                      />
                      {chat.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 font-bold border-2 border-black">
                          {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                        </div>
                      )}
                    </div>

                    {/* Chat info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className={`font-semibold truncate ${
                            chat.unreadCount > 0
                              ? "text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {chat.otherUser?.name}
                        </h3>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Badge
                            variant={
                              chat.otherUser?.role === "HOST"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {chat.otherUser?.role}
                          </Badge>
                          {chat.lastMessageAt && (
                            <span className="text-xs text-gray-400">
                              {formatTime(chat.lastMessageAt)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Last message */}
                      {chat.lastMessage?.content && (
                        <p
                          className={`text-sm truncate ${
                            chat.unreadCount > 0
                              ? "text-gray-900 font-medium"
                              : "text-gray-500"
                          }`}
                        >
                          {chat.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export type { ChatUser };
