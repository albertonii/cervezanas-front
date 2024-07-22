'use client';

import { useQuery } from 'react-query';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { IBusinessOrder } from '@/lib//types/types';

const fetchOrdersByProducerId = async (
    producerId: string,
    currentPage: number,
    resultsPerPage: number,
    supabase: any,
) => {
    const { data, error } = await supabase
        .from('business_orders')
        .select(
            `
                *, 
                orders (
                    *
                )
            `,
        )
        .eq('producer_id', [producerId])
        .range(
            (currentPage - 1) * resultsPerPage,
            currentPage * resultsPerPage - 1,
        )
        .order('created_at', { ascending: false });

    // const { data, error } = await supabase
    //     .from('orders')
    //     .select(
    //         `
    //     *,
    //     business_orders (
    //       *
    //     )
    //   `,
    //     )
    //     .eq('business_orders.producer_id', [producerId])
    //     .range(
    //         (currentPage - 1) * resultsPerPage,
    //         currentPage * resultsPerPage - 1,
    //     )
    //     .order('created_at', { ascending: false });

    if (error) throw error;
    return data as IBusinessOrder[];
};

const useFetchOrdersByProducerId = (
    producerId: string,
    currentPage: number,
    resultsPerPage: number,
) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: ['orders_by_producer_id'],
        queryFn: () =>
            fetchOrdersByProducerId(
                producerId,
                currentPage,
                resultsPerPage,
                supabase,
            ),
        enabled: false,
        refetchOnWindowFocus: false,
    });
};

export default useFetchOrdersByProducerId;
