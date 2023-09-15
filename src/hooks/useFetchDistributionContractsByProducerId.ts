"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";
import { useSupabase } from "../context/SupabaseProvider";
import { IDistributionContract } from "../lib/types.d";

const fetchDistributionContracts = async (
  producerId: string,
  supabase: SupabaseClient<any>
) => {
  const { data, error } = await supabase
    .from("distribution_contracts")
    .select(
      `
        distributor_id ,
        producer_id,
        created_at,
        status,
        producer_accepted,
        distributor_accepted,
        message,
        distributor_user!distribution_contracts_distributor_id_fkey (
          *
        )     
      `
    )
    .eq("producer_id", producerId);

  if (error) throw error;
  return data as IDistributionContract[];
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
