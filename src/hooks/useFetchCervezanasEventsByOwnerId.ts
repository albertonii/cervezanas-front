'use client';

import { useQuery } from 'react-query';
import { Database } from '@/lib//schema';
import { SupabaseClient } from '@supabase/supabase-js';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';

const fetchCervezanasEventsByOwnerId = async (
    ownerId: string,
    currentPage: number,
    resultsPerPage: number,
    supabase: SupabaseClient<Database>,
) => {
    if (!ownerId) return [];

    const { data, error } = await supabase
        .from('cp_events')
        .select(
            `
              *,
              events (*),
              cp (*)
            `,
            {
                count: 'exact',
            },
        )
        .eq('owner_id', ownerId)
        .eq('is_cervezanas_event', true)
        .range(
            (currentPage - 1) * resultsPerPage,
            currentPage * resultsPerPage - 1,
        )
        .order('created_at', { ascending: false });

    if (error) throw error;

    return data as IConsumptionPointEvent[];
};

const useFetchCervezanasEventsByOwnerId = (
    userId: string,
    currentPage: number,
    resultsPerPage: number,
) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: 'cp_events',
        queryFn: () =>
            fetchCervezanasEventsByOwnerId(
                userId,
                currentPage,
                resultsPerPage,
                supabase,
            ),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchCervezanasEventsByOwnerId;
