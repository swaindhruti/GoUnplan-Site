"use server";

import prisma from "@/lib/prisma";
import { requireHost } from "@/lib/roleGaurd";
import { TravelPlanStatuses } from "@/types/travel";
import {
  TravelPlanStatus,
  BookingStatus,
  PaymentStatus,
  Prisma,
} from "@prisma/client";

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
            phone: true,
          },
        },
      },
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
        status: status,
      },
      select: {
        title: true,
        description: true,
        price: true,
        maxParticipants: true,
      },
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
        hostMobile: data.hostMobile,
      },
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
  special: string[] | "";
  activities: string[] | "";
  noOfDays: number;
  price: number;
  startDate: Date | null;
  endDate: Date | null;
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
  console.log(",,",data);
  const session = await requireHost();
  if (!session)
    return { error: "Unauthorized", message: "Please login to continue" };

  try {
    const hostProfile = await prisma.hostProfile.findUnique({
      where: { hostId: session.user.id },
    });

    if (!hostProfile) {
      return {
        error: "Host profile not found",
        message: "Please complete your host profile first",
      };
    }

    console.log("Received travel plan data:", {
      title: data.title,
      description: data.description?.slice(0, 30) + "..." || "",
      noOfDays: data.noOfDays,
      filters: data.filters,
      languages: data.languages,
      status: data.status,
      dayWiseData: data.dayWiseData
        ? `${data.dayWiseData.length} days`
        : "none",
    });

    if (data.dayWiseData && data.dayWiseData.length > 0) {
      console.log(
        "Received day-wise data details:",
        JSON.stringify(data.dayWiseData, null, 2)
      );
    } else {
      console.log("WARNING: No day-wise data received or the array is empty");
    }

    console.log("🔍 DEBUG ACTION: Received status =", data.status);
    console.log("🔍 DEBUG ACTION: TravelPlanStatus enum values:", {
      DRAFT: TravelPlanStatus.DRAFT,
      ACTIVE: TravelPlanStatus.ACTIVE,
      INACTIVE: TravelPlanStatus.INACTIVE,
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

    // Handle price conversion with fallback for drafts
    const price = isNaN(Number(data.price)) ? 0 : Number(data.price);
    console.log("Processed price:", price);

    // Handle noOfDays with fallback for drafts
    const noOfDays =
      isNaN(data.noOfDays) || data.noOfDays <= 0 ? 1 : data.noOfDays;
    console.log("Processed noOfDays:", noOfDays);

    // Handle maxParticipants with fallback for drafts
    const maxParticipants = isNaN(Number(data.maxParticipants))
      ? 0
      : Number(data.maxParticipants);
    console.log("Processed maxParticipants:", maxParticipants);

    const travelPlan = await prisma.travelPlans.create({
      data: {
        title: data.title || "Untitled Trip",
        description: data.description || "",
        includedActivities: data.includedActivities || [],
        notIncludedActivities: [], // Required field that was missing
        destination: data.destination || "",
        startDate: data.startDate,
        endDate: data.endDate,
        restrictions: data.restrictions || [],
        special: data.special || [],
        noOfDays: noOfDays,
        price: price,
        maxParticipants: maxParticipants,
        country: data.country || "",
        state: data.state || "",
        city: data.city || "",
        languages: data.languages || [],
        filters: data.filters || [],
        tripImage: data.tripImage || "https://avatar.iran.liara.run/public",
        status: statusToSet,
        host: {
          connect: { hostId: hostProfile.hostId },
        },
      },
    });

    console.log(
      "🔍 DEBUG ACTION: Travel plan created with status:",
      travelPlan.status
    );

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
                dayData.dayWiseImage || "https://avatar.iran.liara.run/public",
            },
          });

          console.log(
            `Day ${dayData.dayNumber} created successfully:`,
            createdDay.id
          );
        }

        console.log("All day-wise itineraries created successfully!");
      } catch (dayError) {
        console.error("Error creating day-wise data:", dayError);

        await prisma.travelPlans.delete({
          where: { travelPlanId: travelPlan.travelPlanId },
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
        data.status === "DRAFT"
          ? "Trip saved as draft successfully! You can continue editing it later."
          : "Travel plan created successfully! It is currently inactive. Activate it when you're ready to accept bookings.",
    };
  } catch (error) {
    console.error("Error creating travel plan:", error);

    // Provide more specific error messages
    if (error instanceof Prisma.PrismaClientValidationError) {
      return {
        error: "Validation error",
        message: "Please check all required fields and try again.",
      };
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        error: "Database error",
        message: "There was a problem saving your trip. Please try again.",
      };
    }

    return {
      error: "Failed to create travel plan",
      message: "An unexpected error occurred. Please try again.",
    };
  }
};

export const getAllTrips = async () => {
  const session = await requireHost();
  if (!session) return { error: "Unauthorized" };

  try {
    const hostProfile = await prisma.hostProfile.findUnique({
      where: { hostId: session.user.id },
    });

    if (!hostProfile) {
      return { error: "Host profile not found" };
    }

    const trips = await prisma.travelPlans.findMany({
      where: {
        hostId: hostProfile.hostId,
      },
      include: {
        dayWiseItinerary: {
          orderBy: {
            dayNumber: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the data to match our Trip type
    const transformedTrips = trips.map((trip) => ({
      ...trip,
      dayWiseData:
        trip.dayWiseItinerary?.map((day) => ({
          dayNumber: day.dayNumber,
          title: day.title,
          description: day.description,
          activities: day.activities,
          meals: day.meals,
          accommodation: day.accommodation,
          dayWiseImage: day.dayWiseImage,
        })) || [],
    }));

    return { success: true, trips: transformedTrips };
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
    special?: string[] | "";
    noOfDays?: number;
    price?: number;
    startDate?: Date | null;
    endDate?: Date | null;
    maxParticipants?: number;
    country?: string;
    state?: string;
    city?: string;
    activities?: string[];

    filters?: string[];
    languages?: string[];
    status?: "ACTIVE" | "INACTIVE" | "DRAFT";
    destination?: string;
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
  }
) => {
  const session = await requireHost();
  if (!session) return { error: "Unauthorized" };

  try {
    const hostProfile = await prisma.hostProfile.findUnique({
      where: { hostId: session.user.id },
    });

    if (!hostProfile) {
      return { error: "Host profile not found" };
    }

    const existingPlan = await prisma.travelPlans.findUnique({
      where: { travelPlanId: id },
    });

    if (!existingPlan || existingPlan.hostId !== hostProfile.hostId) {
      return { error: "Travel plan not found or unauthorized access" };
    }

    // Extract dayWiseData from the data object
    const { dayWiseData, ...travelPlanData } = data;

    // Prepare the update data with proper handling of all fields
    const updateData: Prisma.TravelPlansUpdateInput = {};

    if (travelPlanData.title !== undefined)
      updateData.title = travelPlanData.title;
    if (travelPlanData.description !== undefined)
      updateData.description = travelPlanData.description;
    if (travelPlanData.includedActivities !== undefined)
      updateData.includedActivities = travelPlanData.includedActivities;
    if (travelPlanData.restrictions !== undefined)
      updateData.restrictions = travelPlanData.restrictions;
    if (travelPlanData.noOfDays !== undefined)
      updateData.noOfDays = Number(travelPlanData.noOfDays);
    if (travelPlanData.price !== undefined)
      updateData.price = Number(travelPlanData.price);
    if (travelPlanData.startDate !== undefined)
      updateData.startDate = travelPlanData.startDate;
    if (travelPlanData.endDate !== undefined)
      updateData.endDate = travelPlanData.endDate;
    if (travelPlanData.maxParticipants !== undefined)
      updateData.maxParticipants = Number(travelPlanData.maxParticipants);
    if (travelPlanData.country !== undefined)
      updateData.country = travelPlanData.country;
    if (travelPlanData.state !== undefined)
      updateData.state = travelPlanData.state;
    if (travelPlanData.city !== undefined)
      updateData.city = travelPlanData.city;
    if (travelPlanData.filters !== undefined)
      updateData.filters = travelPlanData.filters;
    if (travelPlanData.languages !== undefined)
      updateData.languages = travelPlanData.languages;
    if (travelPlanData.destination !== undefined)
      updateData.destination = travelPlanData.destination;
    if (travelPlanData.tripImage !== undefined)
      updateData.tripImage = travelPlanData.tripImage;
    if (travelPlanData.status !== undefined) {
      if (travelPlanData.status === "DRAFT") {
        updateData.status = TravelPlanStatus.DRAFT;
      } else if (travelPlanData.status === "ACTIVE") {
        updateData.status = TravelPlanStatus.ACTIVE;
      } else {
        updateData.status = TravelPlanStatus.INACTIVE;
      }
    }

    // Update the travel plan
    const updatedPlan = await prisma.travelPlans.update({
      where: { travelPlanId: id },
      data: updateData,
    });

    // Handle day-wise data update if provided
    if (dayWiseData && dayWiseData.length > 0) {
      // Delete existing day-wise data
      await prisma.dayWiseItinerary.deleteMany({
        where: { travelPlanId: id },
      });

      // Create new day-wise data
      await prisma.dayWiseItinerary.createMany({
        data: dayWiseData.map((day) => ({
          travelPlanId: id,
          dayNumber: day.dayNumber,
          title: day.title || `Day ${day.dayNumber}`,
          description: day.description || "",
          activities: Array.isArray(day.activities) ? day.activities : [],
          meals: day.meals || "",
          accommodation: day.accommodation || "",
          dayWiseImage:
            day.dayWiseImage || "https://avatar.iran.liara.run/public",
        })),
      });
    }

    return {
      success: true,
      updatedPlan,
      message:
        data.status === "DRAFT"
          ? "Trip draft updated successfully!"
          : "Travel plan updated successfully!",
    };
  } catch (error) {
    console.error("Error updating travel plan:", error);

    // Provide more specific error messages
    if (error instanceof Prisma.PrismaClientValidationError) {
      return {
        error: "Validation error",
        message: "Please check all required fields and try again.",
      };
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        error: "Database error",
        message: "There was a problem updating your trip. Please try again.",
      };
    }

    return {
      error: "Failed to update travel plan",
      message: "An unexpected error occurred while updating. Please try again.",
    };
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
      where: { hostId: session.user.id },
    });

    if (!hostProfile) {
      return { error: "Host profile not found" };
    }

    // Check if the travel plan exists and belongs to the host
    const existingPlan = await prisma.travelPlans.findUnique({
      where: { travelPlanId: id },
      select: { hostId: true, status: true },
    });

    if (!existingPlan || existingPlan.hostId !== hostProfile.hostId) {
      return { error: "Travel plan not found or unauthorized access" };
    }

    // Update the travel plan and keep it as DRAFT
    const updatedPlan = await prisma.travelPlans.update({
      where: { travelPlanId: id },
      data: {
        ...data,
        status: "DRAFT", // Keep as draft
      },
    });

    return {
      success: true,
      updatedPlan,
      message: "Draft saved successfully",
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
      where: { hostId: session.user.id },
    });

    if (!hostProfile) {
      return { error: "Host profile not found" };
    }

    const existingPlan = await prisma.travelPlans.findUnique({
      where: { travelPlanId: id },
      include: {
        bookings: {
          where: {
            status: { in: ["CONFIRMED", "PENDING"] },
          },
        },
      },
    });

    if (!existingPlan || existingPlan.hostId !== hostProfile.hostId) {
      return { error: "Travel plan not found or unauthorized access" };
    }

    // Get the current trip to check its status
    const currentTrip = await prisma.travelPlans.findUnique({
      where: { travelPlanId: id },
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
        status: newStatus,
      },
    });

    const message =
      currentTrip.status === "DRAFT"
        ? "Draft trip completed and submitted for admin verification. It will be active after admin approval."
        : "Travel plan submitted for verification. It will be active after admin approval. Existing bookings remain unaffected.";

    return {
      success: true,
      updatedPlan,
      message,
      existingBookingsCount: existingPlan.bookings.length,
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
      where: { hostId: session.user.id },
    });

    if (!hostProfile) {
      return { error: "Host profile not found" };
    }

    const trip = await prisma.travelPlans.findUnique({
      where: { travelPlanId: tripId },
      include: {
        dayWiseItinerary: {
          orderBy: {
            dayNumber: "asc",
          },
        },
      },
    });

    if (!trip || trip.hostId !== hostProfile.hostId) {
      return { error: "Trip not found or access denied" };
    }

    // Transform the data to match the form structure
    const transformedTrip = {
      ...trip,
      dayWiseData: trip.dayWiseItinerary.map((day) => ({
        dayNumber: day.dayNumber,
        title: day.title,
        description: day.description,
        activities: day.activities,
        meals: day.meals || "",
        accommodation: day.accommodation || "",
        dayWiseImage: day.dayWiseImage || "",
      })),
    };

    return transformedTrip;
  } catch (error) {
    console.error("Error fetching trip by ID:", error);
    return { error: "Failed to fetch trip" };
  }
};

export const getHostBookings = async (
  statusFilter?: string,
  selectedTripId?: string,
  filterType: "booking" | "payment" = "booking"
) => {
  const session = await requireHost();
  if (!session) return { error: "Unauthorized" };

  try {
    const hostProfile = await prisma.hostProfile.findUnique({
      where: { hostId: session.user.id },
    });

    if (!hostProfile) {
      return { error: "Host profile not found" };
    }

    // Get all active travel plans by this host
    const travelPlans = await prisma.travelPlans.findMany({
      where: {
        hostId: hostProfile.hostId,
        status: "ACTIVE",
      },
      select: {
        travelPlanId: true,
        title: true,
        startDate: true,
        endDate: true,
        maxParticipants: true,
        destination: true,
        tripImage: true,
      },
      orderBy: {
        startDate: "asc",
      },
    });

    const travelPlanIds = travelPlans.map((plan) => plan.travelPlanId);

    // Build where clause for bookings
    const whereClause: Prisma.BookingWhereInput = {
      travelPlanId: { in: travelPlanIds },
    };

    // Add trip filter if provided
    if (selectedTripId) {
      whereClause.travelPlanId = selectedTripId;
    }

    // Add status filter if provided
    if (statusFilter && statusFilter !== "ALL") {
      if (filterType === "payment") {
        whereClause.paymentStatus = statusFilter as PaymentStatus;
      } else {
        whereClause.status = statusFilter as BookingStatus;
      }
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
            image: true,
          },
        },
        travelPlan: {
          select: {
            travelPlanId: true,
            title: true,
            destination: true,
            startDate: true,
            endDate: true,
            price: true,
            tripImage: true,
            maxParticipants: true,
          },
        },
        guests: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get booking counts by status (for selected trip if specified)
    const bookingCountsWhere = selectedTripId
      ? { travelPlanId: selectedTripId }
      : { travelPlanId: { in: travelPlanIds } };

    const bookingCounts = await prisma.booking.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
      where: bookingCountsWhere,
    });

    const counts = {
      ALL: 0,
      PENDING: 0,
      CONFIRMED: 0,
      CANCELLED: 0,
      REFUNDED: 0,
      NOTPAID: 0,
    };

    bookingCounts.forEach((count) => {
      counts[count.status] = count._count.id;
      counts.ALL += count._count.id;
    });

    // Calculate confirmed participants for each trip
    const tripsWithBookingData = await Promise.all(
      travelPlans.map(async (trip) => {
        const confirmedBookings = await prisma.booking.findMany({
          where: {
            travelPlanId: trip.travelPlanId,
            status: "CONFIRMED",
          },
          select: {
            participants: true,
          },
        });

        const confirmedParticipants = confirmedBookings.reduce(
          (sum, booking) => sum + booking.participants,
          0
        );
        const remainingSeats = Math.max(
          0,
          (trip.maxParticipants || 50) - confirmedParticipants
        );

        return {
          ...trip,
          confirmedParticipants,
          remainingSeats,
        };
      })
    );

    return {
      success: true,
      bookings,
      counts,
      trips: tripsWithBookingData,
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
      where: { hostId: session.user.id },
    });

    if (!hostProfile) {
      return { error: "Host profile not found" };
    }

    // Get all travel plans by this host
    const travelPlans = await prisma.travelPlans.findMany({
      where: { hostId: hostProfile.hostId },
      select: { travelPlanId: true },
    });

    const travelPlanIds = travelPlans.map((plan) => plan.travelPlanId);

    // Get bookings by payment status
    const fullyPaidBookings = await prisma.booking.aggregate({
      _sum: {
        totalPrice: true,
        amountPaid: true,
      },
      _count: {
        id: true,
      },
      where: {
        travelPlanId: { in: travelPlanIds },
        paymentStatus: "FULLY_PAID",
      },
    });

    const partiallyPaidBookings = await prisma.booking.aggregate({
      _sum: {
        totalPrice: true,
        amountPaid: true,
        remainingAmount: true,
      },
      _count: {
        id: true,
      },
      where: {
        travelPlanId: { in: travelPlanIds },
        paymentStatus: "PARTIALLY_PAID",
      },
    });

    const pendingPaymentBookings = await prisma.booking.aggregate({
      _sum: {
        totalPrice: true,
      },
      _count: {
        id: true,
      },
      where: {
        travelPlanId: { in: travelPlanIds },
        paymentStatus: "PENDING",
      },
    });

    const overdueBookings = await prisma.booking.aggregate({
      _sum: {
        totalPrice: true,
      },
      _count: {
        id: true,
      },
      where: {
        travelPlanId: { in: travelPlanIds },
        paymentStatus: "OVERDUE",
      },
    });

    const cancelledBookings = await prisma.booking.aggregate({
      _sum: {
        totalPrice: true,
        refundAmount: true,
      },
      _count: {
        id: true,
      },
      where: {
        travelPlanId: { in: travelPlanIds },
        paymentStatus: "CANCELLED",
      },
    });

    const refundedBookings = await prisma.booking.aggregate({
      _sum: {
        refundAmount: true,
      },
      _count: {
        id: true,
      },
      where: {
        travelPlanId: { in: travelPlanIds },
        paymentStatus: "REFUNDED",
      },
    });

    // Get monthly revenue trend (last 6 months) based on payment status
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // Get all bookings from last 6 months with payment status
    const monthlyBookings = await prisma.booking.findMany({
      where: {
        travelPlanId: { in: travelPlanIds },
        createdAt: { gte: sixMonthsAgo },
      },
      select: {
        totalPrice: true,
        amountPaid: true,
        paymentStatus: true,
        createdAt: true,
      },
    });

    // Group bookings by month and payment status
    const monthlyRevenue: Array<{
      month: string;
      year: number;
      monthNum: number;
      fullyPaidRevenue: number;
      partiallyPaidRevenue: number;
      pendingRevenue: number;
      totalBookings: number;
    }> = [];
    const monthlyData: {
      [key: string]: {
        fullyPaidRevenue: number;
        partiallyPaidRevenue: number;
        pendingRevenue: number;
        totalBookings: number;
      };
    } = {};

    monthlyBookings.forEach((booking) => {
      const date = new Date(booking.createdAt);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          fullyPaidRevenue: 0,
          partiallyPaidRevenue: 0,
          pendingRevenue: 0,
          totalBookings: 0,
        };
      }

      monthlyData[monthKey].totalBookings += 1;

      if (booking.paymentStatus === "FULLY_PAID") {
        monthlyData[monthKey].fullyPaidRevenue += booking.totalPrice || 0;
      } else if (booking.paymentStatus === "PARTIALLY_PAID") {
        monthlyData[monthKey].partiallyPaidRevenue += booking.amountPaid || 0;
      } else if (booking.paymentStatus === "PENDING") {
        monthlyData[monthKey].pendingRevenue += booking.totalPrice || 0;
      }
    });

    // Convert to array format for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      monthlyRevenue.push({
        month: monthKey,
        year: date.getFullYear(),
        monthNum: date.getMonth(),
        fullyPaidRevenue: monthlyData[monthKey]?.fullyPaidRevenue || 0,
        partiallyPaidRevenue: monthlyData[monthKey]?.partiallyPaidRevenue || 0,
        pendingRevenue: monthlyData[monthKey]?.pendingRevenue || 0,
        totalBookings: monthlyData[monthKey]?.totalBookings || 0,
      });
    }

    // Calculate metrics based on payment status
    const totalFullyPaidRevenue = fullyPaidBookings._sum.totalPrice || 0;
    const totalPartiallyPaidValue = partiallyPaidBookings._sum.totalPrice || 0;
    const totalAmountReceived =
      (fullyPaidBookings._sum.amountPaid || 0) +
      (partiallyPaidBookings._sum.amountPaid || 0);
    const totalPendingAmount = partiallyPaidBookings._sum.remainingAmount || 0;
    const totalPendingValue = pendingPaymentBookings._sum.totalPrice || 0;
    const totalOverdueValue = overdueBookings._sum.totalPrice || 0;
    const totalCancelledValue = cancelledBookings._sum.totalPrice || 0;

    // Total revenue = All money from bookings regardless of payment status
    const totalRevenue =
      totalFullyPaidRevenue +
      totalPartiallyPaidValue +
      totalPendingValue +
      totalOverdueValue +
      totalCancelledValue;

    // Received revenue = Actual money in hand
    const receivedRevenue = totalAmountReceived;

    // Pending revenue = Money still to be collected from partially paid + pending
    const pendingRevenue = totalPendingAmount + totalPendingValue;

    // Revenue at risk = Overdue + cancelled bookings (money we might never collect)
    const revenueAtRisk = totalOverdueValue + totalCancelledValue;

    // Collection efficiency = How much we've collected vs total expected
    const collectionEfficiency =
      totalRevenue > 0 ? (receivedRevenue / totalRevenue) * 100 : 0;

    return {
      success: true,
      revenueData: {
        fullyPaid: {
          revenue: totalFullyPaidRevenue,
          bookingCount: fullyPaidBookings._count.id || 0,
        },
        partiallyPaid: {
          revenue: totalPartiallyPaidValue,
          amountReceived: partiallyPaidBookings._sum.amountPaid || 0,
          remainingAmount: totalPendingAmount,
          bookingCount: partiallyPaidBookings._count.id || 0,
        },
        pending: {
          bookingValue: totalPendingValue,
          bookingCount: pendingPaymentBookings._count.id || 0,
        },
        overdue: {
          bookingValue: totalOverdueValue,
          bookingCount: overdueBookings._count.id || 0,
        },
        cancelled: {
          bookingValue: totalCancelledValue,
          refundAmount: cancelledBookings._sum.refundAmount || 0,
          bookingCount: cancelledBookings._count.id || 0,
        },
        refunded: {
          refundAmount: refundedBookings._sum.refundAmount || 0,
          bookingCount: refundedBookings._count.id || 0,
        },
        summary: {
          totalRevenue: Math.round(totalRevenue),
          receivedRevenue: Math.round(receivedRevenue),
          pendingRevenue: Math.round(pendingRevenue),
          revenueAtRisk: Math.round(revenueAtRisk),
          collectionEfficiency: Math.round(collectionEfficiency * 10) / 10, // Round to 1 decimal place
        },
        monthlyTrend: monthlyRevenue,
      },
    };
  } catch (error) {
    console.error("Error calculating revenue analytics:", error);
    return { error: "Failed to calculate revenue analytics" };
  }
};
