"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";
import { useAuth } from "../components/Auth";
import { useSupabase } from "../components/Context/SupabaseProvider";

const fetchEventsByOwnerId = async (
  ownerId: string,
  currentPage: number,
  pageRange: number,
  supabase: SupabaseClient<any>
) => {
  if (!ownerId) return [];

  const { data, error } = await supabase
    .from("events")
    .select(
      `
      *
    `
    )
    .eq("owner_id", ownerId)
    .range((currentPage - 1) * pageRange, currentPage * pageRange - 1)
    .select();

  if (error) throw error;
  return data;
};

const useFetchEventsByOwnerId = (currentPage: number, pageRange: number) => {
  const { user } = useAuth();
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["events", user?.id, currentPage, pageRange],
    queryFn: () =>
      fetchEventsByOwnerId(user?.id, currentPage, pageRange, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchEventsByOwnerId;
