'use client';

import { IEvent } from '@/lib//types/types';
import { useQuery } from 'react-query';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/schema-prod';

const fetchEventsByOwnerId = async (
    ownerId: string,
    currentPage: number,
    resultsPerPage: number,
    supabase: SupabaseClient<Database>,
) => {
    if (!ownerId) return { data: [], total: 0 };

    const { data, error } = await supabase
        .from('events')
        .select(
            `
              *
            `,
            {
                count: 'exact',
            },
        )
        .eq('owner_id', ownerId)
        .eq('is_cervezanas_event', false)
        .range(
            (currentPage - 1) * resultsPerPage,
            currentPage * resultsPerPage - 1,
        );

    if (error) throw error;

    return data as IEvent[];
};

const useFetchEventsByOwnerId = (
    currentPage: number,
    resultsPerPage: number,
) => {
    const { user, supabase } = useAuth();

    return useQuery({
        queryKey: ['events', user?.id, currentPage, resultsPerPage],
        queryFn: () =>
            fetchEventsByOwnerId(
                user?.id,
                currentPage,
                resultsPerPage,
                supabase,
            ),
        enabled: !!user?.id,
        refetchOnWindowFocus: false,
    });
};

export default useFetchEventsByOwnerId;
