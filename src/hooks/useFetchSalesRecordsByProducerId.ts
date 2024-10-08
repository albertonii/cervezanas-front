'use client';

import { useQuery } from 'react-query';
import { ISalesRecordsProducer } from '@/lib/types/types';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';

const fetchSalesRecords = async (
    producerId: string,
    currentPage: number,
    resultsPerPage: number,
    supabase: any,
) => {
    const { data, error } = await supabase
        .from('sales_records_producer')
        .select(
            `
                *,
                sales_records_items (
                    *
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
    return data as ISalesRecordsProducer[];
};

const useFetchSalesRecordsByProducerId = (
    producerId: string,
    currentPage: number,
    resultsPerPage: number,
) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: 'sales_records_by_producer_id',
        queryFn: () =>
            fetchSalesRecords(
                producerId,
                currentPage,
                resultsPerPage,
                supabase,
            ),
        enabled: false,
        refetchOnWindowFocus: false,
    });
};

export default useFetchSalesRecordsByProducerId;
