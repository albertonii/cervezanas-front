"use client";

import { useQuery } from "react-query";
import { useSupabase } from "../components/Context/SupabaseProvider";

const fetchProducts = async () => {
  const { supabase } = useSupabase();

  const { data, error } = await supabase.from("beers").select(`
    *,
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
  return useQuery("beers", fetchProducts);
};

export default useFetchProducts;
