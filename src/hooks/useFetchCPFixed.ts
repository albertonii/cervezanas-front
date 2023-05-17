"use client";

import { useQuery } from "react-query";
import { useSupabase } from "../components/Context/SupabaseProvider";

const fetchCPFixed = async (
  cpId: string,
  currentPage: number,
  pageRange: number
) => {
  const { supabase } = useSupabase();

  const { data, error } = await supabase
    .from("cp_fixed")
    .select(
      `
      *
    `
    )
    .eq("cp_id", cpId)
    .range((currentPage - 1) * pageRange, currentPage * pageRange - 1);

  if (error) throw error;

  return data;
};

const useFetchCPFixed = (
  cpId: string,
  currentPage: number,
  pageRange: number
) => {
  return useQuery({
    queryKey: ["cp_fixed"],
    queryFn: () => fetchCPFixed(cpId, currentPage, pageRange),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchCPFixed;
