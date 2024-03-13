import React from 'react';
import createServerClient from '../../../../../utils/supabaseServer';
import { IUserTable } from '../../../../../lib/types/types';
import ConsumerInformation from './ConsumerInformation';

export default async function page({ params }: any) {
  const { id } = params;

  const consumerData = await getConsumerProfile(id);
  const [consumer] = await Promise.all([consumerData]);

  return <ConsumerInformation consumer={consumer} />;
}

async function getConsumerProfile(consumerId: string) {
  const supabase = await createServerClient();

  const { data: consumer, error: consumerError } = await supabase
    .from('users')
    .select(
      `
        *
      `,
    )
    .eq('id', consumerId)
    .single();

  if (consumerError) throw consumerError;

  return consumer as IUserTable;
}
