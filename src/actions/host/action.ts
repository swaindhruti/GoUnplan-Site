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
  description: string;
  includedActivities: string[];
  restrictions: string[];
  noOfDays: number;
  price: number;
  maxParticipants?: number;
  country: string;
  state: string;
  city: string;
}) => {
  const session = await requireHost();
  if (!session) return { error: "Unauthorized" };

  try {
    const hostProfile = await prisma.hostProfile.findUnique({
      where: { hostId: session.user.id },
    });

    if (!hostProfile) {
      return { error: "Host profile not found" };
    }

    const travelPlan = await prisma.travelPlans.create({
      data: {
        title: data.title,
        description: data.description,
        includedActivities: data.includedActivities,
        restrictions: data.restrictions,
        noOfDays: data.noOfDays,
        hostId: hostProfile.hostId,
        price: data.price,
        maxParticipants: data.maxParticipants,
        country: data.country,
        state: data.state,
        city: data.city,
        status: "INACTIVE",
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
