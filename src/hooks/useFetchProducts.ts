"use client";

import { useQuery } from "react-query";
import { IProduct } from "../lib/types";
import { useAuth } from "../app/[locale]/Auth/useAuth";
import { SupabaseClient } from "@supabase/supabase-js";

const fetchProducts = async (supabase: SupabaseClient<any>) => {
  const { data, error } = await supabase.from("products").select(`
    *,
    beers (*),
    product_multimedia (
      p_principal
    ),
    product_inventory (
      quantity
    )
  `);

  if (error) throw error;

  return data as IProduct[];
};

const useFetchProducts = () => {
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(supabase),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchProducts;
