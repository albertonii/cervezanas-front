"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useMutation, UseMutationResult } from "react-query";
import { useSupabase } from "../components/Context/SupabaseProvider";

const updateColors = async (
  colors: string[],
  customSettingsId: string,
  supabase: SupabaseClient<any>
) => {
  const { data, error } = await supabase
    .from("customize_settings")
    .update({
      colors: colors,
    })
    .eq("id", customSettingsId);

  if (error) throw error;
  return data;
};

const useUpdateColors = (
  colors: string[],
  customSettingsId: string
): UseMutationResult<any> => {
  const { supabase } = useSupabase();
  return useMutation(() => updateColors(colors, customSettingsId, supabase));
};

export default useUpdateColors;
