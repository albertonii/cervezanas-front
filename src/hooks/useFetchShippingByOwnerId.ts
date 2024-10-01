'use client';

import { useQuery } from 'react-query';
import { IAddress } from '@/lib//types/types';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib//schema';

const fetchShippingByOwnerId = async (
    ownerId: string,
    supabase: SupabaseClient<Database>,
) => {
    if (!ownerId) return [];
    const { data, error } = await supabase
        .from('shipping_info')
        .select(`*`)
        .eq('owner_id', ownerId);

    if (error) throw error;

    return data as IAddress[];
};

const useFetchShippingByOwnerId = (ownerId: string) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: 'shippingAddresses',
        queryFn: () => fetchShippingByOwnerId(ownerId, supabase),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchShippingByOwnerId;
