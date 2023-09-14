"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";
import { useSupabase } from "../context/SupabaseProvider";

const fetchBillingByOwnerId = async (
  ownerId: string,
  supabase: SupabaseClient<any>
) => {
  const { data, error } = await supabase
    .from("billing_info")
    .select(`*`)
    .eq("owner_id", ownerId);

  if (error) throw error;

  return data;
};

const useFetchBillingByOwnerId = (ownerId: string) => {
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["billingAddresses", ownerId],
    queryFn: () => fetchBillingByOwnerId(ownerId, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchBillingByOwnerId;
