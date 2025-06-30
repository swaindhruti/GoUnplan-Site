import { prisma, requireUser } from "@/lib/shared";
export const getAllActiveTrips = async () => {
  const session = await requireUser();
  if (!session) return { error: "Unauthorized" };

  try {
    const activeTrips = await prisma.travelPlans.findMany({
      where: {
        status: "ACTIVE"
      },
      select: {
        travelPlanId: true,
        title: true,
        description: true,
        country: true,
        state: true,
        city: true,
        languages: true,
        filters: true,
        noOfDays: true,
        price: true,
        hostId: true,
        createdAt: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return { success: true, trips: activeTrips };
  } catch (error) {
    console.error("Error fetching active trips:", error);
    return { error: "Failed to fetch active trips" };
  }
};
