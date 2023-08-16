import { redirect } from "next/navigation";
import { createServerClient } from "../../../../../utils/supabaseServer";

export default async function ServerProfilePage() {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/unauthenticated");
  }

  return (
    <div>
      <h1>Accede con tu usuario para poder ver esta sección</h1>
    </div>
  );
}
