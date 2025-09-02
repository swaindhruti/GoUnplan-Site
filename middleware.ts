import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/auth/signin",
    "/auth/signup",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/error",
    "/auth/phone",
    "/contact",
    "/coming-soon",
    "/unauthorized",
  ];

  // Define API routes that don't require authentication
  const publicApiRoutes = ["/api/auth", "/api/auth/signup"];

  // Allow all public routes
  if (
    publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route)
    )
  ) {
    return NextResponse.next();
  }

  // Allow all public API routes
  if (publicApiRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // For now, allow all other routes to pass through
  // In the future, you can add authentication checks here
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
