import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// const PUBLIC_FILE = /\.(.*)$/;

// export async function middleware(req: NextRequest, ev: NextFetchEvent) {
// if (
//   req.nextUrl.pathname.startsWith("/_next") ||
//   req.nextUrl.pathname.includes("/api/") ||
//   PUBLIC_FILE.test(req.nextUrl.pathname)
// ) {
//   return;
// }
// if (req.nextUrl.locale === "default") {
//   const locale = req.cookies.get("NEXT_LOCALE") || "es";
//   return NextResponse.redirect(
//     new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
//   );
// }
// if (req.nextUrl.pathname.startsWith("/profile")) {
//   const authCookie = req.cookies.get("sb-access-token");
//   if (!authCookie) return NextResponse.redirect(new URL("/signin", req.url));
// }
// if (req.nextUrl.pathname.startsWith("/marketplace")) {
//   const authCookie = req.cookies.get("sb-access-token");
//   if (!authCookie) return NextResponse.redirect(new URL("/signin", req.url));
// }
// }

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/marketplace")) {
    return NextResponse.rewrite(new URL("/marketplace", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.rewrite(new URL("/dashboard/user", request.url));
  }
}
