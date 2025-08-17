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

    // Add default vibes to trips that don't have any filters
    const tripsWithVibes = activeTrips.map((trip) => {
      if (!trip.filters || trip.filters.length === 0) {
        // Generate vibes based on trip content
        const content = `${trip.title} ${trip.description}`.toLowerCase();
        const generatedVibes: string[] = [];

        if (
          content.includes("adventure") ||
          content.includes("trek") ||
          content.includes("hike")
        ) {
          generatedVibes.push("Adventure");
        }
        if (
          content.includes("culture") ||
          content.includes("temple") ||
          content.includes("museum")
        ) {
          generatedVibes.push("Cultural");
        }
        if (
          content.includes("nature") ||
          content.includes("forest") ||
          content.includes("mountain")
        ) {
          generatedVibes.push("Nature");
        }
        if (
          content.includes("beach") ||
          content.includes("relax") ||
          content.includes("spa")
        ) {
          generatedVibes.push("Relaxation");
        }

        // If still no vibes, add a default one
        if (generatedVibes.length === 0) {
          const defaultVibes = [
            "Adventure",
            "Cultural",
            "Nature",
            "Relaxation"
          ];
          generatedVibes.push(
            defaultVibes[Math.floor(Math.random() * defaultVibes.length)]
          );
        }

        return {
          ...trip,
          filters: generatedVibes
        };
      }
      return trip;
    });

    return { success: true, trips: tripsWithVibes };
  } catch (error) {
    console.error("Error fetching active trips:", error);
    return { error: "Failed to fetch active trips" };
  }
};
