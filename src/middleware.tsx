import Negotiator from "negotiator";
import { ROUTE_SIGNIN } from "./config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "./lib/translations/i18n";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import { isPrivateSectionIncluded } from "./utils/middleware/functions";
import { createSupabaseReqResClient } from "./utils/supabaseReqResClient";

const locales = ["en", "es"];

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return matchLocale(languages, locales, i18n.defaultLocale);
}

// this middleware refreshes the user's session and must be run
// for any Server Component route that uses `createServerComponentSupabaseClient`
export async function middleware(req: NextRequest) {
  ("user server");

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
    // The new URL is now /es/products
    return NextResponse.redirect(new URL(`/${locale}/${pathname}`, req.url));
  }

  const isIncluded = await isPrivateSectionIncluded(req);

  if (isIncluded) {
    // We need to create a response and hand it to the supabase client to be able to modify the response headers.
    const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseURL || !supabaseAnonKey) {
      throw new Error("Missing env variables");
    }

    const supabase = createSupabaseReqResClient(req, res);

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

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
