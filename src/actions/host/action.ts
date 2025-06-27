"use server";

import prisma from "@/lib/prisma";
import { requireHost } from "@/lib/roleGaurd";
import { TravelPlanStatus } from "../../../db/generated/prisma";

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

export const getHostTravelPlansByStatus = async (status: TravelPlanStatus) => {
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
}) => {
  const session = await requireHost();
  if (!session) return { error: "Unauthorized" };
  console.log("m", data.country);

  try {
    console.log(session);
    const hostProfile = await prisma.hostProfile.findUnique({
      where: { hostId: session.user.id },
    });
    const hostProfiles = await prisma.hostProfile.findMany();

    console.log(hostProfiles);

    if (!hostProfile) {
      return { error: "Host profile not found" };
    }
    console.log("mm", data.startDate, data.endDate);

    const travelPlan = await prisma.travelPlans.create({
      data: {
        title: data.title,
        description: data.description,
        includedActivities: data.includedActivities,
        destination: data.destination,
        startDate: data.startDate,
        endDate: data.endDate,
        restrictions: data.restrictions,
        noOfDays: data.noOfDays,
        hostId: hostProfile.hostId,
        price: data.price,
        maxParticipants: data.maxParticipants,
        country: data.country,
        state: data.state,
        city: data.city,
        status: TravelPlanStatus.INACTIVE,
      },
    });

    return {
      success: true,
      travelPlan,
      message:
        "Travel plan created successfully! It is currently inactive. Activate it when you're ready to accept bookings.",
    };
  } catch (error) {
    console.error("Error creating travel plan:", error);
    return { error: "Failed to create travel plan" };
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
      orderBy: {
        createdAt: "desc",
      },
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

    // Update the travel plan
    const updatedPlan = await prisma.travelPlans.update({
      where: { travelPlanId: id },
      data: {
        ...data,
      },
    });

    return {
      success: true,
      updatedPlan,
      message: "Travel plan updated successfully!",
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
      where: { hostId: session.user.id },
    });

    if (!hostProfile) {
      return { error: "Host profile not found" };
    }

    const trip = await prisma.travelPlans.findUnique({
      where: { travelPlanId: tripId },
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
