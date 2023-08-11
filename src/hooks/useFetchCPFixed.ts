"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";
import { useSupabase } from "../components/Context/SupabaseProvider";

const fetchCPFixed = async (
  cpId: string,
  currentPage: number,
  resultsPerPage: number,
  supabase: SupabaseClient<any>
) => {
  const { data, error } = await supabase
    .from("cp_fixed")
    .select(
      `
      *
    `
    )
    .eq("cp_id", cpId)
    .range((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage - 1)
    .select();

  if (error) throw error;

  return data;
};

const useFetchCPFixed = (
  cpId: string,
  currentPage: number,
  resultsPerPage: number
) => {
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["cpFixed", cpId, currentPage, resultsPerPage],
    queryFn: () => fetchCPFixed(cpId, currentPage, resultsPerPage, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchCPFixed;
