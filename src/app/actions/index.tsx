"use server";

import createServerClient from "../../utils/supabaseServer";

export default async function readUserSession() {
  const supabase = await createServerClient();
  return supabase.auth.getSession();
}
