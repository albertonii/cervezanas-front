"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";
import { useSupabase } from "../context/SupabaseProvider";
import { IProducerUser_Profile } from "../lib/types.d";

const fetchProducerById = async (
  supabase: SupabaseClient<any>,
  producerId: string
) => {
  const { data, error } = await supabase
    .from("users")
    .select(
      `
        *,
        producer_user (*),
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
    .eq("id", producerId);

  if (error) throw error;

  return data[0] as IProducerUser_Profile;
};

const useFetchProducerById = (producerId: string) => {
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["producerById", producerId],
    queryFn: () => fetchProducerById(supabase, producerId),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchProducerById;
