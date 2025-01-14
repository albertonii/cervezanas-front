'use client';

import { SupabaseClient } from '@supabase/supabase-js';
import { useQuery } from 'react-query';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { Database } from '@/lib//schema';
import { IDistributionContract } from '@/lib/types/types';

const fetchDistributionContracts = async (
    distributorId: string,
    supabase: SupabaseClient<Database>,
) => {
    const { data, error } = await supabase
        .from('distribution_contracts')
        .select(
            `
        producer_id,
        distributor_id,
        created_at,
        status,
        producer_accepted,
        distributor_accepted,
        message,
        producer_user (
          users (
            *
          )
        ),
        distributor_user (
          users (
            *
          )
        )
      `,
        )
        .eq('distributor_id', distributorId)
        .order('created_at', { ascending: false });

    /*
    ,
        producer_user!distribution_contracts_producer_id_fkey (
          *
        )
    */

    if (error) throw error;
    return data as IDistributionContract[];
};

const useFetchDistributionContractsByDistributorId = (
    distributorId: string,
) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: 'distributionContract',
        queryFn: () => fetchDistributionContracts(distributorId, supabase),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchDistributionContractsByDistributorId;
