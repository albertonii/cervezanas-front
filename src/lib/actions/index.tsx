'use server';

// Marcar que todas las funciones que se exportan en este archivo son de servidor
// por lo tanto no se ejecuta ni se envían al cliente
import createServerClient from '../../utils/supabaseServer';

export default async function readUserSession() {
  const supabase = await createServerClient();

  // Be careful when protecting pages. The server gets the user session from the cookies, which can be spoofed by anyone.
  // Always use supabase.auth.getUser() to protect pages and user data.
  // Never trust supabase.auth.getSession() inside server code such as middleware. It isn't guaranteed to revalidate the Auth token.
  // It's safe to trust getUser() because it sends a request to the Supabase Auth server every time to revalidate the Auth token.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
