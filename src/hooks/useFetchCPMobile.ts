"use client";

import { useQuery } from "react-query";
import { useSupabase } from "../components/Context/SupabaseProvider";
import { ICPFixed } from "../lib/types.d";

const fetchCPMobile = async (
  cpId: string,
  currentPage: number,
  pageRange: number
) => {
  const { supabase } = useSupabase();

  const { data, error } = await supabase
    .from("cp_mobile")
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

const useFetchCPMobile = (
  cpId: string,
  currentPage: number,
  pageRange: number
) => {
  return useQuery<ICPFixed[]>({
    queryKey: ["cp_fixed"],
    queryFn: () => fetchCPMobile(cpId, currentPage, pageRange),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchCPMobile;
