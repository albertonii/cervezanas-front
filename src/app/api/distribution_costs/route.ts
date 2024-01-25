import { NextRequest, NextResponse } from "next/server";
import { DeliveryType } from "../../../lib/enums";
import createServerClient from "../../../utils/supabaseServer";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const distributorId = requestUrl.searchParams.get("distributor_id");
  const deliveryType = requestUrl.searchParams.get("delivery_type");

  if (distributorId) {
    const supabase = await createServerClient();

    if (deliveryType === DeliveryType.FLATRATE_INTERNATIONAL) {
      const { error, data: distributionCost } = await supabase
        .from("distribution_costs")
        .select(
          `
          id,
          created_at,
          distributor_id,
          flatrate_cost (
             international_distribution_cost
          )
        `
        )
        .eq("distributor_id", distributorId)
        .single();

      if (error) throw new Error(error.message);

      if (distributionCost) {
        return NextResponse.json(
          distributionCost.flatrate_cost[0].international_distribution_cost
        );
      }
    }
  }

  console.error("ERROR: Invalid distributor id or id not found");

  return NextResponse.redirect(`${requestUrl.origin}`);
}
