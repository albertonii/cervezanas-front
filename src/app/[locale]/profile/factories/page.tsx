import { redirect } from "next/navigation";
import { ROUTE_SIGNIN } from "../../../../config";
import { VIEWS } from "../../../../constants";
import { createServerClient } from "../../../../utils/supabaseServer";

export default async function FactoriesPage() {
  //   const {} = await getFactoriesData();

  return <></>;
}

async function getFactoriesData() {
  const supabase = createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.ROUTE_SIGNIN);
  }

  return {};
}
