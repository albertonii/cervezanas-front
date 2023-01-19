import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import NextAuth from "next-auth/next";
import Providers from "next-auth/providers";

const PUBLIC_FILE = /\.(.*)$/;

// export async function middleware(req: NextRequest, ev: NextFetchEvent) {
//   const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//   if (
//     req.nextUrl.pathname.startsWith("/_next") ||
//     req.nextUrl.pathname.includes("/api/") ||
//     PUBLIC_FILE.test(req.nextUrl.pathname)
//   ) {
//     return;
//   }

//   if (req.nextUrl.locale === "default") {
//     const locale = req.cookies.get("NEXT_LOCALE") || "es";

//     return NextResponse.redirect(
//       new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
//     );
//   }

//   // if (req.nextUrl.pathname.startsWith("/profile")) {
//   //   const authCookie = req.cookies.get("sb-access-token");
//   //   if (!authCookie) return NextResponse.redirect(new URL("/signin", req.url));
//   // }

//   // if (req.nextUrl.pathname.startsWith("/marketplace")) {
//   //   const authCookie = req.cookies.get("sb-access-token");
//   //   if (!authCookie) return NextResponse.redirect(new URL("/signin", req.url));
//   // }
// }

export { default } from "next-auth/middleware";

// Matching Paths for secure pages
export const config = {
  matcher: ["/profile", "/marketplace"],
};
