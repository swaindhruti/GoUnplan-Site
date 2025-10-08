import { requireSupportOrAdmin } from "@/lib/roleGaurd";
import SupportChatClient from "./SupportChatClient";

interface SupportChatPageProps {
  params: Promise<{
    ticketId: string;
  }>;
}

export default async function SupportChatPage({
  params,
}: SupportChatPageProps) {
  // Use role guard to check authentication and authorization
  await requireSupportOrAdmin();

  // Await the params promise
  const { ticketId } = await params;

  // If we reach here, the user has proper SUPPORT or ADMIN role
  return <SupportChatClient ticketId={ticketId} />;
}
