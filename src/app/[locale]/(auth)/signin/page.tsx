import { redirect } from "next/navigation";
import { createServerClient } from "../../../../utils/supabaseServer";
import SignIn from "./SignIn";

export default async function SignInPage() {
  const supabase = createServerClient();

  const { data } = await supabase.auth.getSession();
  if (data?.session) {
    redirect("/es");
  }

  return (
    <>
      <SignIn />
    </>
  );
}
