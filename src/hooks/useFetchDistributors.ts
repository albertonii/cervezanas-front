'use client';

import { useQuery } from 'react-query';
import { IDistributorUser } from '@/lib//types/types';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { SupabaseClient } from '@supabase/supabase-js';

const fetchDistributorsByProducerId = async (
    supabase: SupabaseClient<any>,
    producerId: string,
) => {
    // Paso 1: Obtener todos los distribuidores
    const { data: distributors, error: distributorsError } = await supabase
        .from('distributor_user')
        .select(
            `
              *,
              users (*)
            `,
        );

    if (distributorsError) throw distributorsError;

    // Paso 2: Obtener los distributor_id que tienen contratos vinculantes
    const { data: boundDistributors, error: boundDistributorsError } =
        await supabase
            .from('distribution_contracts')
            .select('distributor_id')
            .eq('producer_id', producerId);

    if (boundDistributorsError) throw boundDistributorsError;

    const boundDistributorIds = boundDistributors.map(
        (contract) => contract.distributor_id,
    );

    // Paso 3: Filtrar distribuidores que no tienen contratos vinculantes
    const filteredDistributors = distributors.filter(
        (distributor) => !boundDistributorIds.includes(distributor.user_id),
    );

    return filteredDistributors as IDistributorUser[];
};

const useFetchDistributorsByProducerId = (producerId: string) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: ['distributors'],
        queryFn: () => fetchDistributorsByProducerId(supabase, producerId),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchDistributorsByProducerId;
