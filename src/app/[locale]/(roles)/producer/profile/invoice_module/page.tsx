import readUserSession from '@/lib/actions';
import createServerClient from '@/utils/supabaseServer';
import PersonalInvoiceModule from './PersonalInvoiceModule';
import React from 'react';
import { redirect } from 'next/navigation';
import { IBusinessOrder, ISalesRecordsProducer } from '@/lib//types/types';
import { calculateInvoicePeriod } from '@/utils/utils';

export default async function Page() {
    const businessOrdersData = getBusinessOrdersByProducerId();
    const salesRecordsData = getSalesRecordsByProducerIdAndInvoicePeriod();

    const [salesRecords, businessOrders] = await Promise.all([
        salesRecordsData,
        businessOrdersData,
    ]);

    return (
        <PersonalInvoiceModule
            bOrders={businessOrders}
            salesRecords={salesRecords}
        />
    );
}

async function getBusinessOrdersByProducerId() {
    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const supabase = await createServerClient();

    const invoicePeriod = calculateInvoicePeriod(new Date());

    const { data, error: profileError } = await supabase
        .from('business_orders')
        .select(
            `
                *,
                order_items (
                    *,
                    product_packs (
                        *,
                        products (
                            name
                        )
                    )
                )
                    
            `,
        )
        .eq('producer_id', session.id)
        .eq('invoice_period', invoicePeriod);

    if (profileError) throw profileError;

    return data as IBusinessOrder[];
}

async function getSalesRecordsByProducerIdAndInvoicePeriod() {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const invoicePeriod = calculateInvoicePeriod(new Date());

    const { data, error: profileError } = await supabase
        .from('sales_records_producer')
        .select(
            `
                *,
                sales_records_items (*)
            `,
        )
        .eq('producer_id', session.id)
        .eq('invoice_period', invoicePeriod)
        .maybeSingle();

    if (profileError) throw profileError;

    return data as ISalesRecordsProducer;
}
