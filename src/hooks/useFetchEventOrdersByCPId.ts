'use client';

import { useQuery } from 'react-query';
import { Database } from '@/lib/schema';
import { SupabaseClient } from '@supabase/supabase-js';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { IEventOrderCPS } from '@/lib/types/eventOrders';

const fetchEventOrdersByCPId = async (
    cpId: string,
    supabase: SupabaseClient<Database>,
) => {
    const { data, error } = await supabase
        .from('event_order_cps')
        .select(
            `
                *,
                event_orders (
                    *,
                    users (username)
                ),
                event_order_items (
                    *,
                    product_packs (*)
                )
            `,
        )
        .eq('cp_id', cpId);

    if (error) throw error;

    return data as unknown as IEventOrderCPS[];
};

const useFetchEventOrdersByCPId = (cpId: string) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: 'event_orders_by_cp_id',
        queryFn: () => fetchEventOrdersByCPId(cpId, supabase),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchEventOrdersByCPId;
