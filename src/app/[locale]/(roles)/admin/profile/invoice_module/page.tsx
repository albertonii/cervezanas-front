import ModuleList from './ModuleList';
import readUserSession from '@/lib/actions';
import createServerClient from '@/utils/supabaseServer';
import React from 'react';
import { redirect } from 'next/navigation';
import { IDistributorUser, IProducerUser } from '@/lib/types/types';

export default async function Page() {
    const producersData = getProducers();
    const distributorsData = getDistributors();
    const producersCounterData = getProducersCounter();
    const distributorsCounterData = getDistributorsCounter();

    const [producers, distributors, producersCounter, distributorsCounter] =
        await Promise.all([
            producersData,
            distributorsData,
            producersCounterData,
            distributorsCounterData,
        ]);

    return (
        <ModuleList
            producers={producers}
            distributors={distributors}
            producersCounter={producersCounter}
            distributorsCounter={distributorsCounter}
        />
    );
}

async function getProducers() {
    const supabase = await createServerClient();

    const { data, error: profileError } = await supabase
        .from('producer_user')
        .select(
            `
                *,
                users (*)
            `,
        );

    if (profileError) throw profileError;

    return data as IProducerUser[];
}

async function getDistributors() {
    const supabase = await createServerClient();

    const { data, error: profileError } = await supabase
        .from('distributor_user')
        .select(
            `
                *,
                users (*)
            `,
        );

    if (profileError) throw profileError;

    return data as IDistributorUser[];
}

async function getProducersCounter() {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { count, error } = await supabase
        .from('producer_user')
        .select('user_id', { count: 'exact' }) // Selecciona solo una columna y habilita el conteo
        .eq('user_id', session.id);

    if (error) throw error;

    return count as number | 0;
}

async function getDistributorsCounter() {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { count, error } = await supabase
        .from('distributor_user')
        .select('user_id', { count: 'exact' }) // Selecciona solo una columna y habilita el conteo
        .eq('user_id', session.id);

    if (error) throw error;

    return count as number | 0;
}
