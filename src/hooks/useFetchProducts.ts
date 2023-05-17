"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";
import { useSupabase } from "../components/Context/SupabaseProvider";

const fetchProducts = async (supabase: SupabaseClient<any>) => {
  const { data, error } = await supabase.from("products").select(`
    *,
    beers (*),
    product_multimedia (
      p_principal
    ),product_inventory (
      quantity
    )
  `);

  if (error) throw error;

  return data;
};

const useFetchProducts = () => {
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(supabase),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchProducts;
