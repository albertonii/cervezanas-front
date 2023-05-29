import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { RequestCookies } from "next/dist/server/web/spec-extension/cookies";
import Negotiator from "negotiator";
import { i18n } from "./lib/translations/i18n";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import { VIEWS } from "./constants";

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
const locales = ["en", "es"];

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  const locales: string[] = ["es", "en"];
  return matchLocale(languages, locales, i18n.defaultLocale);
}

export async function middleware(req: NextRequest) {
  // const response = intlMiddleware(req);

  const { headers, geo, nextUrl, cookies } = req;

  // Cloned url to work with
  const url = nextUrl.clone();
  const acceptLanguage = headers.get("accept-language") || "";
  const [language] = acceptLanguage.split(",")[0].split("-");

  const country = geo?.country?.toLowerCase() || "es";

  const pathname = url.pathname;
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(req);

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(new URL(`/${locale}/${pathname}`, req.url));
  }

  // We need to create a response and hand it to the supabase client to be able to modify the response headers.
  const res = NextResponse.next();

  // Create authenticated Supabase Client.
  const supabase = createMiddlewareSupabaseClient({ req, res });

  // This gives us the user session and also refresh expired session tokens and set new cookie headers.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    url.pathname = `/${language || defaultLanguage}/${VIEWS.ROUTE_SIGNIN}`;
    return NextResponse.redirect(url);
  }

  try {
    if (PUBLIC_FILE.test(pathname) || pathname.includes("/api")) {
      return undefined;
    }

    // Early return if we are on a locale other than default
    if (nextUrl.locale !== "default") {
      return undefined;
    }

    // Early return if there is a cookie present and on default locale
    if (
      (cookies as CustomRequestCookies).NEXT_LOCALE &&
      nextUrl.locale === "default"
    ) {
      url.pathname = `/${
        (cookies as CustomRequestCookies).NEXT_LOCALE
      }${pathname}`;
      return NextResponse.redirect(url);
    }
    // We now know:
    // No cookie that we need to deal with
    // User has to be on default locale

    if (country === "es" || language === "es") {
      url.pathname = redirectRules.es + pathname;
      return NextResponse.redirect(url);
    }

    if (country === "en" || language === "en") {
      url.pathname = redirectRules.en + pathname;
      return NextResponse.redirect(url);
    }

    url.pathname = redirectRules[defaultLanguage] + pathname;
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
