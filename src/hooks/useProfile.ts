"use client";

import { SupabaseClient } from "@supabase/supabase-js";
import { useQuery } from "react-query";
import { useAuth } from "../app/[locale]/Auth/useAuth";
import { Database } from "../lib/schema";

// NOT USED NOW
const getProfile = async (supabase: SupabaseClient<Database>, id: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("username, name, lastname, birthdate")
    .eq("id", id);

  if (error) {
    alert(error.message);
    throw error;
  }

  return data;
};

export function useProfile() {
  const { user, supabase } = useAuth();

  return useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(supabase, user?.id),
    enabled: false,
    refetchOnWindowFocus: false,
  });
}
