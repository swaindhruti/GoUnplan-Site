import { requireUser, prisma } from "@/lib/shared";

export const getTripById = async (tripId: string) => {
  const session = await requireUser();
  if (!session) return { error: "Unauthorized" };

  try {
    const trip = await prisma.travelPlans.findUnique({
      where: { travelPlanId: tripId },
      include: {
        dayWiseItinerary: true,

        bookings: {
          where: {
            travelPlanId: tripId
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
            refundAmount: true
          }
        },
        host: {
          include: {
            user: true
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
          },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    return trip;
  } catch (error) {
    console.error("Error fetching trip by ID:", error);
    return { error: "Failed to fetch trip" };
  }
};
