"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";
import { useSupabase } from "../components/Context/SupabaseProvider";

const fetchCPMobile = async (
  cpId: string,
  currentPage: number,
  pageRange: number,
  supabase: SupabaseClient<any>
) => {
  const { data, error } = await supabase
    .from("cp_mobile")
    .select(
      `
      *
    `
    )
    .eq("cp_id", cpId)
    .range((currentPage - 1) * pageRange, currentPage * pageRange - 1)
    .select();

  if (error) throw error;

  return data;
};

const useFetchCPMobile = (
  cpId: string,
  currentPage: number,
  pageRange: number
) => {
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["cpMobile", cpId, currentPage, pageRange],
    queryFn: () => fetchCPMobile(cpId, currentPage, pageRange, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchCPMobile;
