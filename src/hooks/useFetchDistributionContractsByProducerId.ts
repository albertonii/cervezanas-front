"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";
import { useSupabase } from "../components/Context/SupabaseProvider";
import { IDistributionContract, IDistributorUser_Profile } from "../lib/types";

const fetchDistributionContracts = async (
  producerId: string,
  supabase: SupabaseClient<any>
) => {
  const { data, error } = await supabase
    .from("distribution_contracts")
    .select(
      `
        distributor_id (
          *,
          users (*)
        ),
        producer_id,
        created_at,
        status,
        producer_accepted,
        distributor_accepted,
        message
      `
    )
    .eq("producer_id", producerId);

  if (error) throw error;
  return data as any[] as IDistributionContract[];
};

const useFetchDistributionContracts = (producerId: string) => {
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["distributionContract"],
    queryFn: () => fetchDistributionContracts(producerId, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchDistributionContracts;
