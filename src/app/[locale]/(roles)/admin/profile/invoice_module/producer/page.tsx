import createServerClient from '@/utils/supabaseServer';
import PersonalInvoiceModule from './PersonalInvoiceModule';
import React from 'react';
import { IBusinessOrder, IProducerUser } from '@/lib//types/types';
import { calculateInvoicePeriod } from '@/utils/utils';

export default async function Page({ searchParams }: any) {
    const { id } = searchParams;

    const producerData = getProducerById(id);
    const businessOrdersData = getBusinessOrdersByProducerId(id);

    const [producer, businessOrders] = await Promise.all([
        producerData,
        businessOrdersData,
    ]);

    return (
        <PersonalInvoiceModule producer={producer} bOrders={businessOrders} />
    );
}

async function getProducerById(userId: string) {
    const supabase = await createServerClient();

    console.log(calculateInvoicePeriod(new Date()));

    const { data, error: profileError } = await supabase
        .from('producer_user')
        .select(
            `
                *,
                users (*)
            `,
        )
        .eq('user_id', userId)
        .single();
    console.log(data);

    if (profileError) throw profileError;

    return data as IProducerUser;
}

async function getBusinessOrdersByProducerId(userId: string) {
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
        .eq('producer_id', userId)
        .eq('invoice_period', invoicePeriod);

    if (profileError) throw profileError;

    return data as IBusinessOrder[];
}
