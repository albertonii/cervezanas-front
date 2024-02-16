import { NextRequest, NextResponse } from 'next/server';
import createServerClient from '../../../../utils/supabaseServer';

/**
 *
 * @param request The Next.js Auth Helpers are configured to use the PKCE auth flow as of version 0.7.0, and require us to setup a Code Exchange route in order to exchange
 * an auth code for the user's session, which is set as a cookie for future requests made to Supabase.
 * @returns
 */
export async function GET(request: NextRequest, response: NextResponse) {
  console.log(request);
  console.log(response);
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createServerClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      console.error(error);
      // return NextResponse.redirect(requestUrl.origin);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // return the user to an error page with instructions
  // return NextResponse.redirect(requestUrl.origin);
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
