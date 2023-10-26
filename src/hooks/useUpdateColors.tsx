"use client";

import { ICustomizeSettings } from "../lib/types";
import { useMutation, UseMutationResult } from "react-query";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "../app/[locale]/Auth/useAuth";

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
  const { supabase } = useAuth();
  return useMutation(() => updateColors(colors, customSettingsId, supabase));
};

export default useUpdateColors;
