import { redirect } from 'next/navigation';
import { getUserChats } from '@/actions/chat/actions';
import ChatContainer from '@/components/chat/ChatContainer';
import { requireUser } from '@/lib/roleGaurd';
// import { getCurrentUser } from "@/lib/auth"; // Your auth function

export default async function ChatPage() {
  const UserSession = await requireUser();

  if (!UserSession.user) {
    redirect('/login');
  }

  const chatsResult = await getUserChats(UserSession.user.id || '');
  const initialChats = chatsResult.success ? chatsResult.chats : [];

  return (
    <div className="h-screen mt-10">
      <ChatContainer currentUserId={UserSession.user.id || ''} initialChats={initialChats} />
    </div>
  );
}
