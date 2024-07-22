'use client';

import { IEvent } from '@/lib//types/types';
import { useQuery } from 'react-query';
import { Database } from '@/lib//schema';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { SupabaseClient } from '@supabase/supabase-js';

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
        queryKey: ['events', currentPage, resultsPerPage],
        queryFn: () => fetchEvents(currentPage, resultsPerPage, supabase),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchEvents;
