'use server';

import prisma from '@/lib/prisma';
import { requireSupport } from '@/lib/roleGaurd';

export const getMyAssignedTickets = async () => {
  try {
    const session = await requireSupport();

    if (!session) {
      return { error: 'Unauthorized' };
    }

    const tickets = await prisma.supportTicket.findMany({
      where: {
        assignedTo: session.user.id,
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
    console.error('🚨 getMyAssignedTickets - Error:', error);
    return { error: 'Failed to fetch tickets' };
  }
};
