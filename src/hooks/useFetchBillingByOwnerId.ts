"use client";

import { useQuery } from "react-query";
import { IBillingInfo } from "../lib/types";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "../app/[locale]/Auth/useAuth";

const fetchBillingByOwnerId = async (
  ownerId: string,
  supabase: SupabaseClient<any>
) => {
  const { data, error } = await supabase
    .from("billing_info")
    .select(`*`)
    .eq("owner_id", ownerId);

  if (error) throw error;

  return data as IBillingInfo[];
};

const useFetchBillingByOwnerId = (ownerId: string) => {
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ["billingAddresses", ownerId],
    queryFn: () => fetchBillingByOwnerId(ownerId, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchBillingByOwnerId;
