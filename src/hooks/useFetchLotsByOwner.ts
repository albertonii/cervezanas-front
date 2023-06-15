"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";
import { useSupabase } from "../components/Context/SupabaseProvider";

const fetchLotsByOwner = async (
  ownerId: string,
  currentPage: number,
  pageRange: number,
  supabase: SupabaseClient<any>
) => {
  const { data, error } = await supabase
    .from("product_lot")
    .select(
      `
        *
      `,
      {
        count: "exact",
      }
    )
    .eq("owner_id", ownerId)
    .range((currentPage - 1) * pageRange, currentPage * pageRange - 1);

  if (error) throw error;

  return data;
};

const useFetchLotsByOwnerAndPagination = (
  ownerId: string,
  currentPage: number,
  pageRange: number
) => {
  const { supabase } = useSupabase();
  return useQuery({
    queryKey: ["productLotList", ownerId, currentPage, pageRange],
    queryFn: () => fetchLotsByOwner(ownerId, currentPage, pageRange, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchLotsByOwnerAndPagination;
