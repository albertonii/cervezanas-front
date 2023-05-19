"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";
import { useAuth } from "../components/Auth";
import { useSupabase } from "../components/Context/SupabaseProvider";

const fetchEvents = async (
  ownerId: string,
  currentPage: number,
  pageRange: number,
  supabase: SupabaseClient<any>
) => {
  const { data, error } = await supabase
    .from("events")
    .select(
      `
      *
    `
    )
    .eq("owner_id", ownerId)
    .range((currentPage - 1) * pageRange, currentPage * pageRange - 1);

  if (error) throw error;

  return data;
};

const useFetchEvents = (currentPage: number, pageRange: number) => {
  const { user } = useAuth();
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["cp_fixed"],
    queryFn: () => fetchEvents(user.id, currentPage, pageRange, supabase),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchEvents;
