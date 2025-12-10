/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma, requireUser } from '@/lib/shared';

export const getAllActiveTrips = async () => {
  const session = await requireUser();
  if (!session) return { error: 'Unauthorized' };

  try {
    const activeTrips = await prisma.travelPlans.findMany({
      where: {
        status: 'ACTIVE',
      },
      select: {
        travelPlanId: true,
        title: true,
        description: true,
        country: true,
        state: true,
        city: true,
        languages: true,
        tripImage: true,
        filters: true,
        noOfDays: true,
        price: true,
        stops: true,
        destination: true,
        hostId: true,
        host: {
          select: {
            hostEmail: true,
            hostId: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                image: true,
              },
            },
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Add default vibes to trips that don't have any filters
    const tripsWithVibes = activeTrips.map(trip => {
      const base = { ...trip } as any;
      if (!base.filters || base.filters.length === 0) {
        const content = `${base.title} ${base.description}`.toLowerCase();
        const generatedVibes: string[] = [];

        if (content.includes('adventure') || content.includes('trek') || content.includes('hike')) {
          generatedVibes.push('Adventure');
        }
        if (
          content.includes('culture') ||
          content.includes('temple') ||
          content.includes('museum')
        ) {
          generatedVibes.push('Cultural');
        }
        if (
          content.includes('nature') ||
          content.includes('forest') ||
          content.includes('mountain')
        ) {
          generatedVibes.push('Nature');
        }
        if (content.includes('beach') || content.includes('relax') || content.includes('spa')) {
          generatedVibes.push('Relaxation');
        }

        if (generatedVibes.length === 0) {
          const defaultVibes = ['Adventure', 'Cultural', 'Nature', 'Relaxation'];
          generatedVibes.push(defaultVibes[Math.floor(Math.random() * defaultVibes.length)]);
        }

        base.filters = generatedVibes;
      }
      return base;
    });

    const TripDestinationWithInfo = activeTrips.map(trip => {
      return {
        travelPlanId: trip.travelPlanId,
        title: trip.title,
        description: trip.description,
        image: trip.tripImage,
        host: trip.host,
      };
    });

    // Collect unique hosts from trips (normalize shape)
    const hostMap = new Map<string, any>();
    for (const t of tripsWithVibes) {
      const host = (t as any).host;
      if (host) {
        const hostKey = host.id ?? host.hostEmail ?? host.user?.id ?? host.user?.email;
        if (!hostKey) continue;
        if (!hostMap.has(String(hostKey))) {
          hostMap.set(String(hostKey), {
            id: host.id ?? null,
            email: host.hostEmail ?? host.user?.email ?? null,
            name: host.user?.name ?? null,
            hostId: host.hostId ?? null,
            phone: host.user?.phone ?? null,
            image: host.user?.image ?? null,
          });
        }
      }
    }
    const hosts = Array.from(hostMap.values());
    // console.log(hosts);

    return { success: true, trips: tripsWithVibes, hosts, TripDestinationWithInfo };
  } catch (error) {
    console.error('Error fetching active trips:', error);
    return { error: 'Failed to fetch active trips' };
  }
};
