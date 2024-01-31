"use client";

import { SupabaseClient } from "@supabase/supabase-js";
import { useQuery, UseQueryResult } from "react-query";
import { useAuth } from "../app/[locale]/Auth/useAuth";
import { IDistribution, IDistributorUser } from "../lib/types.d";

const fetchDistributionByOwnerId = async (
  userId: string,
  supabase: SupabaseClient<any>
) => {
  if (!userId) return;
  const { data, error } = await supabase
    .from("distributor_user")
    .select(
      `
      *,
      coverage_areas (
        *,
        local_distribution(*)
      )
      `
    )
    .eq("user", userId)
    .single();

  if (error) throw error;
  return data as IDistributorUser;
};

const useFetchDistributionByOwnerId = (): UseQueryResult<
  IDistribution,
  unknown
> => {
  const { user, supabase } = useAuth();

  return useQuery({
    queryKey: ["distribution", user?.id],
    queryFn: () => fetchDistributionByOwnerId(user?.id, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchDistributionByOwnerId;
