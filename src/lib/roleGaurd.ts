import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import { Role } from "@/types/auth";
import prisma from "@/lib/prisma";

export async function requireAuth() {
  const session = await auth();
  if (!session) {
    redirect("/auth/signin");
  }
  return session;
}

export async function requireRole(allowedRoles: Role[]) {
  const session = await requireAuth();

  if (!allowedRoles.includes(session.user.role)) {
    redirect("/unauthorized");
  }

  return session;
}

export async function requireAdmin() {
  return await requireRole(["ADMIN"]);
}

export async function requireHost() {
  return await requireRole(["HOST", "ADMIN"]);
}

export async function requireUser() {
  return await requireRole(["USER", "HOST", "ADMIN", "SUPPORT"]);
}

export async function requireSupport() {
  try {
    // Get current session
    const session = await auth();
    console.log("🔍 requireSupport - Session Check:", {
      hasSession: !!session,
      userEmail: session?.user?.email,
      userRole: session?.user?.role,
    });

    // Check if user is authenticated
    if (!session?.user?.email) {
      console.log(
        "❌ requireSupport - No session/email, redirecting to signin"
      );
      redirect("/auth/signin");
    }

    // Always check role directly from database to avoid JWT cache issues
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true, email: true },
    });

    console.log("🔍 requireSupport - Database Check:", {
      dbUser: dbUser,
      hasDbUser: !!dbUser,
      dbRole: dbUser?.role,
      hasValidRole:
        dbUser && (dbUser.role === "SUPPORT" || dbUser.role === "ADMIN"),
    });

    // Check if user has SUPPORT or ADMIN role in database
    if (!dbUser || (dbUser.role !== "SUPPORT" && dbUser.role !== "ADMIN")) {
      console.log(
        "❌ requireSupport - Access denied, redirecting to unauthorized"
      );
      redirect("/unauthorized");
    }

    console.log("✅ requireSupport - Access granted");

    // Return session with updated role from database
    return {
      ...session,
      user: {
        ...session.user,
        role: dbUser.role,
      },
    };
  } catch (error) {
    console.error("🚨 requireSupport - Error:", error);
    redirect("/unauthorized");
  }
}

export async function requireSupportOrAdmin() {
  // Use the same logic as requireSupport since it already checks for both SUPPORT and ADMIN
  return await requireSupport();
}

// Non-redirecting version for testing
export async function checkSupportAccess() {
  try {
    const session = await auth();
    console.log("🔍 checkSupportAccess - Session Check:", {
      hasSession: !!session,
      userEmail: session?.user?.email,
      userRole: session?.user?.role,
    });

    if (!session?.user?.email) {
      return { error: "No session", code: "NO_SESSION" };
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true, email: true },
    });

    console.log("🔍 checkSupportAccess - Database Check:", {
      dbUser: dbUser,
      hasDbUser: !!dbUser,
      dbRole: dbUser?.role,
      hasValidRole:
        dbUser && (dbUser.role === "SUPPORT" || dbUser.role === "ADMIN"),
    });

    if (!dbUser) {
      return { error: "User not found in database", code: "USER_NOT_FOUND" };
    }

    if (dbUser.role !== "SUPPORT" && dbUser.role !== "ADMIN") {
      return {
        error: "Insufficient permissions",
        code: "INVALID_ROLE",
        role: dbUser.role,
      };
    }

    console.log("✅ checkSupportAccess - Access granted");
    return {
      success: true,
      session: {
        ...session,
        user: {
          ...session.user,
          role: dbUser.role,
        },
      },
    };
  } catch (error) {
    console.error("🚨 checkSupportAccess - Error:", error);
    return {
      error: "Internal error",
      code: "INTERNAL_ERROR",
      details: String(error),
    };
  }
}

export function hasRole(userRole: Role, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(userRole);
}

export function isAdmin(userRole: Role): boolean {
  return userRole === "ADMIN";
}

export function isHost(userRole: Role): boolean {
  return userRole === "HOST";
}

export function isUser(userRole: Role): boolean {
  return userRole === "USER";
}

export function isSupport(userRole: Role): boolean {
  return userRole === "SUPPORT";
}

export function isSupportOrAdmin(userRole: Role): boolean {
  return userRole === "SUPPORT" || userRole === "ADMIN";
}
