"use client";

import { useQuery } from "react-query";
import { useAuth } from "../app/[locale]/Auth/useAuth";
import { ICPMProductsEditCPMobileModal } from "../lib/types.d";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

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
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ["cpMobile", cpId],
    queryFn: () => fetchCPMobile(cpId, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchCPMobilePacks;
