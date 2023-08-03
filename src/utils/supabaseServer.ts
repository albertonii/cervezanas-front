import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "../lib/schema"

export const createServerClient = () =>
  createServerComponentClient<Database>({
    cookies,
  });
