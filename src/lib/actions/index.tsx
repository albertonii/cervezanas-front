"use server";

import { cookies } from "next/headers";

// Marcar que todas las funciones que se exportan en este archivo son de servidor
// por lo tanto no se ejecuta ni se envían al cliente
import createServerClient from "../../utils/supabaseServer";
import {
  createServerClient as CreateServer,
  type CookieOptions,
} from "@supabase/ssr";

export default async function readUserSession() {
  const supabase = await createServerClient();
  return supabase.auth.getSession();
}

export async function setAuthCookies() {
  // We need to create a response and hand it to the supabase client to be able to modify the response headers.

  const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseURL || !supabaseAnonKey) {
    throw new Error("Missing env variables");
  }
  const cookieStore = cookies();

  // Checks user session
  const supabase = CreateServer(supabaseURL, supabaseAnonKey, {
    cookies: {
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options });
      },
    },
  });

  return supabase;
}

export async function removeAuthCookies() {
  // We need to create a response and hand it to the supabase client to be able to modify the response headers.

  const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseURL || !supabaseAnonKey) {
    throw new Error("Missing env variables");
  }
  const cookieStore = cookies();

  // Checks user session
  const supabase = CreateServer(supabaseURL, supabaseAnonKey, {
    cookies: {
      remove(name: string, options: CookieOptions) {
        cookieStore.delete({ name, ...options });
      },
    },
  });

  return supabase;
}
