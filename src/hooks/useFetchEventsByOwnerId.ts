'use client';

import { useQuery } from 'react-query';
import { Database } from '@/lib/schema';
import { IEvent } from '@/lib/types/eventOrders';
import { SupabaseClient } from '@supabase/supabase-js';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';

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
        )
        .order('created_at', { ascending: false });

    if (error) throw error;

    return data as IEvent[];
};

const useFetchEventsByOwnerId = (
    currentPage: number,
    resultsPerPage: number,
) => {
    const { user, supabase } = useAuth();

    return useQuery({
        queryKey: 'events',
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
