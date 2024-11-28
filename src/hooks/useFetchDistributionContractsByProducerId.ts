'use client';

import { useQuery } from 'react-query';
import { IDistributionContract } from '@/lib/types/types';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib//schema-prod';

const fetchDistributionContracts = async (
    producerId: string,
    supabase: SupabaseClient<Database>,
) => {
    const { data, error } = await supabase
        .from('distribution_contracts')
        .select(
            `
            distributor_id ,
            producer_id,
            created_at,
            status,
            producer_accepted,
            distributor_accepted,
            message,
            distributor_user!distribution_contracts_distributor_id_fkey (
              users (
                id,
                username
              )
            )
          `,
        )
        .eq('producer_id', producerId);

    if (error) throw error;
    return data as IDistributionContract[];
};

const useFetchDistributionContracts = (producerId: string) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: 'distributionContract',
        queryFn: () => fetchDistributionContracts(producerId, supabase),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchDistributionContracts;
