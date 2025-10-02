"use server";

import { auth } from "@/config/auth";
import prisma from "@/lib/prisma";

export async function testSupportServerAction() {
  console.log("🧪 testSupportServerAction - Starting server action test");

  try {
    // Direct auth check
    const session = await auth();
    console.log("🧪 Session in server action:", {
      hasSession: !!session,
      userEmail: session?.user?.email,
      userRole: session?.user?.role,
    });

    if (!session?.user?.email) {
      console.log("🧪 No session/email in server action");
      return { error: "No session", step: "auth_check" };
    }

    // Database check
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true, email: true, id: true },
    });

    console.log("🧪 Database user in server action:", {
      dbUser: dbUser,
      hasDbUser: !!dbUser,
      dbRole: dbUser?.role,
    });

    if (!dbUser) {
      console.log("🧪 No database user found");
      return { error: "User not found in database", step: "db_check" };
    }

    if (dbUser.role !== "SUPPORT" && dbUser.role !== "ADMIN") {
      console.log("🧪 Invalid role in server action:", dbUser.role);
      return { error: "Invalid role", role: dbUser.role, step: "role_check" };
    }

    console.log("🧪 Server action test successful");
    return {
      success: true,
      session: {
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      },
      dbUser: {
        email: dbUser.email,
        role: dbUser.role,
        id: dbUser.id,
      },
    };
  } catch (error) {
    console.error("🧪 Server action test error:", error);
    return { error: String(error), step: "exception" };
  }
}
