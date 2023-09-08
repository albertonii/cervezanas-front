"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";
import { useSupabase } from "../components/Context/SupabaseProvider";
import { IDistributionContract } from "../lib/types";

const fetchDistributionContracts = async (
  distributorId: string,
  supabase: SupabaseClient<any>
) => {
  const { data, error } = await supabase
    .from("distribution_contracts")
    .select(
      `
        producer_id (
          *,
          users (*)
        ),
        created_at,
        status,
        producer_accepted,
        distributor_accepted,
        message,
        distributor_id
      `
    )
    .eq("distributor_id", distributorId);

  if (error) throw error;
  return data as any[] as IDistributionContract[];
};

const useFetchDistributionContractsByDistributorId = (
  distributorId: string
) => {
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["distributionContract"],
    queryFn: () => fetchDistributionContracts(distributorId, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchDistributionContractsByDistributorId;
