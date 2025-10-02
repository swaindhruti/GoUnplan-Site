"use server";

import prisma from "@/lib/prisma";
import { requireSupport } from "@/lib/roleGaurd";

export const getMyAssignedTickets = async () => {
  console.log("🎫 getMyAssignedTickets - Server action called");

  try {
    const session = await requireSupport();
    console.log("🎫 getMyAssignedTickets - Session received:", {
      hasSession: !!session,
      userEmail: session?.user?.email,
      userRole: session?.user?.role,
    });

    if (!session) {
      console.log("❌ getMyAssignedTickets - No session, returning error");
      return { error: "Unauthorized" };
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
            createdAt: "desc",
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
        createdAt: "desc",
      },
    });

    console.log(
      "✅ getMyAssignedTickets - Successfully fetched tickets:",
      tickets.length
    );
    return { tickets };
  } catch (error) {
    console.error("🚨 getMyAssignedTickets - Error:", error);
    return { error: "Failed to fetch tickets" };
  }
};
