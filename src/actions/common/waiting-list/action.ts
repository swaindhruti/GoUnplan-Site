"use server";

import prisma from "@/lib/prisma";

export const addEmailToWaitingList = async (email: string) => {
  try {
    const existingEntry = await prisma.waitingList.findUnique({
      where: { email },
    });

    if (existingEntry) {
      return {
        success: false,
        message: "Email already exists in the waiting list.",
      };
    }

    const newEntry = await prisma.waitingList.create({
      data: { email },
    });

    return { success: true, data: newEntry };
  } catch (error) {
    console.error("Error adding email to waiting list:", error);
    return { success: false, message: "Failed to add email to waiting list." };
  }
};

export const getWaitingListCount = async () => {
  try {
    const count = await prisma.waitingList.count();
    return { success: true, count };
  } catch (error) {
    console.error("Error fetching waiting list count:", error);
    return { success: false, message: "Failed to fetch waiting list count." };
  }
};

export const getWaitingListEmails = async () => {
  try {
    const emails = await prisma.waitingList.findMany({
      select: { email: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, emails };
  } catch (error) {
    console.error("Error fetching waiting list emails:", error);
    return { success: false, message: "Failed to fetch waiting list emails." };
  }
};
