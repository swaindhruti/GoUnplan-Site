import { prisma, requireUser } from "@/lib/shared";

export const getTripById = async (tripId: string) => {
  const session = await requireUser();
  if (!session) return { error: "Unauthorized" };

  try {
    const trip = await prisma.travelPlans.findUnique({
      where: { travelPlanId: tripId },
      select: {
        title: true,
        startDate: true,
        endDate: true,
        maxParticipants: true,
        price: true,
        travelPlanId: true
      }
    });
    // const booking = await prisma.booking.findFirst({
    //   where: {
    //     userId: session.user.id,
    //     travelPlanId: tripId
    //   },
    //   orderBy: {
    //     createdAt: "desc"
    //   },
    //   select: {
    //     id: true,
    //     userId: true,
    //     travelPlanId: true,
    //     startDate: true,
    //     endDate: true,
    //     totalPrice: true,
    //     participants: true,
    //     status: true,
    //     pricePerPerson: true,
    //     refundAmount: true,
    //     formSubmitted: true,
    //     // travelPlan: true,
    //     guests: true,
    //     updatedAt: true,
    //     createdAt: true
    //   }
    // });

    return { trip };
  } catch (error) {
    console.error("Error fetching trip by ID:", error);
    return { error: "Failed to fetch trip" };
  }
};
