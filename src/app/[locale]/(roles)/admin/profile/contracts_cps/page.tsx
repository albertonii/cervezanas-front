import ContractsCPS from './ContractsCPS';
import readUserSession from '@/lib//actions';
import createServerClient from '@/utils/supabaseServer';
import React from 'react';
import { redirect } from 'next/navigation';
import { IConsumptionPoints } from '@/lib/types/consumptionPoints';

export default async function CPsContractsPage() {
    const cpsContracts = await getCPsContracts();

    return <ContractsCPS cpsContracts={cpsContracts} />;
}

async function getCPsContracts() {
    const supabase = await createServerClient();

    // Be careful when protecting pages. The server gets the user session from the cookies, which can be spoofed by anyone.
    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { data: cpsContract, error: profileError } = await supabase
        .from('consumption_points')
        .select(
            `
        *,
        users (*)
      `,
        );

    if (profileError) throw profileError;

    return cpsContract as IConsumptionPoints[];
}
