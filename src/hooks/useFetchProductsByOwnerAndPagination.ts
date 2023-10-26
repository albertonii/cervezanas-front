"use client";

import { useQuery } from "react-query";
import { IProduct } from "../lib/types";
import { useAuth } from "../app/[locale]/Auth/useAuth";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

const fetchProductsByOwner = async (
  ownerId: string,
  currentPage: number,
  resultsPerPage: number,
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
          product_lots (*),
          beers (*),
          product_packs (*),
          awards(*)
        `,
      {
        count: "exact",
      }
    )
    .eq("owner_id", ownerId)
    .eq("is_archived", isArchived)
    .range(
      (currentPage - 1) * resultsPerPage,
      currentPage * resultsPerPage - 1
    );

  if (error) throw error;

  return data as IProduct[];
};

const useFetchProductsByOwnerAndPagination = (
  ownerId: string,
  currentPage: number,
  resultsPerPage: number,
  isArchived: boolean
) => {
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ["productList", ownerId, currentPage, resultsPerPage, isArchived],
    queryFn: () =>
      fetchProductsByOwner(
        ownerId,
        currentPage,
        resultsPerPage,
        isArchived,
        supabase
      ),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchProductsByOwnerAndPagination;
