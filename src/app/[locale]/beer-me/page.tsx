import Beerme from "./Beerme";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../constants";
import { IConsumptionPoints } from "../../../lib/types.d";
import { createServerClient } from "../../../utils/supabaseServer";

export default async function BeerMePage() {
  const cpsData = getCPsData();
  const [cps] = await Promise.all([cpsData]);

  if (!cps) return null;

  return (
    <>
      <Beerme cps={cps} />
    </>
  );
}

async function getCPsData() {
  // Create authenticated Supabase Client
  const supabase = createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  const { data: cps, error: cpsError } = await supabase
    .from("consumption_points")
    .select(
      `
          *,
        cp_fixed (
          *
        ),
        cp_mobile (
          *
        )
    `
    );
  if (cpsError) throw cpsError;

  return cps as IConsumptionPoints[];
}
