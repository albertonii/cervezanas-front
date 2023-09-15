"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";
import { useSupabase } from "../context/SupabaseProvider";
import { IBeer } from "../lib/types";

const fetchBeers = async (supabase: SupabaseClient<any>) => {
  const { data, error } = await supabase.from("beers").select(`
    *,
    product_multimedia (
      p_principal
    ),product_inventory (
      quantity
    )
  `);

  if (error) throw error;

  return data as IBeer[];
};

const useFetchBeers = () => {
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["beers"],
    queryFn: () => fetchBeers(supabase),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchBeers;
