import Negotiator from "negotiator";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import { ROUTE_SIGNIN } from "./config";

const locales = ["en", "es"];

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return matchLocale(languages, locales, "es");
}

const privateSections = ["profile", "cart", "checkout"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const { nextUrl } = req;

  // Cloned url to work with
  const url = nextUrl.clone();

  const pathname = url.pathname;

  const locale = pathname.split("/")[1];
  const pathnameIsMissingLocale = !locales.includes(locale);

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(req);

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(new URL(`/${locale}/${pathname}`, req.url));
  }

  const urlSection = pathname.split("/")[2];

  if (privateSections.includes(urlSection)) {
    // We need to create a response and hand it to the supabase client to be able to modify the response headers.

    // Comprueba si el usuario tiene la sesión iniciada
    const supabase = createMiddlewareClient({ req, res });

    // This will update our cookie with the user session so we can know in protected routes if user is logged in
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      url.pathname = `${ROUTE_SIGNIN}`;
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export default createMiddleware({
  // A list of all locales that are supported
  locales: ["en", "es"],

  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: "es",
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
