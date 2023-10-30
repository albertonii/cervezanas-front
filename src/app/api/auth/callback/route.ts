import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 *
 * @param request The Next.js Auth Helpers are configured to use the PKCE auth flow as of version 0.7.0, and require us to setup a Code Exchange route in order to exchange
 * an auth code for the user's session, which is set as a cookie for future requests made to Supabase.
 * @returns
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(requestUrl.origin);
}
