import createServerClient from '@/utils/supabaseServer';
import PersonalInvoiceModule from './PersonalInvoiceModule';
import React from 'react';
import { IProducerUser } from '@/lib//types/types';

export default async function Page({ searchParams }: any) {
    const { id } = searchParams;

    const producerData = getProducerById(id);

    const [producer] = await Promise.all([producerData]);

    return <PersonalInvoiceModule producer={producer} />;
}

async function getProducerById(userId: string) {
    const supabase = await createServerClient();

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

    if (profileError) throw profileError;

    return data as IProducerUser;
}
