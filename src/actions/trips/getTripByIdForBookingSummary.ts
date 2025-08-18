import { prisma, requireUser } from "@/lib/shared";

export const getTripById = async (tripId: string, bookingId: string) => {
  const session = await requireUser();
  if (!session) return { error: "Unauthorized" };

  try {
    const trip = await prisma.travelPlans.findUnique({
      where: { travelPlanId: tripId },
      select: {
        title: true,
        description: true,
        destination: true,
        travelPlanId: true,
        noOfDays: true,
        tripImage: true
      }
    });
    const booking = await prisma.booking.findFirst({
      where: {
        userId: session.user.id,
        travelPlanId: tripId,
        id: bookingId
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
        // travelPlan: true,
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
