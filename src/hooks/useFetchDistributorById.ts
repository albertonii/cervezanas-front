"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";
import { useSupabase } from "../components/Context/SupabaseProvider";
import { IDistributorUser_Profile } from "../lib/types";

const fetchDistributorById = async (
  supabase: SupabaseClient<any>,
  distributorId: string
) => {
  const { data, error } = await supabase
    .from("users")
    .select(
      `
        *,
        distributor_user (*),
        profile_location (
          name, 
          lastname, 
          document_id, 
          company, 
          phone, 
          postalcode, 
          country,
          province,address_1, 
          address_2,
          town)
      `
    )
    .eq("id", distributorId);

  if (error) throw error;

  return data[0] as IDistributorUser_Profile;
};

const useFetchDistributorById = (distributorId: string) => {
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["distributorById", distributorId],
    queryFn: () => fetchDistributorById(supabase, distributorId),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchDistributorById;