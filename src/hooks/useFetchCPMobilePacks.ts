'use client';

import { SupabaseClient } from '@supabase/supabase-js';
import { useQuery } from 'react-query';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { Database } from '@/lib//schema';
import { ICPMProductsEditCPMobileModal } from '@/lib//types/types';

const fetchCPMobile = async (
    cpId: string,
    supabase: SupabaseClient<Database>,
) => {
    const { data, error } = await supabase
        .from('cpm_products')
        .select(
            `
       *
      `,
        )
        .eq('cp_id', cpId)
        .select();
    if (error) throw error;

    return data as ICPMProductsEditCPMobileModal[];
};

const useFetchCPMobilePacks = (cpId: string) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: ['cpMobile', cpId],
        queryFn: () => fetchCPMobile(cpId, supabase),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchCPMobilePacks;
