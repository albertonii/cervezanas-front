'use client';

import { useEffect } from 'react';
import { Database } from '@/lib/schema';
import { useQuery, useQueryClient } from 'react-query';
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
    const queryClient = useQueryClient();

    const result = useQuery({
        queryKey: ['event_order_cp_status', id],
        queryFn: () => fetchEventCPOrderStatusById(id, supabase),
        enabled: !!id,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (!id) return;

        // Suscribirse a cambios en la tabla event_order_cps para el ID específico
        const channel = supabase
            .channel(`public:event_order_cps:id=eq.${id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE', // Escuchar solo eventos de actualización
                    schema: 'public',
                    table: 'event_order_cps',
                    filter: `id=eq.${id}`,
                },
                (payload) => {
                    // Refrescar los datos de la consulta
                    queryClient.invalidateQueries([
                        'event_order_cp_status',
                        id,
                    ]);
                },
            )
            .subscribe();

        // Limpiar la suscripción al desmontar el componente
        return () => {
            supabase.removeChannel(channel);
        };
    }, [id, supabase, queryClient]);

    return result;
};

export default useFetchEventCPOrderStatusById;
