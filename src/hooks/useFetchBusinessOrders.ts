'use client';

import { useQuery } from 'react-query';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { IBusinessOrder } from '../lib/types/types';

const fetchBusinessOrders = async (
  ownerId: string,
  currentPage: number,
  resultsPerPage: number,
  supabase: any,
) => {
  const { data, error } = await supabase
    .from('business_orders')
    .select(
      `
        *,
        orders (*),
        order_items (*)
      `,
    )
    .eq('producer_id', ownerId)
    .range(
      (currentPage - 1) * resultsPerPage,
      currentPage * resultsPerPage - 1,
    );

  if (error) throw error;
  return data as IBusinessOrder[];
};

const useFetchBusinessOrders = (
  ownerId: string,
  currentPage: number,
  resultsPerPage: number,
) => {
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ['business_orders'],
    queryFn: () =>
      fetchBusinessOrders(ownerId, currentPage, resultsPerPage, supabase),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchBusinessOrders;
