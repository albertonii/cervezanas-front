'use client';

import { ISalesRecordsProducer } from '@/lib/types/types';
import { useQuery } from 'react-query';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';

const fetchOneSalesRecords = async (producerId: string, supabase: any) => {
    const { data, error } = await supabase
        .from('sales_records_producer')
        .select(
            `
                *,
                sales_records_items (*),
                producer_user (
                    *
                )
            `,
        )
        .eq('id', producerId)
        .maybeSingle();

    if (error) throw error;
    return data as ISalesRecordsProducer;
};

const useFetchOneSalesRecordsById = (invoiceId: string) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: 'one_sales_records_by_id',
        queryFn: () => fetchOneSalesRecords(invoiceId, supabase),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchOneSalesRecordsById;
