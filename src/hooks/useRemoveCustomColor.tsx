"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useMutation } from "react-query";
import { useSupabase } from "../components/Context/SupabaseProvider";

const updateColors = async (
  customSettingsId: string,
  filteredColors: string[],
  supabase: SupabaseClient<any>
) => {
  const { data, error } = await supabase
    .from("customize_settings")
    .update({
      colors: filteredColors,
    })
    .eq("id", customSettingsId);

  if (error) throw error;

  return data;
};

const useUpdateCustomColors = (
  customSettingsId: string,
  filteredColors: string[]
) => {
  const { supabase } = useSupabase();

  return useMutation({
    mutationKey: "customSettings",
    mutationFn: () => updateColors(customSettingsId, filteredColors, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useUpdateCustomColors;
