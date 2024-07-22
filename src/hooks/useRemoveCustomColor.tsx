'use client';

import { SupabaseClient } from '@supabase/supabase-js';
import { useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { Database } from '@/lib//schema';
import { ICustomizeSettings } from '@/lib//types/types';

const updateColors = async (
    customSettingsId: string,
    filteredColors: string[],
    supabase: SupabaseClient<Database>,
) => {
    const { data, error } = await supabase
        .from('customize_settings')
        .update({
            colors: filteredColors,
        })
        .eq('id', customSettingsId)
        .single();

    if (error) throw error;

    return data as ICustomizeSettings;
};

const useUpdateCustomColors = (
    customSettingsId: string,
    filteredColors: string[],
) => {
    const { supabase } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['removeCustomColor'],
        mutationFn: () =>
            updateColors(customSettingsId, filteredColors, supabase),
        onSuccess: () => {
            queryClient.invalidateQueries('customSettings');
        },
    });
};

export default useUpdateCustomColors;
