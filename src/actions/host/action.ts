"use server";

import prisma from "@/lib/prisma";
import { requireHost } from "@/lib/roleGaurd";
import { TravelPlanStatuses } from "@/types/travel";
import { TravelPlanStatus } from "@prisma/client";

export const getHostDetails = async () => {
  const session = await requireHost();
  if (!session) return { error: "Unauthorized" };

  try {
    const host = await prisma.hostProfile.findUnique({
      where: { hostId: session.user.id },
      select: {
        hostId: true,
        description: true,
        image: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!host) {
      return { error: "Host not found" };
    }

    return { host };
  } catch (error) {
    console.error("Error fetching host details:", error);
    return { error: "Failed to fetch host details" };
  }
};

export const getHostTravelPlansByStatus = async (
  status: TravelPlanStatuses
) => {
  const session = await requireHost();
  if (!session) return { error: "Unauthorized" };

  try {
    const travelPlans = await prisma.travelPlans.findMany({
      where: {
        hostId: session.user.id,
        status: status
      },
      select: {
        title: true,
        description: true,
        price: true,
        maxParticipants: true
      }
    });

    if (!travelPlans || travelPlans.length === 0) {
      return { message: "No travel plans found for this status" };
    }

    return { travelPlans };
  } catch (error) {
    console.error("Error fetching travel plans:", error);
    return { error: "Failed to fetch travel plans" };
  }
};

export const updateHostProfile = async (data: {
  description?: string;
  image?: string;
  bio?: string;
  hostEmail?: string;
  hostMobile?: string;
}) => {
  const session = await requireHost();
  if (!session) return { error: "Unauthorized" };

  try {
    const updatedHost = await prisma.hostProfile.update({
      where: { hostId: session.user.id },
      data: {
        description: data.description,
        image: data.image,
        hostEmail: data.hostEmail,
        hostMobile: data.hostMobile
      }
    });

    return { success: true, host: updatedHost };
  } catch (error) {
    console.error("Error updating host profile:", error);
    return { error: "Failed to update host profile" };
  }
};

export const createTravelPlan = async (data: {
  title: string;
  destination: string;
  description: string;
  includedActivities: string[];
  restrictions: string[];
  noOfDays: number;
  price: number;
  startDate: Date;
  endDate: Date;
  filters: string[];
  maxParticipants?: number;
  country: string;
  state: string;
  city: string;
  languages: string[];
  tripImage?: string;
  dayWiseData?: Array<{
    dayNumber: number;
    title: string;
    description: string;
    activities: string[];
    meals: string;
    accommodation: string;
    dayWiseImage: string;
  }>;
}) => {
  const session = await requireHost();
  if (!session) return { error: "Unauthorized" };

  try {
    const hostProfile = await prisma.hostProfile.findUnique({
      where: { hostId: session.user.id }
    });

    if (!hostProfile) {
      return { error: "Host profile not found" };
    }

    // Debug - Log all incoming data
    console.log("Received travel plan data:", {
      title: data.title,
      description: data.description.slice(0, 30) + "...",
      noOfDays: data.noOfDays,
      filters: data.filters,
      languages: data.languages,
      dayWiseData: data.dayWiseData ? `${data.dayWiseData.length} days` : "none"
    });

    // Debug - Full day-wise data
    if (data.dayWiseData && data.dayWiseData.length > 0) {
      console.log(
        "Received day-wise data details:",
        JSON.stringify(data.dayWiseData, null, 2)
      );
    } else {
      console.log("WARNING: No day-wise data received or the array is empty");
    }

    // Create the travel plan first (without transaction)
    const travelPlan = await prisma.travelPlans.create({
      data: {
        title: data.title,
        description: data.description,
        includedActivities: data.includedActivities || [],
        destination: data.destination,
        startDate: data.startDate,
        endDate: data.endDate,
        restrictions: data.restrictions || [],
        noOfDays: data.noOfDays,
        hostId: hostProfile.hostId,
        price: data.price,
        maxParticipants: data.maxParticipants,
        country: data.country,
        state: data.state,
        city: data.city,
        languages: data.languages || [],
        filters: data.filters || [],
        tripImage: data.tripImage || "https://avatar.iran.liara.run/public",
        status: TravelPlanStatus.INACTIVE
      }
    });

    console.log("Travel plan created successfully:", travelPlan);

    if (data.dayWiseData && data.dayWiseData.length > 0) {
      console.log(`Processing ${data.dayWiseData.length} day entries...`);

      try {
        for (const dayData of data.dayWiseData) {
          console.log(
            `Creating day ${dayData.dayNumber}:`,
            JSON.stringify(dayData, null, 2)
          );

          const createdDay = await prisma.dayWiseItinerary.create({
            data: {
              travelPlanId: travelPlan.travelPlanId,
              dayNumber: dayData.dayNumber,
              title: dayData.title || `Day ${dayData.dayNumber}`,
              description: dayData.description || "",
              activities: Array.isArray(dayData.activities)
                ? dayData.activities
                : [],
              meals: dayData.meals || "",
              accommodation: dayData.accommodation || "",
              dayWiseImage:
                dayData.dayWiseImage || "https://avatar.iran.liara.run/public"
            }
          });

          console.log(
            `Day ${dayData.dayNumber} created successfully:`,
            createdDay.id
          );
        }

        console.log("All day-wise itineraries created successfully!");
      } catch (dayError) {
        console.error("Error creating day-wise data:", dayError);

        // Since we're not using transactions, we should handle cleanup here
        // Delete the travel plan if day-wise itinerary creation fails
        await prisma.travelPlans.delete({
          where: { travelPlanId: travelPlan.travelPlanId }
        });

        throw dayError;
      }
    } else {
      console.log("No day-wise data provided");
    }

    return {
      success: true,
      travelPlan: travelPlan,
      message:
        "Travel plan created successfully! It is currently inactive. Activate it when you're ready to accept bookings."
    };
  } catch (error) {
    console.error("Error creating travel plan:", error);
    return { error: `Failed to create travel plan` };
  }
};

export const getAllTrips = async () => {
  const session = await requireHost();
  if (!session) return { error: "Unauthorized" };

  try {
    const hostProfile = await prisma.hostProfile.findUnique({
      where: { hostId: session.user.id }
    });

    if (!hostProfile) {
      return { error: "Host profile not found" };
    }

    const trips = await prisma.travelPlans.findMany({
      where: {
        hostId: hostProfile.hostId
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return { success: true, trips };
  } catch (error) {
    console.error("Error fetching trips:", error);
    return { error: "Failed to fetch trips" };
  }
};

export const updateTravelPlan = async (
  id: string,
  data: {
    title?: string;
    description?: string;
    includedActivities?: string[];
    restrictions?: string[];
    noOfDays?: number;
    price?: number;
    startDate?: Date;
    endDate?: Date;
    maxParticipants?: number;
    country?: string;
    state?: string;
    city?: string;
    filters?: string[];
    languages?: string[];
    status?: "ACTIVE" | "INACTIVE";
  }
) => {
  const session = await requireHost();
  if (!session) return { error: "Unauthorized" };

  try {
    const hostProfile = await prisma.hostProfile.findUnique({
      where: { hostId: session.user.id }
    });

    if (!hostProfile) {
      return { error: "Host profile not found" };
    }

    const existingPlan = await prisma.travelPlans.findUnique({
      where: { travelPlanId: id }
    });

    if (!existingPlan || existingPlan.hostId !== hostProfile.hostId) {
      return { error: "Travel plan not found or unauthorized access" };
    }

    // Update the travel plan
    const updatedPlan = await prisma.travelPlans.update({
      where: { travelPlanId: id },
      data: {
        ...data
      }
    });

    return {
      success: true,
      updatedPlan,
      message: "Travel plan updated successfully!"
    };
  } catch (error) {
    console.error("Error updating travel plan:", error);
    return { error: "Failed to update travel plan" };
  }
};

export const getTripById = async (tripId: string) => {
  const session = await requireHost();
  if (!session) return { error: "Unauthorized" };

  try {
    const hostProfile = await prisma.hostProfile.findUnique({
      where: { hostId: session.user.id }
    });

    if (!hostProfile) {
      return { error: "Host profile not found" };
    }

    const trip = await prisma.travelPlans.findUnique({
      where: { travelPlanId: tripId }
    });

    if (!trip || trip.hostId !== hostProfile.hostId) {
      return { error: "Trip not found or access denied" };
    }

    return trip;
  } catch (error) {
    console.error("Error fetching trip by ID:", error);
    return { error: "Failed to fetch trip" };
  }
};

export const getRevenueAnalytics = async () => {
  const session = await requireHost();
  if (!session) return { error: "Unauthorized" };

  try {
    const hostProfile = await prisma.hostProfile.findUnique({
      where: { hostId: session.user.id }
    });

    if (!hostProfile) {
      return { error: "Host profile not found" };
    }

    // Get all travel plans by this host
    const travelPlans = await prisma.travelPlans.findMany({
      where: { hostId: hostProfile.hostId },
      select: { travelPlanId: true }
    });

    const travelPlanIds = travelPlans.map((plan) => plan.travelPlanId);

    // Get confirmed bookings revenue
    const confirmedBookings = await prisma.booking.aggregate({
      _sum: {
        totalPrice: true
      },
      _count: {
        id: true
      },
      where: {
        travelPlanId: { in: travelPlanIds },
        status: "CONFIRMED"
      }
    });

    // Get cancelled bookings data
    const cancelledBookings = await prisma.booking.aggregate({
      _sum: {
        totalPrice: true,
        refundAmount: true
      },
      _count: {
        id: true
      },
      where: {
        travelPlanId: { in: travelPlanIds },
        status: { in: ["CANCELLED", "REFUNDED"] }
      }
    });

    // Get pending bookings value
    const pendingBookings = await prisma.booking.aggregate({
      _sum: {
        totalPrice: true
      },
      _count: {
        id: true
      },
      where: {
        travelPlanId: { in: travelPlanIds },
        status: "PENDING"
      }
    });

    // Get monthly revenue trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await prisma.booking.groupBy({
      by: ["status"],
      _sum: {
        totalPrice: true
      },
      where: {
        travelPlanId: { in: travelPlanIds },
        createdAt: { gte: sixMonthsAgo },
        status: "CONFIRMED"
      }
    });

    // Calculate metrics
    const totalConfirmedRevenue = confirmedBookings._sum.totalPrice || 0;
    const totalCancelledValue = cancelledBookings._sum.totalPrice || 0;
    const totalRefundAmount = cancelledBookings._sum.refundAmount || 0;
    const totalPendingValue = pendingBookings._sum.totalPrice || 0;

    // Net revenue = Confirmed revenue - refunds
    const netRevenue = totalConfirmedRevenue - totalRefundAmount;

    // Revenue at risk = Pending bookings that might cancel
    const revenueAtRisk = totalPendingValue;

    // Cancellation rate
    const totalBookings =
      (confirmedBookings._count.id || 0) +
      (cancelledBookings._count.id || 0) +
      (pendingBookings._count.id || 0);

    const cancellationRate =
      totalBookings > 0
        ? ((cancelledBookings._count.id || 0) / totalBookings) * 100
        : 0;

    return {
      success: true,
      revenueData: {
        confirmed: {
          revenue: totalConfirmedRevenue,
          bookingCount: confirmedBookings._count.id || 0
        },
        cancelled: {
          bookingValue: totalCancelledValue,
          refundAmount: totalRefundAmount,
          bookingCount: cancelledBookings._count.id || 0
        },
        pending: {
          bookingValue: totalPendingValue,
          bookingCount: pendingBookings._count.id || 0
        },
        summary: {
          netRevenue,
          revenueAtRisk,
          cancellationRate: Math.round(cancellationRate * 10) / 10 // Round to 1 decimal place
        },
        monthlyTrend: monthlyRevenue
      }
    };
  } catch (error) {
    console.error("Error calculating revenue analytics:", error);
    return { error: "Failed to calculate revenue analytics" };
  }
};
