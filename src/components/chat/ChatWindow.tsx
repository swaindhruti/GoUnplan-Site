"use client";

import type React from "react";
import {
  useState,
  useEffect,
  useRef,
  useTransition,
  useCallback,
  useMemo
} from "react";
import Image from "next/image";
import { Send, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getChatMessages,
  sendMessage,
  markMessagesAsRead
} from "@/actions/chat/actions";
import type { MessageWithSender, Role } from "@/types/chats";

type IncompleteMessage = Omit<MessageWithSender, "sender"> & {
  sender: {
    id: string;
    name: string;
    image: string | null;
  };
};

interface ChatUser {
  id: string;
  name: string;
  image: string | null;
  role: Role;
}

interface ChatWindowProps {
  chatId: string;
  currentUserId: string;
  otherUser: ChatUser;
  initialMessages?: MessageWithSender[];
}

function transformMessage(msg: IncompleteMessage): MessageWithSender {
  return {
    ...msg,
    sender: {
      ...msg.sender,
      role: "USER" as Role
    }
  };
}

export default function ChatWindow({
  chatId,
  currentUserId,
  otherUser,
  initialMessages = []
}: ChatWindowProps) {
  const [messages, setMessages] =
    useState<MessageWithSender[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [, startTransition] = useTransition();
  const [isSending, setIsSending] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageTimeRef = useRef<Date>(new Date());
  const prevChatIdRef = useRef<string>("");

  const memoizedInitialMessages = useMemo(
    () => initialMessages,
    [initialMessages]
  );

  useEffect(() => {
    if (prevChatIdRef.current !== chatId) {
      setMessages(memoizedInitialMessages);
      setIsInitialized(false);
      prevChatIdRef.current = chatId;
      if (memoizedInitialMessages.length > 0) {
        lastMessageTimeRef.current = new Date(
          memoizedInitialMessages[memoizedInitialMessages.length - 1].createdAt
        );
      }
    }
  }, [chatId, memoizedInitialMessages]);

  const markAsRead = useCallback(() => {
    startTransition(async () => {
      await markMessagesAsRead(chatId, currentUserId);
    });
  }, [chatId, currentUserId]);

  useEffect(() => {
    const loadMessages = () => {
      setLoading(true); // NEO: set loading true
      startTransition(async () => {
        const result = await getChatMessages(chatId);
        if (result.success && result.messages) {
          const incompleteMessages =
            result.messages as unknown as IncompleteMessage[];
          const transformedMessages = incompleteMessages.map(transformMessage);
          setMessages(transformedMessages);
          if (transformedMessages.length > 0) {
            lastMessageTimeRef.current = new Date(
              transformedMessages[transformedMessages.length - 1].createdAt
            );
          }
        }
        setIsInitialized(true);
        setLoading(false); // NEO: set loading false
      });
    };

    if (!isInitialized && memoizedInitialMessages.length === 0) {
      loadMessages();
    } else if (!isInitialized) {
      setIsInitialized(true);
    }

    markAsRead();
  }, [chatId, isInitialized, memoizedInitialMessages.length, markAsRead]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    const messageContent = newMessage.trim();
    setNewMessage("");
    setIsSending(true);

    const optimisticMsg: MessageWithSender = {
      id: `temp-${Date.now()}`,
      chatId,
      senderId: currentUserId,
      receiverId: otherUser.id,
      content: messageContent,
      type: "TEXT",
      isRead: false,
      createdAt: new Date(),
      sender: {
        id: currentUserId,
        name: "You",
        image: null,
        role: "USER"
      }
    };

    setMessages((prev) => [...prev, optimisticMsg]); // Only update messages

    try {
      const result = await sendMessage({
        chatId,
        senderId: currentUserId,
        receiverId: otherUser.id,
        content: messageContent
      });

      if (result.success && result.message) {
        const incompleteMessage =
          result.message as unknown as IncompleteMessage;
        const transformedMessage = transformMessage(incompleteMessage);
        setMessages(
          (prev) =>
            prev
              .filter((m) => m.id !== optimisticMsg.id) // Remove optimistic
              .concat(transformedMessage) // Add real
        );
        lastMessageTimeRef.current = new Date(transformedMessage.createdAt);
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-full bg-white border-4 border-black rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b-4 border-black bg-yellow-50 rounded-t-xl shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Image
              src={otherUser?.image || "/placeholder.svg?height=48&width=48"}
              alt={otherUser.name || "User"}
              width={48}
              height={48}
              className="rounded-full object-cover border-2 border-black"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-black rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-extrabold text-gray-900 truncate">
              {otherUser.name}
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <p className="text-sm text-gray-700 font-bold">Active now</p>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 border-2 border-black rounded-full"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-yellow-300 scrollbar-track-transparent">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-12 h-12 mb-4 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-700 font-bold">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Image
                  src={
                    otherUser?.image || "/placeholder.svg?height=32&width=32"
                  }
                  alt={otherUser.name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Start your conversation
              </h3>
              <p className="text-gray-500 max-w-sm">
                Send a message to {otherUser.name} to get the conversation
                started.
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const isCurrentUser = message.senderId === currentUserId;

              return (
                <div
                  key={message.id}
                  className={`flex items-end space-x-2 ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Avatar/image removed for both users */}

                  <div
                    className={`group max-w-xs lg:max-w-md ${
                      isCurrentUser ? "order-1" : "order-2"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl border-2 ${
                        isCurrentUser
                          ? "bg-blue-600 text-white border-blue-700"
                          : "bg-gray-100 text-gray-900 border-gray-300"
                      } font-bold shadow`}
                    >
                      {message.content}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 text-right">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t-4 border-black bg-yellow-50 px-6 py-4 rounded-b-xl">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message ${otherUser.name}...`}
              className="w-full resize-none border-2 border-black rounded-full px-4 py-3 pr-12 font-bold focus:ring-2 focus:ring-blue-500 focus:border-black"
              disabled={isSending}
              maxLength={1000}
            />
          </div>
          <Button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
