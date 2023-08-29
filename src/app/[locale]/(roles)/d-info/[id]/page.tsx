import React from "react";
import DistributorInformation from "./DistributorInformation";
import { createServerClient } from "../../../../../utils/supabaseServer";

export default async function page({ params }: any) {
  const { id } = params;

  const distributorData = await getDistributorProfile(id);
  const [distributor] = await Promise.all([distributorData]);

  return <DistributorInformation distributor={distributor} />;
}

async function getDistributorProfile(distributorId: string) {
  const supabase = createServerClient();

  const { data: distributor, error: distributorError } = await supabase
    .from("users")
    .select(
      `
      *,
      distributor_user (
        *
      ),
      profile_location (
        *
      )
      `
    )
    .eq("id", distributorId);

  if (distributorError) throw distributorError;

  return distributor[0];
}
