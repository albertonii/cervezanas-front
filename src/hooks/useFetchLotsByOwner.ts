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
        *,
        products (
          *
        )
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

const useFetchLots = (
  ownerId: string,
  currentPage: number,
  pageRange: number
) => {
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["lots_owner"],
    queryFn: () => fetchLotsByOwner(ownerId, currentPage, pageRange),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchLots;
