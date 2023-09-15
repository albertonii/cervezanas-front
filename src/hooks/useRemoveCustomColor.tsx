"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useMutation, useQueryClient } from "react-query";
import { useSupabase } from "../context/SupabaseProvider";
import { ICustomizeSettings } from "../lib/types";

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
    .eq("id", customSettingsId)
    .single();

  if (error) throw error;

  return data as ICustomizeSettings;
};

const useUpdateCustomColors = (
  customSettingsId: string,
  filteredColors: string[]
) => {
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["removeCustomColor"],
    mutationFn: () => updateColors(customSettingsId, filteredColors, supabase),
    onSuccess: () => {
      queryClient.invalidateQueries("customSettings");
    },
  });
};

export default useUpdateCustomColors;
