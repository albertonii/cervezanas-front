'use client';

import { SupabaseClient } from '@supabase/supabase-js';
import { useQuery } from 'react-query';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { Database } from '@/lib//schema';
import { ICPProductsEditCPModal } from '@/lib/types/consumptionPoints';

const fetchCPPacksByCPId = async (
    cpId: string,
    supabase: SupabaseClient<Database>,
) => {
    const { data, error } = await supabase
        .from('cp_products')
        .select(
            `
                *
            `,
        )
        .eq('cp_id', cpId)
        .select();
    if (error) throw error;

    return data as ICPProductsEditCPModal[];
};

const useFetchCPPacksByCPId = (cpId: string) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: 'cp_packs',
        queryFn: () => fetchCPPacksByCPId(cpId, supabase),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchCPPacksByCPId;
