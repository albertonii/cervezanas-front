"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";
import { useSupabase } from "../context/SupabaseProvider";
import { IShippingAddress } from "../lib/types";

const fetchShippingByOwnerId = async (
  ownerId: string,
  supabase: SupabaseClient<any>
) => {
  const { data, error } = await supabase
    .from("shipping_info")
    .select(`*`)
    .eq("owner_id", ownerId);

  if (error) throw error;

  return data as IShippingAddress[];
};

const useFetchShippingByOwnerId = (ownerId: string) => {
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["shippingAddresses", ownerId],
    queryFn: () => fetchShippingByOwnerId(ownerId, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchShippingByOwnerId;
