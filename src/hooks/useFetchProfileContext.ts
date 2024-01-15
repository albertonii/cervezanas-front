"use client";

import { IUser } from "../lib/types";
import { useQuery } from "react-query";
import { useAuth } from "../app/[locale]/Auth/useAuth";
import { SupabaseClient } from "@supabase/supabase-js";

const fetchProfileContext = async (
  supabase: SupabaseClient<any>,
  userId?: string
) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data as IUser;
};

const useFetchProfileContext = (userId?: string) => {
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ["profile-context"],
    queryFn: () => fetchProfileContext(supabase, userId),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchProfileContext;
