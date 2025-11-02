'use client';

import { useEffect, useState } from 'react';
import ChatContainer from '@/components/chat/ChatContainer';
import { getUserChats } from '@/actions/chat/actions';
import { TransformedChat } from '@/types/chats';
import { MessageSquare, Send, Users, Clock } from 'lucide-react';

interface MessagesTabProps {
  userId: string;
}

export function MessagesTab({ userId }: MessagesTabProps) {
  const [initialChats, setInitialChats] = useState<TransformedChat[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChats() {
      if (userId) {
        try {
          setLoading(true);
          const chatsResult = await getUserChats(userId);
          if (chatsResult.success) {
            setInitialChats(chatsResult.chats || []);
          } else {
            setError('Failed to load messages');
          }
        } catch (err) {
          console.error('Error fetching chats:', err);
          setError('Failed to load messages');
        } finally {
          setLoading(false);
        }
      }
    }
    fetchChats();
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-bricolage">Messages</h2>
          <p className="text-gray-600 font-instrument mt-1">Communicate with your hosts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-instrument">Active Chats</p>
                <p className="text-2xl font-bold text-gray-900 font-bricolage animate-pulse bg-gray-200 h-8 w-12 rounded mt-1"></p>
              </div>
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-instrument">Unread Messages</p>
                <p className="text-2xl font-bold text-gray-900 font-bricolage animate-pulse bg-gray-200 h-8 w-12 rounded mt-1"></p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Send className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-instrument">Response Time</p>
                <p className="text-2xl font-bold text-gray-900 font-bricolage animate-pulse bg-gray-200 h-8 w-20 rounded mt-1"></p>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-12 text-center">
          <div className="mx-auto h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <MessageSquare className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-gray-600 font-instrument">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-bricolage">Messages</h2>
          <p className="text-gray-600 font-instrument mt-1">Communicate with your hosts</p>
        </div>

        <div className="bg-red-50 rounded-2xl p-12 text-center border border-red-100">
          <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-red-600 font-instrument">{error}</p>
        </div>
      </div>
    );
  }

  const activeChats = initialChats?.length || 0;
  const unreadCount =
    initialChats?.reduce((count, chat) => {
      return count + (chat.unreadCount || 0);
    }, 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 font-bricolage">Messages</h2>
        <p className="text-gray-600 font-instrument mt-1">Communicate with your hosts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-instrument">Active Chats</p>
              <p className="text-2xl font-bold text-gray-900 font-bricolage">{activeChats}</p>
            </div>
            <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-instrument">Unread Messages</p>
              <p className="text-2xl font-bold text-gray-900 font-bricolage">{unreadCount}</p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Send className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-instrument">Response Time</p>
              <p className="text-lg font-bold text-gray-900 font-bricolage">&lt; 1 hour</p>
            </div>
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {initialChats && initialChats.length > 0 ? (
        <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
          <ChatContainer currentUserId={userId} initialChats={initialChats} />
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-200">
          <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 font-bricolage mb-2">
            No messages yet
          </h3>
          <p className="text-gray-600 font-instrument">
            Your conversations with hosts will appear here
          </p>
        </div>
      )}
    </div>
  );
}
