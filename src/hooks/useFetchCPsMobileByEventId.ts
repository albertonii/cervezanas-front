"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";
import { useSupabase } from "../components/Context/SupabaseProvider";

const fetchCPSMobileByEventId = async (
  eventId: string,
  supabase: SupabaseClient<any>
) => {
  if (!eventId) return [];

  const { data, error } = await supabase
    .from("cpm_events")
    .select(
      `
      *,
      cp_id (id, name)
    `
    )
    .eq("event_id", eventId)
    .select();

  if (error) throw error;

  return data;
};

const useFetchEvents = (eventId: string) => {
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["cpm_events"],
    queryFn: () => fetchCPSMobileByEventId(eventId, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchEvents;
