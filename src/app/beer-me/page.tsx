import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { VIEWS } from "../../constants";
import { IConsumptionPoints } from "../../lib/types.d";
import Beerme from "./Beerme";

export default async function BeerMePage() {
  const { cps } = await getCPsData();
  if (!cps) return null;

  return (
    <>
      <Beerme cps={cps} />
    </>
  );
}

async function getCPsData() {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: VIEWS.ROUTE_SIGNIN,
        permanent: false,
      },
    };

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

  return { cps: cps as IConsumptionPoints[] };
}
