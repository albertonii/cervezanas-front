'use client';

import { useQuery } from 'react-query';
import { Database } from '@/lib//schema';
import { IEvent } from '@/lib/types/eventOrders';
import { SupabaseClient } from '@supabase/supabase-js';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';

const fetchEvents = async (
    currentPage: number,
    resultsPerPage: number,
    supabase: SupabaseClient<Database>,
) => {
    const { data, error } = await supabase
        .from('events')
        .select(
            `
        *
      `,
        )
        .range(
            (currentPage - 1) * resultsPerPage,
            currentPage * resultsPerPage - 1,
        );

    if (error) throw error;
    return data as IEvent[];
};

const useFetchEvents = (currentPage: number, resultsPerPage: number) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: 'events',
        queryFn: () => fetchEvents(currentPage, resultsPerPage, supabase),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchEvents;
