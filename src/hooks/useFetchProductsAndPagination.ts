'use client';

import { useQuery } from 'react-query';
import { IProduct } from '../lib/types';
import { useAuth } from '../app/[locale]/Auth/useAuth';
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
          product_multimedia (*),
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
    .range((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage - 1)
    .select();

  if (error) throw error;

  return data as IProduct[];
};

const useFetchProductsAndPagination = (
  currentPage: number,
  resultsPerPage: number,
) => {
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ['adminProductList', currentPage, resultsPerPage],
    queryFn: () => fetchProducts(currentPage, resultsPerPage, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchProductsAndPagination;
