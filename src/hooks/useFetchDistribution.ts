"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery, UseQueryResult } from "react-query";
import { useAuth } from "../app/[locale]/Auth/useAuth";
import { useSupabase } from "../context/SupabaseProvider";
import { IDistribution } from "../lib/types.d";

const fetchDistributionByOwnerId = async (
  userId: string,
  supabase: SupabaseClient<any>
) => {
  if (!userId) return;
  const { data, error } = await supabase
    .from("distributor_user")
    .select(
      `*,
      coverage_areas (*,
        local_distribution(*))
      `
    )
    .eq("user", userId);

  if (error) throw error;
  return data[0];
};

const useFetchDistributionByOwnerId = (): UseQueryResult<
  IDistribution,
  unknown
> => {
  const { user } = useAuth();

  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["distribution", user?.id],
    queryFn: () => fetchDistributionByOwnerId(user?.id, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchDistributionByOwnerId;
