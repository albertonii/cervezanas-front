import Negotiator from 'negotiator';
import { ROUTE_SIGNIN } from './config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import { isPrivateSectionIncluded } from './utils/middleware/functions';
import { createSupabaseReqResClient } from './utils/supabaseReqResClient';

const locales = ['en', 'es'];

function getLocale(request: NextRequest): string | undefined {
    // Negotiator expects plain object so we need to transform headers
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    // Use negotiator and intl-localematcher to get best locale
    const languages = new Negotiator({
        headers: negotiatorHeaders,
    }).languages();
    return matchLocale(languages, locales, 'es');
}

// this middleware refreshes the user's session and must be run
// for any Server Component route that uses `createServerComponentSupabaseClient`
export async function middleware(req: NextRequest) {
    ('user server');

    const res = NextResponse.next();

    const { nextUrl } = req;

    // Cloned url to work with
    const url = nextUrl.clone();

    const pathname = url.pathname;
    const locale = pathname.split('/')[1];
    const pathnameIsMissingLocale = !locales.includes(locale);

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        const locale = getLocale(req);
        // e.g. incoming request is /products
        // The new URL is now /es/products
        return NextResponse.redirect(
            new URL(`/${locale}/${pathname}`, req.url),
        );
    }

    // Check if the request is for accesing /profile

    const isIncluded = await isPrivateSectionIncluded(req);

    if (isIncluded) {
        // We need to create a response and hand it to the supabase client to be able to modify the response headers.
        const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseURL || !supabaseAnonKey) {
            throw new Error('Missing env variables');
        }

        // Since Server Components can't write cookies, you need middleware to refresh expired Auth tokens and store them.
        const supabase = createSupabaseReqResClient(req, res);

        const { data: session } = await supabase.auth.getSession();

        if (!session) {
            url.pathname = `${ROUTE_SIGNIN}`;
            return NextResponse.redirect(url);
        }
    }

    // Insert CORS to avoid 405 error in production
    // add the CORS headers to the response
    res.headers.append('Access-Control-Allow-Credentials', 'true');
    res.headers.append('Access-Control-Allow-Origin', '*'); // replace this your actual origin
    res.headers.append(
        'Access-Control-Allow-Methods',
        'GET,DELETE,PATCH,POST,PUT',
    );
    res.headers.append(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    );

    return res;
}

// export default createMiddleware({
//   // A list of all locales that are supported
//   locales: ['en', 'es'],

//   // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
//   defaultLocale: 'es',

// });

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)'],
};
