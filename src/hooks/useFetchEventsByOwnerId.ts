"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";
import { useAuth } from "../app/[locale]/Auth/useAuth";
import { useSupabase } from "../context/SupabaseProvider";

const fetchEventsByOwnerId = async (
  ownerId: string,
  currentPage: number,
  resultsPerPage: number,
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
    .range((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage - 1)
    .select();

  if (error) throw error;
  return data;
};

const useFetchEventsByOwnerId = (
  currentPage: number,
  resultsPerPage: number
) => {
  const { user } = useAuth();
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["events", user?.id, currentPage, resultsPerPage],
    queryFn: () =>
      fetchEventsByOwnerId(user?.id, currentPage, resultsPerPage, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchEventsByOwnerId;
