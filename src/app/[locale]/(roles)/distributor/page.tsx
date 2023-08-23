import { redirect } from "next/navigation";
import { VIEWS } from "../../../../constants";
import { createServerClient } from "../../../../utils/supabaseServer";

export default async function ServerProfilePage() {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  return (
    <div>
      <h1>Accede con tu usuario para poder ver esta sección</h1>
    </div>
  );
}
