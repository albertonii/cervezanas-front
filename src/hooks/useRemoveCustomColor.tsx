"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useMutation, useQueryClient } from "react-query";
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
