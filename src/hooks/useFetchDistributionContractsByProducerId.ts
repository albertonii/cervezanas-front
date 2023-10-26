"use client";

import { useQuery } from "react-query";
import { IDistributionContract } from "../lib/types.d";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "../app/[locale]/Auth/useAuth";

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
        message
      `
    )
    .eq("producer_id", producerId);

  /**
     * ,
        distributor_user!distribution_contracts_distributor_id_fkey (
          *
        )     
     */

  if (error) throw error;
  return data as IDistributionContract[];
};

const useFetchDistributionContracts = (producerId: string) => {
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ["distributionContract"],
    queryFn: () => fetchDistributionContracts(producerId, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchDistributionContracts;
