import { NextRequest, NextResponse } from 'next/server';

import {
  CookieOptions,
  createServerClient as createServerComponentClient,
} from '@supabase/ssr';
import { getCookie, setCookie } from 'cookies-next';
import { Database } from '../lib/schema';

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
        setCookie(name, value, { req, res, ...options });
      },
      remove(name: string, options: CookieOptions) {
        setCookie(name, '', { req, res, ...options });
      },
    },
  });
}
