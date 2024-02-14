'use client';

import { SupabaseClient } from '@supabase/supabase-js';
import { useQuery } from 'react-query';
import { useAuth } from '../app/[locale]/Auth/useAuth';
import { IProduct } from '../lib/types.d';

const fetchProductById = async (
  productId: string,
  supabase: SupabaseClient<any>,
) => {
  console.log(productId);
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
    queryKey: ['product_id'],
    queryFn: () => fetchProductById(productId, supabase),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchProductById;
