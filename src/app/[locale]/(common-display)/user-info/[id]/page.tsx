import React from 'react';
import { IUserTable } from '@/lib//types/types';
import createServerClient from '@/utils/supabaseServer';
import UserInformation from './UserInformation';

export default async function page({ params }: any) {
    const { id } = params;

    const userData = await getProducerProfile(id);
    const [user] = await Promise.all([userData]);

    return <UserInformation user={user} />;
}

async function getProducerProfile(producerId: string) {
    const supabase = await createServerClient();

    const { data, error } = await supabase
        .from('users')
        .select(
            `
            *,
            producer_user (
              *
            ),
            distributor_user (
              *
            )
      `,
        )
        .eq('id', producerId)
        .single();

    if (error) throw error;

    return data as IUserTable;
}
