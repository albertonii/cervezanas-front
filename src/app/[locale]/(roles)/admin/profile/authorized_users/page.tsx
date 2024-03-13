import React from 'react';
import {
  IDistributorUser,
  IProducerUser,
} from '../../../../../../lib/types/types';
import createServerClient from '../../../../../../utils/supabaseServer';
import PendingList from './PendingList';

export default async function AuthorizeUsersPage() {
  const producers = await getPendingAuthProducers();
  const distributors = await getPendingAuthDistributors();

  return <PendingList producers={producers} distributors={distributors} />;
}

async function getPendingAuthProducers() {
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

async function getPendingAuthDistributors() {
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
