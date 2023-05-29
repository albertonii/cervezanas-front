import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { RequestCookies } from "next/dist/server/web/spec-extension/cookies";

const intlMiddleware = createMiddleware({
  locales: ["es", "en"],
  defaultLocale: "es",
});

interface CustomRequestCookies extends RequestCookies {
  NEXT_LOCALE: string;
}

const PUBLIC_FILE = /\.(.*)$/;
const defaultLanguage = "es";

const redirectRules: Record<string, string> = {
  es: "/es",
};

export async function middleware(req: NextRequest) {
  // const response = intlMiddleware(req);

  const { headers, geo, nextUrl, cookies } = req;

  // Cloned url to work with
  const url = nextUrl.clone();
  const acceptLanguage = headers.get("accept-language") || "";
  const [language] = acceptLanguage.split(",")[0].split("-");

  const country = geo?.country?.toLowerCase() || "es";

  // We need to create a response and hand it to the supabase client to be able to modify the response headers.
  const res = NextResponse.next();

  // Create authenticated Supabase Client.
  const supabase = createMiddlewareSupabaseClient({ req, res });

  // This gives us the user session and also refresh expired session tokens and set new cookie headers.
  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();

  // if (!session) {
  //   url.pathname = `/${language || defaultLanguage}/signin`;
  //   return NextResponse.redirect(url);
  // }

  try {
    if (
      PUBLIC_FILE.test(nextUrl.pathname) ||
      nextUrl.pathname.includes("/api")
    ) {
      return undefined;
    }

    // Early return if we are on a locale other than default
    if (nextUrl.locale !== "default") {
      return undefined;
    }

    console.log(cookies);

    // Early return if there is a cookie present and on default locale
    if (
      (cookies as CustomRequestCookies).NEXT_LOCALE &&
      nextUrl.locale === "default"
    ) {
      url.pathname = `/${(cookies as CustomRequestCookies).NEXT_LOCALE}${
        nextUrl.pathname
      }`;
      return NextResponse.redirect(url);
    }
    // We now know:
    // No cookie that we need to deal with
    // User has to be on default locale

    if (country === "es" || language === "es") {
      url.pathname = redirectRules.es + nextUrl.pathname;
      return NextResponse.redirect(url);
    }

    url.pathname = redirectRules[defaultLanguage] + nextUrl.pathname;
    return NextResponse.redirect(url);
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
