import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  // We need to create a response and hand it to the supabase client to be able to modify the response headers.
  const res = NextResponse.next();

  // Create authenticated Supabase Client.
  const supabase = createMiddlewareSupabaseClient({ req, res });

  // This gives us the user session and also refresh expired session tokens and set new cookie headers.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    const url = new URL(req.url);
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ["/cart/shopping_basket/:path*", "/profile/:path*"],
};

export default createMiddleware({
  // A list of all locales that are supported
  locales: ["en", "de"],

  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: "en",
});
