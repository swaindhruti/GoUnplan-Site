'use server';

import prisma from '@/lib/prisma';
import { CreateChatResult } from '@/types/chats';
import { revalidatePath } from 'next/cache';
import { sendEmailAction } from '@/actions/email/action';

interface CreateChatParams {
  userId: string;
  hostId: string;
  travelPlanId?: string;
}

interface SendMessageParams {
  chatId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type?: 'TEXT' | 'FILE' | 'IMAGE';
}

export async function createOrGetChat({
  userId,
  hostId,
  travelPlanId,
}: CreateChatParams): Promise<CreateChatResult> {
  try {
    const existingChat = await prisma.chat.findFirst({
      where: {
        participants: {
          some: {
            userId: userId,
          },
        },
        AND: {
          participants: {
            some: {
              userId: hostId,
            },
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                role: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
                role: true,
              },
            },
            receiver: {
              select: {
                id: true,
                name: true,
                image: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (existingChat) {
      return {
        success: true as const,
        chat: {
          ...existingChat,
          lastMessageAt: existingChat.lastMessageAt ?? existingChat.messages[0]?.createdAt ?? null, // ✅ Fix: coalesce to null, not undefined
        },
      };
    }

    const newChat = await prisma.chat.create({
      data: {
        travelPlanId,
        participants: {
          create: [{ userId }, { userId: hostId }],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
                role: true,
              },
            },
            receiver: {
              select: {
                id: true,
                name: true,
                image: true,
                role: true,
              },
            },
          },
        },
      },
    });

    // Send email notification to host about the new chat
    try {
      const hostUser = newChat.participants.find(
        (p: { userId: string }) => p.userId === hostId
      )?.user;
      const initiatingUser = newChat.participants.find(
        (p: { userId: string }) => p.userId === userId
      )?.user;

      if (hostUser?.email && initiatingUser?.name) {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const chatUrl = `${baseUrl}/chat?chatId=${newChat.id}`;

        // Fetch travel plan details if travelPlanId exists
        let tripTitle: string | undefined;
        if (newChat.travelPlanId) {
          const travelPlan = await prisma.travelPlans.findUnique({
            where: { travelPlanId: newChat.travelPlanId },
            select: { title: true },
          });
          tripTitle = travelPlan?.title;
        }

        await sendEmailAction({
          to: hostUser.email,
          type: 'new_chat_message',
          payload: {
            hostName: hostUser.name || 'Host',
            userName: initiatingUser.name,
            tripTitle,
            chatUrl,
          },
        });
      }
    } catch (emailError) {
      // Log email error but don't fail the chat creation
      console.error('Failed to send new chat notification email:', emailError);
    }

    return {
      success: true as const,
      chat: {
        ...newChat,
        lastMessageAt: null,
      },
    };
  } catch (error) {
    console.error('Error creating/getting chat:', error);
    return {
      success: false as const,
      error: 'Failed to create chat',
    };
  }
}

// Send a message
export async function sendMessage({
  chatId,
  senderId,
  receiverId,
  content,
  type = 'TEXT',
}: SendMessageParams) {
  try {
    // Check if this is the first message in the chat
    const messageCount = await prisma.message.count({
      where: { chatId },
    });

    const isFirstMessage = messageCount === 0;

    const message = await prisma.message.create({
      data: {
        chatId,
        senderId,
        receiverId,
        content,
        type,
      },
      include: {
        sender: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    // Update chat's lastMessageAt
    await prisma.chat.update({
      where: { id: chatId },
      data: { lastMessageAt: new Date() },
    });

    // Send email notification to receiver if this is the first message
    if (isFirstMessage) {
      try {
        // Fetch receiver details
        const receiver = await prisma.user.findUnique({
          where: { id: receiverId },
          select: { name: true, email: true },
        });

        if (receiver?.email && message.sender.name) {
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
          const chatUrl = `${baseUrl}/chat?chatId=${chatId}`;

          // Fetch chat and travel plan details
          const chat = await prisma.chat.findUnique({
            where: { id: chatId },
            select: { travelPlanId: true },
          });

          let tripTitle: string | undefined;
          if (chat?.travelPlanId) {
            const travelPlan = await prisma.travelPlans.findUnique({
              where: { travelPlanId: chat.travelPlanId },
              select: { title: true },
            });
            tripTitle = travelPlan?.title;
          }

          await sendEmailAction({
            to: receiver.email,
            type: 'new_chat_message',
            payload: {
              hostName: receiver.name || 'Host',
              userName: message.sender.name,
              tripTitle,
              chatUrl,
            },
          });
        }
      } catch (emailError) {
        // Log email error but don't fail the message send
        console.error('Failed to send new message notification email:', emailError);
      }
    }

    revalidatePath('/chat');
    return { success: true, message };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error: 'Failed to send message' };
  }
}

// Get messages for a chat (paginated)
export async function getChatMessages(chatId: string, page = 1, limit = 20) {
  try {
    const skip = (page - 1) * limit;

    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        sender: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return { success: true, messages: messages.reverse() };
  } catch (error) {
    console.error('Error fetching messages:', error);
    return { success: false, error: 'Failed to fetch messages' };
  }
}

export async function getUserChats(userId: string) {
  try {
    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, name: true, image: true, role: true },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: { id: true, name: true, image: true, role: true },
            },
            receiver: {
              select: { id: true, name: true, image: true, role: true },
            },
          },
        },
        _count: {
          select: {
            messages: {
              where: {
                receiverId: userId,
                isRead: false,
              },
            },
          },
        },
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
    });

    const transformedChats = chats.map(chat => {
      const otherParticipant = chat.participants.find(p => p.userId !== userId);

      const lastMessage = chat.messages[0];

      return {
        id: chat.id,
        otherUser: otherParticipant?.user,
        lastMessage: lastMessage
          ? {
              id: lastMessage.id,
              chatId: lastMessage.chatId,
              senderId: lastMessage.senderId,
              receiverId: lastMessage.receiverId,
              content: lastMessage.content,
              type: lastMessage.type,
              isRead: lastMessage.isRead,
              createdAt: lastMessage.createdAt,
              sender: lastMessage.sender,
              receiver: lastMessage.receiver,
            }
          : undefined,
        unreadCount: chat._count.messages,
        lastMessageAt: chat.lastMessageAt,
      };
    });

    return { success: true, chats: transformedChats };
  } catch (error) {
    console.error('Error fetching chats:', error);
    return { success: false, error: 'Failed to fetch chats' };
  }
}

// Real-time message polling (lightweight)
export async function pollMessages(chatId: string, lastMessageId?: string) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        chatId,
        ...(lastMessageId && {
          id: { gt: lastMessageId },
        }),
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return { success: true, messages };
  } catch (error) {
    console.error('Error polling messages:', error);
    return { success: false, error: 'Failed to poll messages' };
  }
}

// Batch mark multiple chats as read
export async function batchMarkAsRead(userId: string, chatIds: string[]) {
  try {
    await prisma.message.updateMany({
      where: {
        chatId: { in: chatIds },
        receiverId: userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    await prisma.chatParticipant.updateMany({
      where: {
        chatId: { in: chatIds },
        userId,
      },
      data: { lastReadAt: new Date() },
    });

    return { success: true };
  } catch (error) {
    console.error('Error batch marking as read:', error);
    return { success: false, error: 'Failed to mark messages as read' };
  }
}

// Mark messages as read
export async function markMessagesAsRead(chatId: string, userId: string) {
  try {
    await prisma.message.updateMany({
      where: {
        chatId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    // Update participant's lastReadAt
    await prisma.chatParticipant.updateMany({
      where: {
        chatId,
        userId,
      },
      data: {
        lastReadAt: new Date(),
      },
    });

    revalidatePath('/chat');
    return { success: true };
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return { success: false, error: 'Failed to mark messages as read' };
  }
}

export async function getUnreadCount(userId: string) {
  try {
    const unreadCount = await prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });

    return { success: true, count: unreadCount };
  } catch (error) {
    console.error('Error getting unread count:', error);
    return { success: false, error: 'Failed to get unread count' };
  }
}

// Search chats by user name
export async function searchChats(userId: string, query: string) {
  try {
    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, name: true, image: true, role: true },
            },
          },
          where: {
            user: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
        },
      },
    });

    return { success: true, chats };
  } catch (error) {
    console.error('Error searching chats:', error);
    return { success: false, error: 'Failed to search chats' };
  }
}
