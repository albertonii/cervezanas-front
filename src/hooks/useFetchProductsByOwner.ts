"use client";

import { useQuery } from "react-query";
import { IProduct } from "../lib/types";
import { useAuth } from "../app/[locale]/Auth/useAuth";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

const fetchProductsByOwner = async (
  ownerId: string,
  supabase: SupabaseClient<any>
) => {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
          *, 
          product_multimedia (*),
          product_inventory (*),
          likes (*),
          product_lots (*),
          beers (*),
          product_packs (*)
        `,
      {
        count: "exact",
      }
    )
    .eq("owner_id", ownerId);

  if (error) throw error;

  return data as IProduct[];
};

const useFetchProductsByOwner = (ownerId: string) => {
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ["productListByOwner", ownerId],
    queryFn: () => fetchProductsByOwner(ownerId, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchProductsByOwner;
