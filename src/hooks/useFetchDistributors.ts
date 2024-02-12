"use client";

import { useQuery } from "react-query";
import { IDistributorUser } from "../lib/types.d";
import { useAuth } from "../app/[locale]/Auth/useAuth";
import { SupabaseClient } from "@supabase/supabase-js";

const fetchDistributors = async (supabase: SupabaseClient<any>) => {
  const { data, error } = await supabase.from("distributor_user").select(
    `
        *,
        users (*)
      `
  );
  // .eq("role", "distributor");
  if (error) throw error;

  return data as IDistributorUser[];

};

const useFetchDistributors = () => {
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ["distributors"],
    queryFn: () => fetchDistributors(supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchDistributors;
