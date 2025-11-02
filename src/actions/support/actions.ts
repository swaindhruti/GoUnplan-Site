'use server';

import prisma from '@/lib/prisma';
import { requireSupport, requireAuth } from '@/lib/roleGaurd';
import { CreateTicketData, UpdateTicketData, CreateTicketMessageData } from '@/types/support';

export const getAllSupportStaff = async () => {
  const session = await requireSupport();
  if (!session) return { error: 'Unauthorized' };

  try {
    const supportStaff = await prisma.user.findMany({
      where: { role: 'SUPPORT' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        role: true,
        assignedTickets: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    const staffWithStats = supportStaff.map(staff => ({
      ...staff,
      ticketCount: staff.assignedTickets.length,
      openTickets: staff.assignedTickets.filter(
        t => t.status === 'OPEN' || t.status === 'IN_PROGRESS'
      ).length,
    }));

    return { supportStaff: staffWithStats };
  } catch (error) {
    console.error('Error fetching support staff:', error);
    return { error: 'Failed to fetch support staff' };
  }
};

export const getAllTickets = async () => {
  try {
    const session = await requireSupport();

    if (!session) {
      return { error: 'Unauthorized' };
    }

    const tickets = await prisma.supportTicket.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        booking: {
          select: {
            id: true,
            travelPlan: {
              select: {
                title: true,
                destination: true,
              },
            },
            startDate: true,
            endDate: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            sender: {
              select: {
                name: true,
                role: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { tickets };
  } catch (error) {
    console.error('🚨 getAllTickets - Error:', error);
    return { error: 'Failed to fetch tickets' };
  }
};

export const getTicketById = async (ticketId: string) => {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };

  try {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        booking: {
          select: {
            id: true,
            travelPlan: {
              select: {
                title: true,
                destination: true,
              },
            },
            startDate: true,
            endDate: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!ticket) {
      return { error: 'Ticket not found' };
    }

    // Check if user can access this ticket
    if (session.user.role === 'USER' && ticket.userId !== session.user.id) {
      return { error: 'Access denied' };
    }

    return { ticket };
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return { error: 'Failed to fetch ticket' };
  }
};

export const createTicket = async (data: CreateTicketData) => {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };

  try {
    const ticket = await prisma.supportTicket.create({
      data: {
        userId: session.user.id,
        bookingId: data.bookingId,
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        booking: {
          select: {
            id: true,
            travelPlan: {
              select: {
                title: true,
                destination: true,
              },
            },
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    return { success: true, ticket };
  } catch (error) {
    console.error('Error creating ticket:', error);
    return { error: 'Failed to create ticket' };
  }
};

export const updateTicket = async (ticketId: string, data: UpdateTicketData) => {
  const session = await requireSupport();
  if (!session) return { error: 'Unauthorized' };

  try {
    const updateData: Partial<typeof data & { closedAt?: Date }> = { ...data };

    if (data.status === 'CLOSED' || data.status === 'RESOLVED') {
      updateData.closedAt = new Date();
    }

    const ticket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return { success: true, ticket };
  } catch (error) {
    console.error('Error updating ticket:', error);
    return { error: 'Failed to update ticket' };
  }
};

export const assignTicket = async (ticketId: string, assigneeId: string) => {
  const session = await requireSupport();
  if (!session) return { error: 'Unauthorized' };

  try {
    const ticket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        assignedTo: assigneeId,
        status: 'IN_PROGRESS',
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return { success: true, ticket };
  } catch (error) {
    console.error('Error assigning ticket:', error);
    return { error: 'Failed to assign ticket' };
  }
};

export const addTicketMessage = async (data: CreateTicketMessageData) => {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };

  try {
    // Verify the user can access this ticket
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: data.ticketId },
      select: { userId: true, assignedTo: true },
    });

    if (!ticket) {
      return { error: 'Ticket not found' };
    }

    // Check access permissions
    const canAccess =
      session.user.role === 'ADMIN' ||
      session.user.role === 'SUPPORT' ||
      ticket.userId === session.user.id ||
      ticket.assignedTo === session.user.id;

    if (!canAccess) {
      return { error: 'Access denied' };
    }

    const message = await prisma.ticketMessage.create({
      data: {
        ticketId: data.ticketId,
        senderId: session.user.id,
        message: data.message,
        isInternal: data.isInternal || false,
        attachments: data.attachments || [],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
          },
        },
      },
    });

    // Update ticket timestamp
    await prisma.supportTicket.update({
      where: { id: data.ticketId },
      data: { updatedAt: new Date() },
    });

    return { success: true, message };
  } catch (error) {
    console.error('Error adding ticket message:', error);
    return { error: 'Failed to add message' };
  }
};

export const getUserTickets = async () => {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };

  try {
    const tickets = await prisma.supportTicket.findMany({
      where: { userId: session.user.id },
      include: {
        booking: {
          select: {
            id: true,
            travelPlan: {
              select: {
                title: true,
                destination: true,
              },
            },
            startDate: true,
            endDate: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { tickets };
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    return { error: 'Failed to fetch tickets' };
  }
};

export const getUserBookingsForSupport = async () => {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
        status: {
          in: ['CONFIRMED', 'PENDING'],
        },
      },
      include: {
        travelPlan: {
          select: {
            title: true,
            destination: true,
            city: true,
            country: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { bookings };
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return { error: 'Failed to fetch bookings' };
  }
};

export const getTicketStats = async () => {
  try {
    const session = await requireSupport();

    if (!session) {
      return { error: 'Unauthorized' };
    }

    const [totalTickets, openTickets, inProgressTickets, resolvedTickets] = await Promise.all([
      prisma.supportTicket.count(),
      prisma.supportTicket.count({ where: { status: 'OPEN' } }),
      prisma.supportTicket.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.supportTicket.count({ where: { status: 'RESOLVED' } }),
    ]);

    const categoryStats = await prisma.supportTicket.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
    });

    const priorityStats = await prisma.supportTicket.groupBy({
      by: ['priority'],
      _count: {
        priority: true,
      },
    });

    return {
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      categoryStats,
      priorityStats,
    };
  } catch (error) {
    console.error('🚨 getTicketStats - Error:', error);
    return { error: 'Failed to fetch stats' };
  }
};
