"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useMutation, UseMutationResult } from "react-query";
import { useSupabase } from "../context/SupabaseProvider";
import { ICustomizeSettings } from "../lib/types";

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
    .eq("id", customSettingsId)
    .single();

  if (error) throw error;
  return data as ICustomizeSettings;
};

const useUpdateColors = (
  colors: string[],
  customSettingsId: string
): UseMutationResult<any> => {
  const { supabase } = useSupabase();
  return useMutation(() => updateColors(colors, customSettingsId, supabase));
};

export default useUpdateColors;
