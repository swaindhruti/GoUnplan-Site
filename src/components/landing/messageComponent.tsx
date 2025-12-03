'use client';
import { getUnreadCount } from '@/actions/chat/actions';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Shrink, RefreshCcw } from 'lucide-react';
import { UnreadcountMessageBox } from './common';
import { useRouter } from 'next/navigation';

export const MessageComponent = () => {
  const session = useSession();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isShrinked, setIsShrinked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUnreadCountMessage = async () => {
      if (!session.data?.user.id) return;

      try {
        setLoading(true);
        const result = await getUnreadCount(session.data.user.id);
        setUnreadCount(result.count || 0);
      } catch (error) {
        console.error('Error fetching unread count:', error);
        setUnreadCount(0);
      } finally {
        setLoading(false);
      }
    };

    getUnreadCountMessage();
  }, [session.data?.user.id]);

  const refreshUnreadCount = async () => {
    if (!session.data?.user.id) return;

    try {
      const result = await getUnreadCount(session.data.user.id);
      setUnreadCount(result.count || 0);
    } catch (error) {
      console.error('Error refreshing unread count:', error);
    }
  };
  const changeShrinkState = () => {
    setIsShrinked(!isShrinked);
  };
  const chats = () => {
    router.push('/chat');
  };
  return (
    <>
      {!isShrinked ? (
        <button
          title="Open messages"
          className="fixed right-10 bottom-20 font-instrument hover:scale-105 hover:-rotate-12 duration-300  bg-white  z-50 p-3  text-black rounded-xl shadow-md  transition-all"
          onClick={changeShrinkState}
        >
          <UnreadcountMessageBox unreadCount={unreadCount} />
        </button>
      ) : (
        <div className="p-6 font-instrument bg-white rounded-lg fixed right-10 bottom-20 z-50 shadow-md max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bricolage tracking-tight font-bold text-gray-800">
              Messages
            </h1>
            <div>
              <button
                onClick={refreshUnreadCount}
                className="text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                title="Refresh unread messages"
              >
                <RefreshCcw size={20} />
              </button>
              <button
                onClick={changeShrinkState}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                title="shrink"
              >
                <Shrink size={20} />
              </button>
            </div>
          </div>

          <div onClick={chats} className="flex items-center cursor-pointer space-x-3">
            <UnreadcountMessageBox unreadCount={unreadCount} />

            <div className="flex-1">
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-bricolage  font-semibold text-gray-800">
                    {unreadCount === 0
                      ? 'No unread messages'
                      : unreadCount === 1
                        ? '1 unread message'
                        : `${unreadCount} unread messages`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {unreadCount > 0 ? 'You have new messages waiting' : "You're all caught up!"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
