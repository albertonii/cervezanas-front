import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";

const intlMiddleware = createMiddleware({
  locales: ["es", "en"],
  defaultLocale: "es",
});

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest) {
  // const response = intlMiddleware(req);

  const { headers, geo, nextUrl, cookies } = req;

  // Cloned url to work with
  const url = nextUrl.clone();

  const language =
    headers
      .get("accept-language")
      ?.split(",")?.[0]
      .split("-")?.[0]
      .toLowerCase() || "en";
  const country = geo?.country?.toLowerCase() || "es";

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
    url.pathname = `/${language}/signin`;
    return NextResponse.redirect(url);
  }

  try {
    // Early return if it is a public file such as an image
    if (PUBLIC_FILE.test(nextUrl.pathname)) {
      return undefined;
    }
    // Early return if this is an api route
    if (nextUrl.pathname.includes("/api")) {
      return undefined;
    }

    // Early return if we are on a locale other than default
    if (nextUrl.locale !== "default") {
      return undefined;
    }

    // Early return if there is a cookie present and on default locale
    if (cookies.NEXT_LOCALE && nextUrl.locale === "default") {
      url.pathname = `/${cookies.NEXT_LOCALE}${nextUrl.pathname}`;
      return NextResponse.redirect(url);
    }

    // We now know:
    // No cookie that we need to deal with
    // User has to be on default locale

    // Redirect All Spanish
    if (country === "es") {
      url.pathname = `/es${nextUrl.pathname}`;
      return NextResponse.redirect(url);
    }

    // Handle Spanish language fallback
    if (language === "es") {
      url.pathname = `/es${nextUrl.pathname}`;
      return NextResponse.redirect(url);
    }

    // Handle English language fallback
    if (language === "en") {
      url.pathname = `/en${nextUrl.pathname}`;
      return NextResponse.redirect(url);
    }

    // Handle the default locale fallback to english
    if (nextUrl.locale === "default") {
      url.pathname = `/es${nextUrl.pathname}`;
      return NextResponse.redirect(url);
    }

    return res;
  } catch (error) {
    console.log(error);
  }
}

export const config = {
  matcher: [
    "/((?!api|_next|.*\\..*).*)",
    "/cart/shopping_basket/:path*",
    "/profile/:path*",
  ],
};
