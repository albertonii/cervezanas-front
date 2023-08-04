import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../constants";
import { createServerClient } from "../../../../../../utils/supabaseServer";
import { Factories } from "./Factories";

export default async function FactoriesPage() {
  //   const {} = await getFactoriesData();

  return (
    <>
      <Factories></Factories>
    </>
  );
}

async function getFactoriesData() {
  const supabase = createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  return {};
}
