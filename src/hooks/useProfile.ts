"use client";

import { useQuery } from "react-query";
import { useAuth } from "../components/Auth/useAuth";
import { useSupabase } from "../components/Context/SupabaseProvider";

// NOT USED NOW
const getProfile = async (id?: string) => {
  const { supabase } = useSupabase();

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
  const { user } = useAuth();

  return useQuery(["profile", getProfile(user?.id)], {
    enabled: !!user,
  });
}
