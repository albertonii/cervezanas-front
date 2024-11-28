'use client';

import { useQuery } from 'react-query';
import { Database } from '@/lib/schema';
import { SupabaseClient } from '@supabase/supabase-js';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { IConsumptionPoint } from '@/lib/types/consumptionPoints';

const fetchCPointsById = async (
    cpId: string,
    currentPage: number,
    resultsPerPage: number,
    supabase: SupabaseClient<Database>,
) => {
    const { data, error } = await supabase
        .from('cp')
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

    return data as IConsumptionPoint[];
};

const useFetchCPointsById = (
    cpId: string,
    currentPage: number,
    resultsPerPage: number,
) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: 'consumption_points',
        queryFn: () =>
            fetchCPointsById(cpId, currentPage, resultsPerPage, supabase),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchCPointsById;
