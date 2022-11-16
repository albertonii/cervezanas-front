import { supabase } from "../../utils/supabaseClient";

export default async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) console.log(error);
}
