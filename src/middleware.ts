import { NextResponse } from "next/server";
import { auth } from "./config/auth";
import { Role } from "./types/auth";
import { hasRole } from "./lib/roleGaurd";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;
  const path = nextUrl.pathname;

  const pathToRoleMap: Record<string, Role[]> = {
    "/dashboard/admin": ["ADMIN"],
    "/dashboard/host": ["HOST", "ADMIN"],
    "/dashboard/users": ["USER", "HOST", "ADMIN"],
  };

  const requiredRoles = pathToRoleMap[path];

  if (!requiredRoles) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const redirectUrl = new URL("/auth/signin", nextUrl.origin);
    redirectUrl.searchParams.set("callbackUrl", encodeURIComponent(path));
    return NextResponse.redirect(redirectUrl);
  }

  const userRole = session.user.role as Role;
  if (!hasRole(userRole, requiredRoles)) {
    return NextResponse.redirect(new URL("/unauthorized", nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|auth).*)",
  ],
};
