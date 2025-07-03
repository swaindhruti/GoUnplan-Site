"use client";

import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  TransformedChat,
  ChatWithLastMessage,
  CreateChatResult,
  ChatUser
} from "@/types/chats";
import ChatWindow from "./ChatWindow";
import { createOrGetChat } from "@/actions/chat/actions";
import ChatList from "./ChatList";

interface ChatContainerProps {
  currentUserId: string;
  initialChats?: TransformedChat[];
  hostId?: string;
  travelPlanId?: string;
}

export default function ChatContainer({
  currentUserId,
  initialChats = [],
  hostId,
  travelPlanId
}: ChatContainerProps) {
  const [selectedChat, setSelectedChat] = useState<{
    chatId: string;
    otherUser: ChatUser;
  } | null>(null);

  const handleChatSelect = (chatId: string, otherUser: ChatUser) => {
    setSelectedChat({ chatId, otherUser });
  };

  const handleStartChat = async () => {
    if (!hostId) return;

    const result: CreateChatResult = await createOrGetChat({
      userId: currentUserId,
      hostId,
      travelPlanId
    });

    if (result.success) {
      const chat: ChatWithLastMessage = result.chat;
      const otherParticipant = chat.participants.find(
        (p) => p.userId !== currentUserId
      );

      if (otherParticipant?.user) {
        const chatUser: ChatUser = {
          id: otherParticipant.user.id,
          name: otherParticipant.user.name,
          image: otherParticipant.user.image,
          role: otherParticipant.user.role
        };

        setSelectedChat({
          chatId: chat.id,
          otherUser: chatUser
        });
      }
    } else {
      console.error("Failed to create chat:", result.error);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-yellow-50 to-white">
      <div className="w-80 flex-shrink-0 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] m-4 flex flex-col">
        {hostId && (
          <div className="p-6 border-b-4 border-black bg-yellow-100 rounded-t-xl">
            <Button
              onClick={handleStartChat}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-bold border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-colors duration-200"
            >
              <MessageSquarePlus className="h-4 w-4 mr-2" />
              Start Chat with Host
            </Button>
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          <ChatList
            userId={currentUserId}
            onChatSelect={handleChatSelect}
            initialChats={initialChats}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden m-4">
        {selectedChat ? (
          <ChatWindow
            chatId={selectedChat.chatId}
            currentUserId={currentUserId}
            otherUser={selectedChat.otherUser}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white border-4 border-black rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <div className="text-center max-w-md mx-auto px-6">
              <div className="w-20 h-20 bg-yellow-100 border-4 border-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                <MessageSquarePlus className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Welcome to Messages
              </h2>
              <p className="text-gray-700 leading-relaxed font-medium">
                Select a conversation from the sidebar to start messaging, or
                create a new chat to begin connecting with others.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
