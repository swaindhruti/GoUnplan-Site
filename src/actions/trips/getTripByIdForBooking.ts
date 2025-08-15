import { prisma, requireUser } from "@/lib/shared";

export const getTripById = async (tripId: string) => {
  // Add validation to ensure tripId is provided
  if (!tripId) {
    return { error: "Trip ID is required" };
  }

  const session = await requireUser();
  if (!session) return { error: "Unauthorized" };

  try {
    const trip = await prisma?.travelPlans.findUnique({
      where: { travelPlanId: tripId },
      include: {
        host: {
          include: {
            user: true
          }
        }
      }
    });

    if (!trip) {
      return { error: "Trip not found" };
    }

    const booking = await prisma.booking.findFirst({
      where: {
        userId: session.user.id,
        travelPlanId: tripId
      },
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        userId: true,
        travelPlanId: true,
        startDate: true,
        endDate: true,
        totalPrice: true,
        participants: true,
        status: true,
        pricePerPerson: true,
        refundAmount: true,
        formSubmitted: true,
        travelPlan: true,
        guests: true,
        updatedAt: true,
        createdAt: true
      }
    });
    return { trip, booking };
  } catch (error) {
    console.error("Error fetching trip by ID:", error);
    return { error: "Failed to fetch trip" };
  }
};
