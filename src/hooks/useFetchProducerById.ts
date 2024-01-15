"use client";

import { useQuery } from "react-query";
import { IProducerUser } from "../lib/types.d";
import { useAuth } from "../app/[locale]/Auth/useAuth";
import { SupabaseClient } from "@supabase/supabase-js";

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

  return data[0] as IProducerUser;
};

const useFetchProducerById = (producerId: string) => {
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ["producerById", producerId],
    queryFn: () => fetchProducerById(supabase, producerId),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchProducerById;
