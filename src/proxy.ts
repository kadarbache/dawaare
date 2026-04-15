import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  // Optimistically check for the session cookie
  const sessionCookie = getSessionCookie(request);

  const isLoginPage = request.nextUrl.pathname === "/login";

  // If no session exists and user is not on the login page, redirect to login
  if (!sessionCookie && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If session exists and user is on the login page, redirect to dashboard
  if (sessionCookie && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except api, _next/static, _next/image, and favicon.ico
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
