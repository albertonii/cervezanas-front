'use client';

import { ICustomizeSettings } from '@/lib//types/types';
import { useQuery, UseQueryResult } from 'react-query';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib//schema';

const fetchCustomSettingsById = async (
    userId: string,
    supabase: SupabaseClient<Database>,
) => {
    const { data, error } = await supabase
        .from('customize_settings')
        .select('*')
        .eq('owner_id', userId)
        .single();

    if (error) throw error;
    return data as ICustomizeSettings;
};

const useFetchCustomSettings = (
    userId: string,
): UseQueryResult<ICustomizeSettings, unknown> => {
    const { supabase } = useAuth();
    return useQuery({
        queryKey: 'customSettings',
        queryFn: () => fetchCustomSettingsById(userId, supabase),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchCustomSettings;
