"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";
import { useSupabase } from "../components/Context/SupabaseProvider";
import { IDistributorUser_Profile } from "../lib/types";

const fetchDistributors = async (supabase: SupabaseClient<any>) => {
  const { data, error } = await supabase
    .from("users")
    .select(
      `
        *,
        distributor_user!distributor_user_user_fkey (*)
      `
    )
    .eq("role", "distributor");
  if (error) throw error;

  return data as IDistributorUser_Profile[];
};

const useFetchDistributors = () => {
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["distributors"],
    queryFn: () => fetchDistributors(supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchDistributors;