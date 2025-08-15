"use client";

// import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ChatContainer from "@/components/chat/ChatContainer";
import { getUserChats } from "@/actions/chat/actions";
import { TransformedChat } from "@/types/chats";
import { MessageSquare } from "lucide-react";

export const MessageSection = ({
  userSession,
  host
}: {
  userSession: string;
  host?: boolean;
}) => {
  const [initialChats, setInitialChats] = useState<TransformedChat[]>();
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    async function fetchChats() {
      if (userSession) {
        setUserId(userSession);
        const chatsResult = await getUserChats(userSession);
        setInitialChats(chatsResult.success ? chatsResult.chats : []);
      }
    }
    fetchChats();
  }, [userSession]);

  if (!userId) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-bricolage">Messages</h2>
          <p className="text-gray-600 font-instrument mt-1">
            Communicate with your guests and travelers
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="mx-auto h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <MessageSquare className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-gray-600 font-instrument">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 font-bricolage">Messages</h2>
        <p className="text-gray-600 font-instrument mt-1">
          Communicate with your{host ? " guests and travelers" : " host"}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <ChatContainer currentUserId={userId} initialChats={initialChats} />
      </div>
    </div>
  );
};
