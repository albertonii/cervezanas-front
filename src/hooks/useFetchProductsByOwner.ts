"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";
import { useSupabase } from "../components/Context/SupabaseProvider";

const fetchProductsByOwner = async (
  ownerId: string,
  currentPage: number,
  pageRange: number,
  isArchived: boolean,
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
          product_lot (*),
          beers (*),
          product_pack (*)
        `,
      {
        count: "exact",
      }
    )
    .eq("owner_id", ownerId)
    .eq("is_archived", isArchived)
    .range((currentPage - 1) * pageRange, currentPage * pageRange - 1);

  if (error) throw error;

  return data;
};

const useFetchProducts = (
  ownerId: string,
  currentPage: number,
  pageRange: number,
  isArchived: boolean
) => {
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["products_owner"],
    queryFn: () =>
      fetchProductsByOwner(
        ownerId,
        currentPage,
        pageRange,
        isArchived,
        supabase
      ),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchProducts;
