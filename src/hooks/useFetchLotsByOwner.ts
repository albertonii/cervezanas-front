"use client";

import { useQuery } from "react-query";
import { IProductLot } from "../lib/types";
import { useAuth } from "../app/[locale]/Auth/useAuth";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../lib/schema";

const fetchLotsByOwner = async (
  ownerId: string,
  currentPage: number,
  resultsPerPage: number,
  supabase: SupabaseClient<Database>
) => {
  const { data, error } = await supabase
    .from("product_lots")
    .select(
      `
        *,
        products (id, name)
      `,
      {
        count: "exact",
      }
    )
    .eq("owner_id", ownerId)
    .range(
      (currentPage - 1) * resultsPerPage,
      currentPage * resultsPerPage - 1
    );

  if (error) throw error;

  return data as IProductLot[];
};

const useFetchLotsByOwnerAndPagination = (
  ownerId: string,
  currentPage: number,
  resultsPerPage: number
) => {
  const { supabase } = useAuth();
  return useQuery({
    queryKey: ["productLotList", ownerId, currentPage, resultsPerPage],
    queryFn: () =>
      fetchLotsByOwner(ownerId, currentPage, resultsPerPage, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchLotsByOwnerAndPagination;
