import { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../lib/database.types";

export const createBrowserClient = () =>
  createBrowserSupabaseClient<Database>({
    supabaseUrl: supabaseUrl,
    supabaseKey: supabaseAnonKey,
  });

export const supabase: SupabaseClient = createBrowserClient();
