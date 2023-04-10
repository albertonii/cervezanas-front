import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;
import { ROUTE_SIGNIN, ROUTE_SIGNUP } from "./config";

export async function middleware(req: NextRequest) {
  const authCookie = req.cookies.get("sb-access-token");
  // console.log(authCookie);
  // if (
  //   !authCookie ||
  //   !(await jwt.verify(authCookie.value, process.env.SUPABASE_JWT_SECRET!))
  // ) {
  //   return NextResponse.redirect(new URL(ROUTE_SIGNIN, req.url)); // If a user is not authenticated (either no token was send, or the token is invalid) redirect the user to the homepage where they will be presented with a log-in screen
  // }

  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.includes("/api/") ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return;
  }
  if (req.nextUrl.locale === "default") {
    const locale = req.cookies.get("NEXT_LOCALE") || "es";
    return NextResponse.redirect(
      new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
    );
  }

  if (req.nextUrl.pathname.startsWith(ROUTE_SIGNIN)) {
    if (authCookie) return NextResponse.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname.startsWith(ROUTE_SIGNUP)) {
    if (authCookie) return NextResponse.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/profile")) {
    if (!authCookie)
      return NextResponse.redirect(new URL(ROUTE_SIGNIN, req.url));
  }

  if (req.nextUrl.pathname.startsWith("/marketplace")) {
    if (!authCookie)
      return NextResponse.redirect(new URL(ROUTE_SIGNIN, req.url));
  }

  if (req.nextUrl.pathname.startsWith("/cart/shopping_basket")) {
    if (!authCookie)
      return NextResponse.redirect(new URL(ROUTE_SIGNIN, req.url));
  }
}
