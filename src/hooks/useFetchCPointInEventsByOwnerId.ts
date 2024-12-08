'use client';

import { useQuery } from 'react-query';
import { Database } from '@/lib/schema';
import { SupabaseClient } from '@supabase/supabase-js';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';

const fetchCPointInEventsByOwnerId = async (
    ownerId: string,
    currentPage: number,
    resultsPerPage: number,
    supabase: SupabaseClient<Database>,
) => {
    const { data, error } = await supabase
        .from('cp_events')
        .select(
            `
                *,
                cp (*),
                events (id,name)
            `,
        )
        .eq('owner_id', ownerId)
        .range(
            (currentPage - 1) * resultsPerPage,
            currentPage * resultsPerPage - 1,
        )
        .order('created_at', { ascending: false });

    if (error) throw error;

    return data as IConsumptionPointEvent[];
};

const useFetchCPointInEventsByOwnerId = (
    ownerId: string,
    currentPage: number,
    resultsPerPage: number,
) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: 'cp_events',
        queryFn: () =>
            fetchCPointInEventsByOwnerId(
                ownerId,
                currentPage,
                resultsPerPage,
                supabase,
            ),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchCPointInEventsByOwnerId;
