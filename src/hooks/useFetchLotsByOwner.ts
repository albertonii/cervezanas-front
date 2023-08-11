"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";
import { useSupabase } from "../components/Context/SupabaseProvider";

const fetchLotsByOwner = async (
  ownerId: string,
  currentPage: number,
  resultsPerPage: number,
  supabase: SupabaseClient<any>
) => {
  const { data, error } = await supabase
    .from("product_lot")
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

  return data;
};

const useFetchLotsByOwnerAndPagination = (
  ownerId: string,
  currentPage: number,
  resultsPerPage: number
) => {
  const { supabase } = useSupabase();
  return useQuery({
    queryKey: ["productLotList", ownerId, currentPage, resultsPerPage],
    queryFn: () =>
      fetchLotsByOwner(ownerId, currentPage, resultsPerPage, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchLotsByOwnerAndPagination;
