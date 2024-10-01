'use client';

import { IInvoiceProducer } from '@/lib/types/types';
import { useQuery } from 'react-query';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';

const fetchInvoices = async (
    producerId: string,
    currentPage: number,
    resultsPerPage: number,
    supabase: any,
) => {
    const { data, error } = await supabase
        .from('invoices_producer')
        .select(
            `
                *,
                payments (
                    id,
                    invoice_id,
                    amount_paid,
                    payment_method,
                    status,
                    created_at,
                    updated_at
                ),
                producer_user (
                    *
                )
            `,
        )
        .eq('producer_id', producerId)
        .range(
            (currentPage - 1) * resultsPerPage,
            currentPage * resultsPerPage - 1,
        )
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as IInvoiceProducer[];
};

const useFetchInvoicesByProducerId = (
    producerId: string,
    currentPage: number,
    resultsPerPage: number,
) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: 'invoices_by_producer_id',
        queryFn: () =>
            fetchInvoices(producerId, currentPage, resultsPerPage, supabase),
        enabled: false,
        refetchOnWindowFocus: false,
    });
};

export default useFetchInvoicesByProducerId;
