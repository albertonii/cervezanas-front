import createServerClient from '@/utils/supabaseServer';
import PersonalInvoiceModule from './PersonalInvoiceModule';
import React from 'react';
import { IBusinessOrder, IProducerUser } from '@/lib//types/types';
import readUserSession from '@/lib/actions';
import { redirect } from 'next/navigation';

export default async function Page({ searchParams }: any) {
    const producerData = getProducerById();
    const businessOrdersData = getBusinessOrdersByProducerId();

    const [producer, businessOrders] = await Promise.all([
        producerData,
        businessOrdersData,
    ]);

    return (
        <PersonalInvoiceModule producer={producer} bOrders={businessOrders} />
    );
}

async function getProducerById() {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { data, error: profileError } = await supabase
        .from('producer_user')
        .select(
            `
                *,
                users (*)
            `,
        )
        .eq('user_id', session.id)
        .single();

    if (profileError) throw profileError;

    return data as IProducerUser;
}

async function getBusinessOrdersByProducerId() {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

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
        .eq('producer_id', session.id);

    if (profileError) throw profileError;

    return data as IBusinessOrder[];
}
