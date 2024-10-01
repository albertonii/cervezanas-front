'use client';

import { useQuery } from 'react-query';
import { IBillingInfo } from '@/lib//types/types';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib//schema';

const fetchBillingByOwnerId = async (
    ownerId: string,
    supabase: SupabaseClient<Database>,
) => {
    if (!ownerId) return [];

    const { data, error } = await supabase
        .from('billing_info')
        .select(`*`)
        .eq('owner_id', ownerId);

    if (error) throw error;

    return data as IBillingInfo[];
};

const useFetchBillingByOwnerId = (ownerId: string) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: 'billingAddresses',
        queryFn: () => fetchBillingByOwnerId(ownerId, supabase),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchBillingByOwnerId;
