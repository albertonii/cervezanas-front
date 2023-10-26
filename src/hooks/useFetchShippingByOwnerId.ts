"use client";

import { useQuery } from "react-query";
import { IAddress } from "../lib/types";
import { useAuth } from "../app/[locale]/Auth/useAuth";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

const fetchShippingByOwnerId = async (
  ownerId: string,
  supabase: SupabaseClient<any>
) => {
  const { data, error } = await supabase
    .from("shipping_info")
    .select(`*`)
    .eq("owner_id", ownerId);

  if (error) throw error;

  return data as IAddress[];
};

const useFetchShippingByOwnerId = (ownerId: string) => {
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ["shippingAddresses", ownerId],
    queryFn: () => fetchShippingByOwnerId(ownerId, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchShippingByOwnerId;
