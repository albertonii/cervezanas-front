import { RedirectType } from "next/dist/client/components/redirect";
import { permanentRedirect } from "next/navigation";
import { VIEWS } from "../../../../../constants";
import { createServerClient } from "../../../../../utils/supabaseServer";

export default async function ServerProfilePage() {
  const supabase = createServerClient();

  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    console.log("data.session", data.session);
    permanentRedirect("/marketplace", RedirectType.push);
  }

  // const 1{
  //   data: { user },
  //   error,
  // } = await supabase.auth.getUser();

  // if (error) return <div>Error</div>;

  // if (!user) {
  //   redirect("/es/marketplace", RedirectType.push);
  // }

  return (
    <div>
      <h1>Accede con tu usuario para poder ver esta sección</h1>
    </div>
  );
}
