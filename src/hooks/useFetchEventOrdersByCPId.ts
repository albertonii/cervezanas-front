'use client';

import { useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
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
                    users (username),
                ),
                event_order_items (
                    *,
                    product_packs (
                        *,
                        products (name)
                    )
                ),
                cp_events (
                    *,
                    cp (cp_name, address)
                )
            `,
        )
        .eq('cp_id', cpId);

    if (error) throw error;

    return data as unknown as IEventOrderCPS[];
};

const useFetchEventOrdersByCPId = (cpId: string) => {
    const { supabase } = useAuth();
    const queryClient = useQueryClient();

    const result = useQuery({
        queryKey: ['event_orders_by_cp_id', cpId],
        queryFn: () => fetchEventOrdersByCPId(cpId, supabase),
        enabled: !!cpId,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (!cpId) return;

        // Suscribirse a cambios en la tabla event_order_cps para el CP ID específico
        const channel = supabase
            .channel(`public:event_order_cps:cp_id=eq.${cpId}`)
            .on(
                'postgres_changes',
                {
                    event: '*', // Escuchar cualquier evento (INSERT, UPDATE, DELETE)
                    schema: 'public',
                    table: 'event_order_cps',
                    filter: `cp_id=eq.${cpId}`,
                },
                (payload) => {
                    // Refrescar los datos de la consulta
                    queryClient.invalidateQueries([
                        'event_orders_by_cp_id',
                        cpId,
                    ]);
                },
            )
            .subscribe();

        // Limpiar la suscripción al desmontar el componente
        return () => {
            supabase.removeChannel(channel);
        };
    }, [cpId, supabase, queryClient]);

    return result;
};

export default useFetchEventOrdersByCPId;
