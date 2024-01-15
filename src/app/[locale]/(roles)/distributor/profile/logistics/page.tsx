import readUserSession from "../../../../../../lib/actions";
import CoverageLayout from "./CoverageLayout";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../constants";
import createServerClient from "../../../../../../utils/supabaseServer";
import { IDistributionCost } from "../../../../../../lib/types";

export default async function OrdersPage() {
  const distributionCosts = await getDistributionCost();

  return <CoverageLayout distributionCosts={distributionCosts} />;
}

async function getDistributionCost() {
  const {
    data: { session },
  } = await readUserSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  const supabase = await createServerClient();

  const { data: distributionCosts, error: distributionCostsError } =
    await supabase
      .from("distribution_costs")
      .select(
        `
          id,
          created_at,
          distributor_id,
          flatrate_cost (
             created_at,
             distribution_costs_id,
             local_distribution_cost,
             national_distribution_cost,
             europe_distribution_cost,
             international_distribution_cost,
             is_checked_local,
             is_checked_national,
             is_checked_europe,
             is_checked_international
          )
        `
      )
      .eq("distributor_id", session.user.id)
      .single();

  if (distributionCostsError) throw distributionCostsError;

  return distributionCosts as IDistributionCost;
}
