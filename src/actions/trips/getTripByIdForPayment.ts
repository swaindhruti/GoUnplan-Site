import { prisma, requireUser } from "@/lib/shared";

export const getTripById = async (tripId: string, bookingId: string) => {
  const session = await requireUser();
  if (!session) return { error: "Unauthorized" };

  try {
    const trip = await prisma.travelPlans.findUnique({
      where: { travelPlanId: tripId },
      select: {
        title: true,
        startDate: true,
        endDate: true,
        price: true,
        travelPlanId: true,
        maxParticipants: true,
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
        guests: true,
        startDate: true,
        endDate: true,
        pricePerPerson: true,
        participants: true
      }
    });

    return { trip, booking };
  } catch (error) {
    console.error("Error fetching trip by ID:", error);
    return { error: "Failed to fetch trip" };
  }
};
