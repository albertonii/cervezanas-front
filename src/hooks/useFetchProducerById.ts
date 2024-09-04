'use client';

import { useQuery } from 'react-query';
import { IProducerUser } from '@/lib//types/types';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { SupabaseClient } from '@supabase/supabase-js';

const fetchProducerById = async (
    supabase: SupabaseClient<any>,
    producerId: string,
) => {
    const { data, error } = await supabase
        .from('producer_user')
        .select(
            `
                *,
                users (
                    profile_location (
                    name, 
                    lastname, 
                    document_id, 
                    company, 
                    phone, 
                    postalcode, 
                    country,
                    region,
                    sub_region,
                    city,
                    address_1, 
                    address_2
                    )
                )
            `,
        )
        .eq('user_id', producerId);

    if (error) throw error;

    return data[0] as IProducerUser;
};

const useFetchProducerById = (producerId: string) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: ['producerById', producerId],
        queryFn: () => fetchProducerById(supabase, producerId),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchProducerById;
