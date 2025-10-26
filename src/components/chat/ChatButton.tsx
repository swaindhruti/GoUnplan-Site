"use client";

import { useTransition } from "react";
import { createOrGetChat } from "@/actions/chat/actions";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";

interface ChatButtonProps {
  currentUserId: string;
  hostId: string;
  travelPlanId: string;
  hostName: string;
  isTripSide?: boolean;
}

export function ChatButton({
  currentUserId,
  hostId,
  travelPlanId,
  hostName,
  isTripSide,
}: ChatButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStartChat = () => {
    startTransition(async () => {
      const result = await createOrGetChat({
        userId: currentUserId,
        hostId,
        travelPlanId,
      });

      if (result.success) {
        router.push(`/chat?chatId=${result.chat?.id}`);
      }
    });
  };

  return (
    <>
      <button
        onClick={handleStartChat}
        disabled={isPending}
        className={`${
          isTripSide
            ? "inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            : "w-full bg-white text-black font-semibold font-montserrat tracking-wider border-2 border-black rounded-lg py-3 px-4 hover:bg-gray-100 transition-all duration-200"
        }`}
      >
        {isTripSide ? (
          <>
            <MessageCircle className="w-5 h-5" />
            <span>{isPending ? "Opening chat..." : "Ask A Question"}</span>
          </>
        ) : (
          `Message Host - ${hostName}`
        )}
      </button>
    </>
  );
}
