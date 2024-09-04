'use client';

import { useQuery } from 'react-query';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { IOrder } from '@/lib//types/types';

const fetchOrders = async (
    ownerId: string,
    currentPage: number,
    resultsPerPage: number,
    supabase: any,
) => {
    const { data, error } = await supabase
        .from('orders')
        .select(
            `
                *,
                shipping_info(id, *),
                billing_info(id, *),
                business_orders!business_orders_order_id_fkey (
                    *,
                    order_items (
                    *,
                    product_pack_id (
                        *
                    )
                    )
                )
            `,
        )
        .eq('owner_id', ownerId)
        .range(
            (currentPage - 1) * resultsPerPage,
            currentPage * resultsPerPage - 1,
        )
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as IOrder[];
};

const useFetchOrders = (
    ownerId: string,
    currentPage: number,
    resultsPerPage: number,
) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: ['orders'],
        queryFn: () =>
            fetchOrders(ownerId, currentPage, resultsPerPage, supabase),
        enabled: false,
        refetchOnWindowFocus: false,
    });
};

export default useFetchOrders;
