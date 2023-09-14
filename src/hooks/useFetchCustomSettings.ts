"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery, UseQueryResult } from "react-query";
import { useSupabase } from "../context/SupabaseProvider";
import { ICustomizeSettings } from "../lib/types.d";

const fetchCustomSettingsById = async (
  userId: string,
  supabase: SupabaseClient<any>
) => {
  const { data, error } = await supabase
    .from("customize_settings")
    .select("*")
    .eq("owner_id", userId);

  if (error) throw error;
  return data;
};

const useFetchCustomSettings = (
  userId: string
): UseQueryResult<ICustomizeSettings, unknown> => {
  const { supabase } = useSupabase();
  return useQuery({
    queryKey: ["customSettings", userId],
    queryFn: () => fetchCustomSettingsById(userId, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchCustomSettings;
