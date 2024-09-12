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
                business_orders!business_orders_order_id_fkey (
                    *,
                    order_items (
                        *,
                        product_pack_id (
                            *
                        )
                    )
                ),
                shipping_name,
                shipping_lastname,
                shipping_document_id,
                shipping_phone,
                shipping_address,
                shipping_address_extra,
                shipping_country,
                shipping_region,
                shipping_sub_region,
                shipping_city,
                shipping_zipcode,
                billing_name,
                billing_lastname,
                billing_document_id,
                billing_phone,
                billing_address,
                billing_country,
                billing_region,
                billing_sub_region,
                billing_city,
                billing_zipcode,
                billing_is_company
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
        queryKey: 'orders',
        queryFn: () =>
            fetchOrders(ownerId, currentPage, resultsPerPage, supabase),
        enabled: false,
        refetchOnWindowFocus: false,
    });
};

export default useFetchOrders;
