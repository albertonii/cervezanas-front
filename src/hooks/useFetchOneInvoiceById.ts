'use client';

import { IInvoiceProducer } from '@/lib/types/types';
import { useQuery } from 'react-query';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';

const fetchOneInvoice = async (producerId: string, supabase: any) => {
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
                ),
                invoice_items (*)
            `,
        )
        .eq('id', producerId)
        .single();

    if (error) throw error;
    return data as IInvoiceProducer;
};

const useFetchOneInvoiceById = (invoiceId: string) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: 'one_invoice_by_id',
        queryFn: () => fetchOneInvoice(invoiceId, supabase),
        enabled: false,
        refetchOnWindowFocus: false,
    });
};

export default useFetchOneInvoiceById;
