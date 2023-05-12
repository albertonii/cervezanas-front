import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;
import { ROUTE_SIGNIN, ROUTE_SIGNUP } from "./config";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  // We need to create a response and hand it to the supabase client to be able to modify the response headers.
  const res = NextResponse.next();

  // Create authenticated Supabase Client.
  const supabase = createMiddlewareSupabaseClient({ req, res });

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return res;

  /*
  // Check auth condition
  if (session?.user) {
    // Authentication successful, forward request to protected route.
    return res;
  }

  if (req.nextUrl.pathname.startsWith(ROUTE_SIGNIN)) {
    if (session) return NextResponse.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname.startsWith(ROUTE_SIGNUP)) {
    if (session) return NextResponse.redirect(new URL("/", req.url));
  }

  // Auth condition not met, redirect to home page.
  const redirectUrl = req.nextUrl.clone();
  redirectUrl.pathname = ROUTE_SIGNIN;
  redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
  return NextResponse.redirect(redirectUrl);
  */
}

export const config = {
  matcher: ["/cart/shopping_basket", "/profile/:path*"],
};
