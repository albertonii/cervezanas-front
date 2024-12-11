'use client';

import { useQuery } from 'react-query';
import { IProduct } from '@/lib/types/types';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib//schema';

const fetchProductsByOwner = async (
    ownerId: string,
    isPublic: boolean,
    supabase: SupabaseClient<Database>,
) => {
    const { data, error } = await supabase
        .from('products')
        .select(
            `
                id,
                name, 
                description, 
                created_at,
                category,
                owner_id,
                type, 
                weight,
                product_media (*)
            `,
            {
                count: 'exact',
            },
        )
        .eq('is_public', isPublic)
        .eq('owner_id', ownerId);

    if (error) throw error;

    return data as IProduct[];
};

const useFetchProductsByOwner = (ownerId: string, isPublic?: boolean) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: 'productListByOwner',
        queryFn: () =>
            fetchProductsByOwner(ownerId, isPublic ?? true, supabase),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchProductsByOwner;
