"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";
import { useSupabase } from "../components/Context/SupabaseProvider";
import { ICPMProductsEditCPMobileModal } from "../lib/types";

const fetchCPMobile = async (cpId: string, supabase: SupabaseClient<any>) => {
  const { data, error } = await supabase
    .from("cpm_products")
    .select(
      `
       *)
      `
    )
    .eq("cp_id", cpId)
    .select();
  if (error) throw error;

  return data as ICPMProductsEditCPMobileModal[];
};

const useFetchCPMobilePacks = (cpId: string) => {
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["cpMobile", cpId],
    queryFn: () => fetchCPMobile(cpId, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchCPMobilePacks;
