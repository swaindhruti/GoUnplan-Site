"use client";

// import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ChatContainer from "@/components/chat/ChatContainer";
import { getUserChats } from "@/actions/chat/actions";
import { TransformedChat } from "@/types/chats";

export const MessageSection = ({ userSession }: { userSession: string }) => {
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-600">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-0">
      <ChatContainer currentUserId={userId} initialChats={initialChats} />
    </div>
  );
};
