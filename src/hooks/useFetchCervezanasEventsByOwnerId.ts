'use client';

import { ICPM_events, IEvent } from '../lib/types/types';
import { useQuery } from 'react-query';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../lib/schema';

const fetchCervezanasEventsByOwnerId = async (
    ownerId: string,
    currentPage: number,
    resultsPerPage: number,
    supabase: SupabaseClient<Database>,
) => {
    if (!ownerId) return [];

    const { data, error } = await supabase
        .from('cpm_events')
        .select(
            `
              *,
              events (*)
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
        );

    if (error) throw error;

    return data as ICPM_events[];
};

const useFetchCervezanasEventsByOwnerId = (
    currentPage: number,
    resultsPerPage: number,
) => {
    const { user, supabase } = useAuth();

    return useQuery({
        queryKey: ['cervezanas_events', user?.id, currentPage, resultsPerPage],
        queryFn: () =>
            fetchCervezanasEventsByOwnerId(
                user?.id,
                currentPage,
                resultsPerPage,
                supabase,
            ),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchCervezanasEventsByOwnerId;
