"use client";

import { IBeer } from "../lib/types";
import { useQuery } from "react-query";
import { useAuth } from "../app/[locale]/Auth/useAuth";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../lib/schema";

const fetchBeers = async (supabase: SupabaseClient<Database>) => {
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
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ["beers"],
    queryFn: () => fetchBeers(supabase),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchBeers;
