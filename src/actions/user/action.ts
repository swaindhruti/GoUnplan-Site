"use server";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/roleGaurd";

export const getUserProfile = async (email: string) => {
  const session = await requireUser();
  if (!session) return { error: "Unauthorized" };

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) return { error: "User not found" };

    return { user };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { error: "Failed to fetch user profile" };
  }
};

export const updateUserProfile = async (
  email: string,
  data: { name?: string; phone?: string; bio?: string; newEmail?: string } = {}
) => {
  const session = await requireUser();
  if (!session) return { error: "Unauthorized" };

  try {
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) return { error: "User not found" };
    const NewEmail = data.newEmail ? data.newEmail.trim() : null;
    if (NewEmail && NewEmail !== email) {
      const existingUserWithNewMail = await prisma.user.findUnique({
        where: { email: NewEmail },
      });
      if (existingUserWithNewMail) return { error: "Email already in use" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name ? data.name.trim() : user.name,
        phone: data.phone ? data.phone.trim() : user.phone,
        email: NewEmail || user.email,
        bio: data.bio ? data.bio.trim() : user.bio,
      },
    });

    if (!updatedUser) return { error: "Failed to update user profile" };

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { error: "Failed to update user profile" };
  }
};

export const applyForHost = async (email: string) => {
  const session = await requireUser();
  if (!session) return { error: "Unauthorized" };

  try {
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) return { error: "User not found" };

    if (user.role === "HOST") return { error: "Already a host" };

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { appliedForHost: true },
    });

    if (!updatedUser) return { error: "Failed to apply for host" };

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error applying for host:", error);
    return { error: "Failed to apply for host" };
  }
};
