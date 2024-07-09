import { NextRequest, NextResponse } from 'next/server';

import {
    CookieOptions,
    createServerClient as createServerComponentClient,
} from '@supabase/ssr';
import { getCookie, setCookie } from 'cookies-next';
import { Database } from '../lib/schema';

// Since Server Components can't write cookies, you need middleware to refresh expired Auth tokens and store them.
export function createSupabaseReqResClient(
    req: NextRequest,
    res: NextResponse,
) {
    const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseURL || !supabaseAnonKey) {
        throw new Error('Missing env variables');
    }
    return createServerComponentClient<Database>(supabaseURL, supabaseAnonKey, {
        cookies: {
            get(name: string) {
                return getCookie(name, { req, res });
            },
            set(name: string, value: string, options: CookieOptions) {
                // Set the auth cookie with HttpOnly and Secure flags
                // const secure = process.env.NODE_ENV === 'production';

                // const cookieOptions = {
                //     ...options,
                //     secure,
                //     httpOnly: true,
                //     sameSite: 'lax',
                // };

                setCookie(name, value, { req, res, ...options });
            },
            remove(name: string, options: CookieOptions) {
                setCookie(name, '', { req, res, ...options });
            },
        },
    });
}
