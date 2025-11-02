import { Prisma } from '@prisma/client';

// Base Prisma types
export type User = Prisma.UserGetPayload<object>;
export type Chat = Prisma.ChatGetPayload<object>;
export type Message = Prisma.MessageGetPayload<object>;
export type ChatParticipant = Prisma.ChatParticipantGetPayload<object>;

// Message types with relations
export type MessageWithSender = Prisma.MessageGetPayload<{
  include: {
    sender: {
      select: {
        id: true;
        name: true;
        image: true;
        role: true;
      };
    };
  };
}>;

export type MessageWithUsers = Prisma.MessageGetPayload<{
  include: {
    sender: {
      select: { id: true; name: true; image: true; role: true };
    };
    receiver: {
      select: { id: true; name: true; image: true; role: true };
    };
  };
}>;

export type MessageWithFullDetails = Prisma.MessageGetPayload<{
  include: {
    sender: {
      select: { id: true; name: true; image: true; role: true };
    };
    receiver: {
      select: { id: true; name: true; image: true; role: true };
    };
    chat: {
      select: { id: true; travelPlanId: true };
    };
  };
}>;

// Chat types with relations
export type ChatWithParticipants = Prisma.ChatGetPayload<{
  include: {
    participants: {
      include: {
        user: {
          select: { id: true; name: true; image: true; role: true };
        };
      };
    };
  };
}>;

export type ChatWithMessages = Prisma.ChatGetPayload<{
  include: {
    messages: {
      orderBy: { createdAt: 'desc' };
      take: 10;
      include: {
        sender: {
          select: { id: true; name: true; image: true; role: true };
        };
      };
    };
  };
}>;

export type ChatWithLastMessage = Prisma.ChatGetPayload<{
  include: {
    participants: {
      include: {
        user: {
          select: { id: true; name: true; image: true; role: true };
        };
      };
    };
    messages: {
      orderBy: { createdAt: 'desc' };
      take: 1;
      include: {
        sender: {
          select: { id: true; name: true; image: true; role: true };
        };
        receiver: {
          select: { id: true; name: true; image: true; role: true };
        };
      };
    };
  };
}>;

export type ChatWithFullDetails = Prisma.ChatGetPayload<{
  include: {
    participants: {
      include: {
        user: {
          select: { id: true; name: true; image: true; role: true };
        };
      };
    };
    messages: {
      orderBy: { createdAt: 'desc' };
      take: 1;
      include: {
        sender: {
          select: { id: true; name: true; image: true; role: true };
        };
        receiver: {
          select: { id: true; name: true; image: true; role: true };
        };
      };
    };
    _count: {
      select: {
        messages: true;
      };
    };
  };
}>;

// User types with relations
export type UserWithChats = Prisma.UserGetPayload<{
  include: {
    chatParticipants: {
      include: {
        chat: {
          include: {
            participants: {
              include: {
                user: {
                  select: { id: true; name: true; image: true; role: true };
                };
              };
            };
          };
        };
      };
    };
  };
}>;

export type UserWithMessages = Prisma.UserGetPayload<{
  include: {
    sentMessages: {
      orderBy: { createdAt: 'desc' };
      take: 10;
    };
    receivedMessages: {
      orderBy: { createdAt: 'desc' };
      take: 10;
    };
  };
}>;

// Transformed types for frontend consumption
export type TransformedChat = {
  id: string;
  otherUser:
    | {
        id: string;
        name: string | null;
        image: string | null;
        role: Prisma.$Enums.Role;
      }
    | undefined;
  lastMessage:
    | {
        id: string;
        chatId: string | null;
        senderId: string | null;
        receiverId: string | null;
        content: string | null;
        type: Prisma.$Enums.MessageType | null;
        isRead: boolean | null;
        createdAt: Date | null;
        sender: {
          id: string;
          name: string | null;
          image: string | null;
          role: Prisma.$Enums.Role;
        } | null;
        receiver: {
          id: string;
          name: string | null;
          image: string | null;
          role: Prisma.$Enums.Role;
        } | null;
      }
    | undefined;
  unreadCount: number;
  lastMessageAt: Date | null;
};

export type TransformedMessage = {
  id: string;
  chatId: string | null;
  senderId: string | null;
  receiverId: string | null;
  content: string | null;
  type: Prisma.$Enums.MessageType | null;
  isRead: boolean | null;
  createdAt: Date | null;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
    role: Prisma.$Enums.Role;
  } | null;
  receiver: {
    id: string;
    name: string | null;
    image: string | null;
    role: Prisma.$Enums.Role;
  } | null;
};

export type CreateChatData = Prisma.ChatCreateInput;
export type UpdateChatData = Prisma.ChatUpdateInput;
export type CreateMessageData = Prisma.MessageCreateInput;
export type UpdateMessageData = Prisma.MessageUpdateInput;
export type CreateUserData = Prisma.UserCreateInput;
export type UpdateUserData = Prisma.UserUpdateInput;

export type ChatWhereInput = Prisma.ChatWhereInput;
export type MessageWhereInput = Prisma.MessageWhereInput;
export type UserWhereInput = Prisma.UserWhereInput;

export type ChatSelect = Prisma.ChatSelect;
export type MessageSelect = Prisma.MessageSelect;
export type UserSelect = Prisma.UserSelect;

export type ChatOrderByInput = Prisma.ChatOrderByWithRelationInput;
export type MessageOrderByInput = Prisma.MessageOrderByWithRelationInput;
export type UserOrderByInput = Prisma.UserOrderByWithRelationInput;

export const MessageType = Prisma.MessageType;
export const Role = Prisma.Role;
export type MessageType = Prisma.MessageType;
export type Role = Prisma.Role;

export type CreateChatResult =
  | { success: true; chat: ChatWithLastMessage }
  | { success: false; error: string };

export type SendMessageResult =
  | { success: true; message: MessageWithSender }
  | { success: false; error: string };

export type GetMessagesResult =
  | { success: true; messages: MessageWithSender[] }
  | { success: false; error: string };

export type GetUserChatsResult =
  | { success: true; chats: TransformedChat[] }
  | { success: false; error: string };

export type PollMessagesResult =
  | { success: true; messages: MessageWithSender[] }
  | { success: false; error: string };

export type GenericSuccessResult = { success: true } | { success: false; error: string };

export type UnreadCountResult =
  | { success: true; count: number }
  | { success: false; error: string };

export type SearchChatsResult =
  | { success: true; chats: ChatWithParticipants[] }
  | { success: false; error: string };

// Input parameter types for server actions
export interface CreateChatParams {
  userId: string;
  hostId: string;
  travelPlanId?: string;
}

export interface SendMessageParams {
  chatId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type?: Prisma.$Enums.MessageType;
}

export interface GetMessagesParams {
  chatId: string;
  page?: number;
  limit?: number;
}

export interface MarkAsReadParams {
  chatId: string;
  userId: string;
}

export interface BatchMarkAsReadParams {
  userId: string;
  chatIds: string[];
}

export interface SearchChatsParams {
  userId: string;
  query: string;
}

export interface PollMessagesParams {
  chatId: string;
  lastMessageId?: string;
}

// Component prop types
export interface ChatContainerProps {
  initialChats: TransformedChat[] | undefined;
}

export interface MessageListProps {
  messages: MessageWithSender[];
  currentUserId: string;
}

export interface ChatItemProps {
  chat: TransformedChat;
  onClick: (chatId: string) => void;
  isActive?: boolean;
}

export interface MessageItemProps {
  message: MessageWithSender;
  isOwn: boolean;
  showSender?: boolean;
}

export interface UserAvatarProps {
  user: {
    id: string;
    name: string | null;
    image: string | null;
    role: Prisma.$Enums.Role;
  };
  size?: 'sm' | 'md' | 'lg';
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface RealtimeMessage {
  type: 'NEW_MESSAGE' | 'MESSAGE_READ' | 'USER_TYPING' | 'USER_ONLINE' | 'USER_OFFLINE';
  data: Message;
  chatId?: string;
  userId?: string;
}

export interface TypingIndicator {
  chatId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface ChatStats {
  totalChats: number;
  unreadChats: number;
  totalMessages: number;
  unreadMessages: number;
}

// Error types
// export interface ChatError {
//   code: string;
//   message: string;
//   details?: any;
// }

// export interface MessageValidation {
//   content: {
//     minLength: number;
//     maxLength: number;
//   };
//   file: {
//     maxSize: number;
//     allowedTypes: string[];
//   };
// }
export type ChatUser = Pick<User, 'id' | 'name' | 'image' | 'role'>;
