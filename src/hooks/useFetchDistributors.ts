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

  //  const { data, error } = await supabase
  //    .from("users")
  //    .select(
  //      `
  //       *,
  //       distributor_user!distributor_user_user_fkey (*)
  //     `
  //    )
  //    .eq("role", "distributor");
  //  if (error) throw error;

  //  return data as IUser[];
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
