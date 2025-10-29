import { type NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const authRoutes = ["/login", "/register"];
const publicRoutes = [...authRoutes, "/", "/about"];

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // 未登录
  if (!sessionCookie && !publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL(`/login?redirect=${request.nextUrl.pathname}`, request.url));
  }

  // 已登录
  if (sessionCookie && authRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
