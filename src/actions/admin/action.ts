import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/roleGaurd";
import { Role } from "@/types/auth";

export const showAllUsers = async () => {
  const session = await requireAdmin();
  if (!session) return { error: "Unauthorized" };

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });
    return { users };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { error: "Failed to fetch users" };
  }
};

export const deleteUser = async (email: string) => {
  const session = await requireAdmin();
  if (!session) return { error: "Unauthorized" };

  try {
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) return { error: "User not found" };

    await prisma.user.delete({ where: { id: email } });
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { error: "Failed to delete user" };
  }
};

export const updateUserRole = async (email: string, role: Role) => {
  const session = await requireAdmin();
  if (!session) return { error: "Unauthorized" };

  try {
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) return { error: "User not found" };

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: role },
    });

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { error: "Failed to update user role" };
  }
};

export const getHostApplications = async () => {
  const session = await requireAdmin();
  if (!session) return { error: "Unauthorized" };

  try {
    const hostApplicants = await prisma.user.findMany({
      where: { appliedForHost: true },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        role: true,
      },
    });

    if (!hostApplicants || hostApplicants.length === 0) {
      return { message: "No host applications found" };
    }

    return { hostApplicants };
  } catch (error) {
    console.error("Error fetching host applications:", error);
    return { error: "Failed to fetch host applications" };
  }
};
