"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";
import { useSupabase } from "../components/Context/SupabaseProvider";

const fetchProductById = async (
  productId: string,
  supabase: SupabaseClient<any>
) => {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
    *,
    beers (*),
    product_multimedia (
      p_principal
    ),
    product_inventory (
      quantity
    )
  `
    )
    .eq("id", productId);

  if (error) throw error;

  return data;
};

const useFetchProductById = (productId: string) => {
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["product_id"],
    queryFn: () => fetchProductById(productId, supabase),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchProductById;
