'use client';

import { useQuery } from 'react-query';
import { IProduct } from '@/lib//types/types';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { SupabaseClient } from '@supabase/supabase-js';

const fetchProducts = async (
    currentPage: number,
    resultsPerPage: number,
    supabase: SupabaseClient<any>,
) => {
    const { data, error } = await supabase
        .from('products')
        .select(
            `
          *, 
          product_media (*),
          product_inventory (*),
          likes (*),
          product_lots (*),
          beers (*),
          product_packs (*),
          awards(*)
        `,
            {
                count: 'exact',
            },
        )
        .range(
            (currentPage - 1) * resultsPerPage,
            currentPage * resultsPerPage - 1,
        );

    if (error) throw error;

    return data as IProduct[];
};

const useFetchProductsAndPaginationByAdmin = (
    currentPage: number,
    resultsPerPage: number,
) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: 'adminProductList',
        queryFn: () => fetchProducts(currentPage, resultsPerPage, supabase),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchProductsAndPaginationByAdmin;
