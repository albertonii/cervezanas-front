"use server";

import {
  CookieOptions,
  createServerClient as createServerComponentClient,
} from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "../lib/schema";

export async function createSupabaseAppServerClient(serverComponent = false) {
  const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseURL || !supabaseAnonKey) {
    throw new Error("Missing env variables");
  }

  return createServerComponentClient<Database>(supabaseURL, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookies().get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        if (serverComponent) return;
        cookies().set(name, value, options);
      },
      remove(name: string, options: CookieOptions) {
        if (serverComponent) return;
        cookies().set(name, "", options);
      },
    },
  });
}

export default async function createServerClient() {
  return createSupabaseAppServerClient(true);
}
