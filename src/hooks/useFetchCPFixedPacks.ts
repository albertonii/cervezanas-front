'use client';

import { SupabaseClient } from '@supabase/supabase-js';
import { useQuery } from 'react-query';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { Database } from '@/lib//schema';
import { ICPMProductsEditCPMobileModal } from '@/lib//types/types';

const fetchCPFixedPacks = async (
    cpId: string,
    supabase: SupabaseClient<Database>,
) => {
    const { data, error } = await supabase
        .from('cpf_products')
        .select(
            `
       *
      `,
        )
        .eq('cp_id', cpId);

    if (error) throw error;

    return data as ICPMProductsEditCPMobileModal[];
};

const useFetchCPFixedPacks = (cpId: string) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: 'cpFixed',
        queryFn: () => fetchCPFixedPacks(cpId, supabase),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchCPFixedPacks;
