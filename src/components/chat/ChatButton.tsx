"use client";

import { useTransition } from "react";
import { createOrGetChat } from "@/actions/chat/actions";
import { useRouter } from "next/navigation";

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
  isTripSide
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
    <>
      <button
        onClick={handleStartChat}
        disabled={isPending}
        className={`${
          isTripSide
            ? "text-sm text-blue-600 hover:underline"
            : "w-full bg-white text-black font-semibold font-montserrat tracking-wider border-2 border-black rounded-lg py-3 px-4 hover:bg-gray-100 transition-all duration-200"
        }`}
      >
        {isTripSide ? " Ask A Question" : `Message Host - ${hostName}`}
      </button>
    </>
  );
}
