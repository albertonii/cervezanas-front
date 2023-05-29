import Negotiator from "negotiator";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { i18n } from "./lib/translations/i18n";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import { VIEWS } from "./constants";

const locales = ["en", "es"];

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return matchLocale(languages, locales, i18n.defaultLocale);
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
    const supabase = createMiddlewareSupabaseClient({ req, res });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      url.pathname = `${VIEWS.SIGN_IN}`;
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
