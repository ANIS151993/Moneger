import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/income", "/expenses", "/debts", "/owed", "/banks", "/settings"];

export function middleware(request: NextRequest) {
  const isProtected = protectedRoutes.some((path) => request.nextUrl.pathname.startsWith(path));
  const hasSession = request.cookies.get("moneger_session")?.value === "active";

  if (isProtected && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/income/:path*", "/expenses/:path*", "/debts/:path*", "/owed/:path*", "/banks/:path*", "/settings/:path*"]
};
