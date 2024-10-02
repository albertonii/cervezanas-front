import readUserSession from '@/lib/actions';
import createServerClient from '@/utils/supabaseServer';
import PersonalInvoiceModule from './PersonalInvoiceModule';
import React from 'react';
import { redirect } from 'next/navigation';
import {
    IBusinessOrder,
    IProducerUser,
    ISalesRecordsProducer,
} from '@/lib//types/types';
import { calculateInvoicePeriod } from '@/utils/utils';

export default async function Page() {
    const producerData = getProducerById();
    const salesRecordsData = getSalesRecordsByProducerIdAndInvoicePeriod();

    const [producer, salesRecords] = await Promise.all([
        producerData,
        salesRecordsData,
    ]);

    return (
        <PersonalInvoiceModule
            producer={producer}
            salesRecords={salesRecords}
        />
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
