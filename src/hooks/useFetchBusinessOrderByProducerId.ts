'use client';

import { useQuery } from 'react-query';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { IBusinessOrder } from '../lib/types';

const fetchBusinessOrdersByProducerId = async (
  producerId: string,
  currentPage: number,
  resultsPerPage: number,
  supabase: any,
) => {
  const { data, error } = await supabase
    .from('business_orders')
    .select(
      `
        *,
        orders (*)
      `,
    )
    .eq('producer_id', producerId)
    .range(
      (currentPage - 1) * resultsPerPage,
      currentPage * resultsPerPage - 1,
    );

  if (error) throw error;
  return data as IBusinessOrder[];
};

const useFetchBusinessOrdersByProducerId = (
  producerId: string,
  currentPage: number,
  resultsPerPage: number,
) => {
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ['business_orders_by_producer_id'],
    queryFn: () =>
      fetchBusinessOrdersByProducerId(
        producerId,
        currentPage,
        resultsPerPage,
        supabase,
      ),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchBusinessOrdersByProducerId;
