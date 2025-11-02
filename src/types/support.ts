export type SupportCategory =
  | 'GENERAL'
  | 'BOOKING'
  | 'PAYMENT'
  | 'TECHNICAL'
  | 'REFUND'
  | 'CANCELLATION'
  | 'OTHER';

export type SupportPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type SupportTicketStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_USER'
  | 'RESOLVED'
  | 'CLOSED';

export interface SupportTicket {
  id: string;
  userId: string;
  bookingId?: string;
  title: string;
  description: string;
  category: SupportCategory;
  priority: SupportPriority;
  status: SupportTicketStatus;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  booking?: {
    id: string;
    travelPlan: {
      title: string;
      destination?: string;
    };
    startDate: Date;
    endDate: Date;
  };
  assignee?: {
    id: string;
    name: string;
    email: string;
  };
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  message: string;
  isInternal: boolean;
  attachments: string[];
  createdAt: Date;
  sender: {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
  };
}

export interface CreateTicketData {
  bookingId?: string;
  title: string;
  description: string;
  category: SupportCategory;
  priority: SupportPriority;
}

export interface UpdateTicketData {
  title?: string;
  description?: string;
  category?: SupportCategory;
  priority?: SupportPriority;
  status?: SupportTicketStatus;
  assignedTo?: string;
}

export interface CreateTicketMessageData {
  ticketId: string;
  message: string;
  isInternal?: boolean;
  attachments?: string[];
}
