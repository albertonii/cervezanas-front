'use client';

import { useQuery } from 'react-query';
import { Database } from '@/lib//schema';
import { SupabaseClient } from '@supabase/supabase-js';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';

const fetchCPSEventByEventId = async (
    eventId: string,
    supabase: SupabaseClient<Database>,
) => {
    if (!eventId) return [];

    const { data, error } = await supabase
        .from('cp_events')
        .select(
            `
        *
      `,
        )
        .eq('event_id', eventId)
        .select();

    if (error) throw error;

    return data as IConsumptionPointEvent[];
};

const useFetchCPSEventByEventsId = (eventId: string) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: 'cp_events',
        queryFn: () => fetchCPSEventByEventId(eventId, supabase),
        enabled: false,
        refetchOnWindowFocus: false,
    });
};

export default useFetchCPSEventByEventsId;
