"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";
import { useSupabase } from "../context/SupabaseProvider";
import { ICPMProductsEditCPMobileModal } from "../lib/types";

const fetchCPFixedPacks = async (
  cpId: string,
  supabase: SupabaseClient<any>
) => {
  const { data, error } = await supabase
    .from("cpf_products")
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

const useFetchCPFixedPacks = (cpId: string) => {
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["cpFixed", cpId],
    queryFn: () => fetchCPFixedPacks(cpId, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchCPFixedPacks;
