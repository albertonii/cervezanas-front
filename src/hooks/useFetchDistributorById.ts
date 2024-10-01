'use client';

import { useQuery } from 'react-query';
import { IDistributorUser } from '@/lib//types/types';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { SupabaseClient } from '@supabase/supabase-js';

const fetchDistributorById = async (
    supabase: SupabaseClient<any>,
    distributorId: string,
) => {
    const { data, error } = await supabase
        .from('users')
        .select(
            `
                *,
                distributor_user (*),
                profile_location (
                name, 
                lastname, 
                document_id, 
                company, 
                phone, 
                postalcode, 
                country,
                sub_region, 
                region,
                city,
                address_1, 
                address_2
                )
            `,
        )
        .eq('id', distributorId);

    if (error) throw error;

    return data[0] as IDistributorUser;
};

const useFetchDistributorById = (distributorId: string) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: 'distributorById',
        queryFn: () => fetchDistributorById(supabase, distributorId),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchDistributorById;
