'use client';

import { useQuery } from 'react-query';
import { Database } from '@/lib/schema';
import { SupabaseClient } from '@supabase/supabase-js';
import { IEventOrderCPS } from '@/lib/types/eventOrders';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';

const fetchEventCPOrderStatusById = async (
    id: string,
    supabase: SupabaseClient<Database>,
) => {
    const { data, error } = await supabase
        .from('event_order_cps')
        .select('id, status')
        .eq('id,', id)
        .single();
    if (error) throw error;

    return data as IEventOrderCPS;
};

const useFetchEventCPOrderStatusById = (id: string) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: ['event_order_cp_status', id],
        queryFn: () => fetchEventCPOrderStatusById(id, supabase),
        enabled: !!id,
        refetchOnWindowFocus: false,
    });
};

export default useFetchEventCPOrderStatusById;
