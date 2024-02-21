import { redirect } from 'next/navigation';
import React from 'react';
import { VIEWS } from '../../../../../../constants';
import readUserSession from '../../../../../../lib/actions';
import { IConsumptionPoints } from '../../../../../../lib/types';
import createServerClient from '../../../../../../utils/supabaseServer';
import ContractsCPS from './ContractsCPS';

export default async function CPsContractsPage() {
  const cpsContracts = await getCPsContracts();

  return <ContractsCPS cpsContracts={cpsContracts} />;
}

async function getCPsContracts() {
  const supabase = await createServerClient();

  // Be careful when protecting pages. The server gets the user session from the cookies, which can be spoofed by anyone.
  const session = await readUserSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
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
