"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";
import { useSupabase } from "../context/SupabaseProvider";
import { IUser } from "../lib/types";

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
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["profile-context"],
    queryFn: () => fetchProfileContext(supabase, userId),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchProfileContext;
