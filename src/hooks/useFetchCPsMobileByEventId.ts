"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";
import { useSupabase } from "../context/SupabaseProvider";
import { ICPM_events } from "../lib/types";

const fetchCPSMobileByEventId = async (
  eventId: string,
  supabase: SupabaseClient<any>
) => {
  if (!eventId) return [];

  const { data, error } = await supabase
    .from("cpm_events")
    .select(
      `
      *
      `
    )
    .eq("event_id", eventId)
    .select();

  if (error) throw error;

  return data as ICPM_events[];
};

const useFetchCPSMobileByEventsId = (eventId: string) => {
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["cpm_events"],
    queryFn: () => fetchCPSMobileByEventId(eventId, supabase),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchCPSMobileByEventsId;
