import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest) {
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

  if (req.nextUrl.pathname.startsWith("/signin")) {
    const authCookie = req.cookies.get("sb-access-token");
    if (authCookie) return NextResponse.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/signup")) {
    const authCookie = req.cookies.get("sb-access-token");
    if (authCookie) return NextResponse.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/profile")) {
    const authCookie = req.cookies.get("sb-access-token");
    if (!authCookie) return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/marketplace")) {
    const authCookie = req.cookies.get("sb-access-token");
    if (!authCookie) return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/cart/shopping_basket")) {
    const authCookie = req.cookies.get("sb-access-token");
    if (!authCookie) return NextResponse.redirect(new URL("/signin", req.url));
  }
}
