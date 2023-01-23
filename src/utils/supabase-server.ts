import { headers, cookies } from "next/headers";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";

import type { Database } from "../lib/database.types";

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const createServerClient = () => {
  return createServerComponentSupabaseClient<Database>({
    supabaseUrl: supabaseUrl,
    supabaseKey: supabaseAnonKey,
    headers,
    cookies,
  });
};
