"use server";

// Marcar que todas las funciones que se exportan en este archivo son de servidor
// por lo tanto no se ejecuta ni se envían al cliente
import createServerClient from "../../utils/supabaseServer";

export default async function readUserSession() {
  const supabase = await createServerClient();
  return supabase.auth.getSession();
}
