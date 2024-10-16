'use client';

import { SupabaseClient } from '@supabase/supabase-js';
import { useQuery } from 'react-query';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { IProduct } from '@/lib//types/types';

const fetchProductById = async (
    productId: string,
    supabase: SupabaseClient<any>,
) => {
    if (!productId) {
        throw new Error('Product ID is required');
    }

    const { data, error } = await supabase
        .from('products')
        .select(
            `
        *,
        beers (*),
        product_multimedia (
          p_principal
        ),
        product_inventory (
          quantity
        )
      `,
        )
        .eq('id', productId)
        .single();

    if (error) throw error;

    return data as IProduct;
};

const useFetchProductById = (productId: string) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: ['product', productId],
        queryFn: () => fetchProductById(productId, supabase),
        enabled: !!productId, // La consulta se habilita cuando productId es truthy
        refetchOnWindowFocus: false,
    });
};

export default useFetchProductById;
