import { createBrowserClient as createClientComponentClient } from "@supabase/ssr";
import { Database } from "../lib/schema";

export const createBrowserClient = () => {
  const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseURL || !supabaseAnonKey) {
    throw new Error("Missing env variables");
  }

  return createClientComponentClient<Database>(supabaseURL, supabaseAnonKey);
};
