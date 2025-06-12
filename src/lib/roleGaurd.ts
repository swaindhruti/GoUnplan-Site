import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import { Role } from "@/types/auth";

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
  return await requireRole(["USER", "HOST", "ADMIN"]);
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
