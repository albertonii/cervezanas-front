'use client';

import { useQuery } from 'react-query';
import { IProduct } from '@/lib//types/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';

const fetchProductsByOwner = async (
    currentPage: number,
    resultsPerPage: number,
    isArchived: boolean,
    ownerId: string,
    supabase: SupabaseClient<any>,
) => {
    const { data, error } = await supabase
        .from('products')
        .select(
            `
                *,
                product_multimedia (*),
                product_inventory (*),
                likes (*),
                product_lots (*),
                beers (*),
                product_packs (*),
                awards (*),
                box_packs (
                    *,
                    box_pack_items (
                        *,
                        products (
                            id, 
                            name,
                            weight
                        )
                    )
                )
            `,
        )
        .eq('owner_id', ownerId)
        .eq('is_archived', isArchived)
        .range(
            (currentPage - 1) * resultsPerPage,
            currentPage * resultsPerPage - 1,
        )
        .order('created_at', { ascending: false });

    console.log(data);

    if (error) throw error;

    return data as IProduct[];
};

const useFetchProductsByOwnerAndPagination = (
    currentPage: number,
    resultsPerPage: number,
    isArchived: boolean,
) => {
    const { supabase, user } = useAuth();

    return useQuery({
        queryKey: 'productList',
        queryFn: () =>
            fetchProductsByOwner(
                currentPage,
                resultsPerPage,
                isArchived,
                user.id,
                supabase,
            ),
        enabled: true,
        refetchOnWindowFocus: false,
        // cacheTime: 0, // No caching
        // staleTime: 0,  // Datos siempre frescos
    });
};

export default useFetchProductsByOwnerAndPagination;
