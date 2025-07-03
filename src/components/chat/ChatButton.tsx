"use client";

import { useTransition } from "react";
import { createOrGetChat } from "@/actions/chat/actions";
import { useRouter } from "next/navigation";

interface ChatButtonProps {
  currentUserId: string;
  hostId: string;
  travelPlanId: string;
  hostName: string;
}

export function ChatButton({
  currentUserId,
  hostId,
  travelPlanId,
  hostName
}: ChatButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStartChat = () => {
    startTransition(async () => {
      const result = await createOrGetChat({
        userId: currentUserId,
        hostId,
        travelPlanId
      });

      if (result.success) {
        router.push(`/chat?chatId=${result.chat?.id}`);
      }
    });
  };

  return (
    <button
      onClick={handleStartChat}
      disabled={isPending}
      className="w-full bg-white text-black font-black uppercase tracking-wider
            border-3 border-black rounded-lg py-3 px-4
            hover:bg-gray-100
            transition-all duration-200"
    >
      Message Host-{hostName}
    </button>
  );
}
