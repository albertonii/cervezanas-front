'use client';

import { useQuery } from 'react-query';
import { ICPFixed } from '@/lib//types/types';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { SupabaseClient } from '@supabase/supabase-js';

const fetchCPFixed = async (
    cpId: string,
    currentPage: number,
    resultsPerPage: number,
    supabase: SupabaseClient<any>,
) => {
    const { data, error } = await supabase
        .from('cp_fixed')
        .select(
            `
      *
    `,
        )
        .eq('cp_id', cpId)
        .range(
            (currentPage - 1) * resultsPerPage,
            currentPage * resultsPerPage - 1,
        )
        .order('created_at', { ascending: false });

    if (error) throw error;

    return data as ICPFixed[];
};

const useFetchCPFixed = (
    cpId: string,
    currentPage: number,
    resultsPerPage: number,
) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: ['cpFixed', cpId, currentPage, resultsPerPage],
        queryFn: () =>
            fetchCPFixed(cpId, currentPage, resultsPerPage, supabase),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchCPFixed;
