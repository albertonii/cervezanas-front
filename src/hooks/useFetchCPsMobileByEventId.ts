"use client";

import { useQuery } from "react-query";
import { ICPM_events } from "../lib/types.d";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "../app/[locale]/Auth/useAuth";

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
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ["cpm_events"],
    queryFn: () => fetchCPSMobileByEventId(eventId, supabase),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchCPSMobileByEventsId;
