import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { AUTH_ROLE_COOKIE, AUTH_TOKEN_COOKIE } from "@/lib/auth/constants";
import type { AuthRole } from "@/lib/auth/session";
import { routing } from "@/src/i18n/routing";

const handleInternationalization = createMiddleware(routing);

const studentRoutes = [
  "/dashboard",
  "/upload",
  "/orders",
  "/courses",
  "/assignments",
  "/notifications",
  "/profile",
  "/wallet",
  "/subscriptions",
  "/trials",
];

function routeStartsWith(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

function pathContext(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const legacyLocale = segments[0] === "ar" || segments[0] === "en"
    ? segments.shift()
    : null;
  return {
    legacyLocale,
    pathname: segments.length ? `/${segments.join("/")}` : "/",
  };
}

function roleHome(role: AuthRole) {
  return (
    role === "admin"
      ? "/admin/dashboard"
      : role === "instructor"
        ? "/instructor/tasks"
        : "/dashboard"
  );
}

function redirectToLogin(
  request: NextRequest,
  loginPath: string,
) {
  const url = request.nextUrl.clone();
  const next = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  url.pathname = loginPath;
  url.search = "";
  url.searchParams.set("next", next);
  return NextResponse.redirect(url);
}

export default function proxy(request: NextRequest) {
  const { legacyLocale, pathname } = pathContext(request.nextUrl.pathname);

  if (legacyLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    return NextResponse.redirect(url, 308);
  }

  // Demo mode: bypass auth guard so CodeCanyon reviewers & demo visitors can view admin/instructor/student pages
  if (process.env.DEMO_MODE === "true") {
    return handleInternationalization(request);
  }

  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const cookieRole = request.cookies.get(AUTH_ROLE_COOKIE)?.value;
  const role: AuthRole | null =
    cookieRole === "student" ||
    cookieRole === "instructor" ||
    cookieRole === "admin"
      ? cookieRole
      : null;
  const isAuthenticated = Boolean(token && role);

  if (routeStartsWith(pathname, "/admin")) {
    if (!isAuthenticated) {
      return redirectToLogin(request, "/auth/instructor/login");
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL(roleHome(role!), request.url));
    }
  }

  if (routeStartsWith(pathname, "/instructor")) {
    if (!isAuthenticated) {
      return redirectToLogin(request, "/auth/instructor/login");
    }
    if (role !== "instructor") {
      return NextResponse.redirect(new URL(roleHome(role!), request.url));
    }
  }

  if (studentRoutes.some((route) => routeStartsWith(pathname, route))) {
    if (!isAuthenticated) {
      return redirectToLogin(request, "/auth/student/login");
    }
    if (role !== "student") {
      return NextResponse.redirect(new URL(roleHome(role!), request.url));
    }
  }

  if (routeStartsWith(pathname, "/chat") && !isAuthenticated) {
    return redirectToLogin(request, "/auth/student/login");
  }

  return handleInternationalization(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};