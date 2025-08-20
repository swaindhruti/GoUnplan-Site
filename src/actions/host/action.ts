"use server";

import prisma from "@/lib/prisma";
import { requireHost } from "@/lib/roleGaurd";
import { TravelPlanStatuses } from "@/types/travel";
import { TravelPlanStatus, BookingStatus, Prisma } from "@prisma/client";

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
  status?: "ACTIVE" | "INACTIVE" | "DRAFT";
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

    // Determine the status to set
    console.log("🔍 DEBUG ACTION: Received status =", data.status);
    console.log("🔍 DEBUG ACTION: TravelPlanStatus enum values:", { 
      DRAFT: TravelPlanStatus.DRAFT, 
      ACTIVE: TravelPlanStatus.ACTIVE, 
      INACTIVE: TravelPlanStatus.INACTIVE 
    });
    
    let statusToSet;
    if (data.status === "DRAFT") {
      statusToSet = TravelPlanStatus.DRAFT;
    } else if (data.status === "ACTIVE") {
      statusToSet = TravelPlanStatus.ACTIVE;
    } else {
      statusToSet = TravelPlanStatus.INACTIVE;
    }
    console.log("🔍 DEBUG ACTION: statusToSet =", statusToSet);
    
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
        status: statusToSet
      }
    });

    console.log("🔍 DEBUG ACTION: Travel plan created with status:", travelPlan.status);

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
    destination?: string;
    tripImage?: string;
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

export const saveDraftTrip = async (
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
    destination?: string;
    tripImage?: string;
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

    // Check if the travel plan exists and belongs to the host
    const existingPlan = await prisma.travelPlans.findUnique({
      where: { travelPlanId: id },
      select: { hostId: true, status: true }
    });

    if (!existingPlan || existingPlan.hostId !== hostProfile.hostId) {
      return { error: "Travel plan not found or unauthorized access" };
    }

    // Update the travel plan and keep it as DRAFT
    const updatedPlan = await prisma.travelPlans.update({
      where: { travelPlanId: id },
      data: {
        ...data,
        status: "DRAFT" // Keep as draft
      }
    });

    return {
      success: true,
      updatedPlan,
      message: "Draft saved successfully"
    };
  } catch (error) {
    console.error("Error saving draft trip:", error);
    return { error: "Failed to save draft" };
  }
};

export const submitTripForVerification = async (
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
    destination?: string;
    tripImage?: string;
    status?: "ACTIVE" | "INACTIVE" | "DRAFT";
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
      where: { travelPlanId: id },
      include: {
        bookings: {
          where: {
            status: { in: ["CONFIRMED", "PENDING"] }
          }
        }
      }
    });

    if (!existingPlan || existingPlan.hostId !== hostProfile.hostId) {
      return { error: "Travel plan not found or unauthorized access" };
    }

    // Get the current trip to check its status
    const currentTrip = await prisma.travelPlans.findUnique({
      where: { travelPlanId: id }
    });

    if (!currentTrip) {
      return { error: "Trip not found" };
    }

    // Determine the new status
    let newStatus = data.status;
    if (!newStatus) {
      // If status is not provided:
      // - If it's a draft being completed, set to INACTIVE for admin review
      // - Otherwise keep current status unless explicitly changing it
      if (currentTrip.status === "DRAFT") {
        newStatus = "INACTIVE";
      } else {
        newStatus = currentTrip.status;
      }
    }

    // Update the travel plan
    // This won't affect existing bookings as they are linked by travelPlanId
    const updatedPlan = await prisma.travelPlans.update({
      where: { travelPlanId: id },
      data: {
        ...data,
        status: newStatus
      }
    });

    const message = currentTrip.status === "DRAFT" 
      ? "Draft trip completed and submitted for admin verification. It will be active after admin approval."
      : "Travel plan submitted for verification. It will be active after admin approval. Existing bookings remain unaffected.";
    
    return {
      success: true,
      updatedPlan,
      message,
      existingBookingsCount: existingPlan.bookings.length
    };
  } catch (error) {
    console.error("Error submitting travel plan for verification:", error);
    return { error: "Failed to submit travel plan for verification" };
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

export const getHostBookings = async (statusFilter?: string) => {
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

    // Build where clause for bookings
    const whereClause: Prisma.BookingWhereInput = {
      travelPlanId: { in: travelPlanIds }
    };

    // Add status filter if provided
    if (statusFilter && statusFilter !== "ALL") {
      whereClause.status = statusFilter as BookingStatus;
    }

    // Fetch bookings with related data
    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true
          }
        },
        travelPlan: {
          select: {
            travelPlanId: true,
            title: true,
            destination: true,
            startDate: true,
            endDate: true,
            price: true,
            tripImage: true
          }
        },
        guests: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Get booking counts by status
    const bookingCounts = await prisma.booking.groupBy({
      by: ["status"],
      _count: {
        id: true
      },
      where: {
        travelPlanId: { in: travelPlanIds }
      }
    });

    const counts = {
      ALL: 0,
      PENDING: 0,
      CONFIRMED: 0,
      CANCELLED: 0,
      REFUNDED: 0
    };

    bookingCounts.forEach((count) => {
      counts[count.status] = count._count.id;
      counts.ALL += count._count.id;
    });

    return {
      success: true,
      bookings,
      counts
    };
  } catch (error) {
    console.error("Error fetching host bookings:", error);
    return { error: "Failed to fetch bookings" };
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
