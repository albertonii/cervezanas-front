import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../constants";
import createServerClient from "../../../../../../utils/supabaseServer";
import readUserSession from "../../../../../actions";
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
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await readUserSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  return {};
}
