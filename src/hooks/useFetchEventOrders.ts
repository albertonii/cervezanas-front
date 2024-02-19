'use client';

import { useQuery } from 'react-query';
import { IEventOrder } from '../lib/types';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';

const fetchCPOrders = async (
  ownerId: string,
  currentPage: number,
  resultsPerPage: number,
  supabase: any,
) => {
  const { data, error } = await supabase
    .from('event_orders')
    .select(
      `
        *,
        users!event_orders_customer_id_fkey (id, email, username)
      `,
    )
    .eq('customer_id', ownerId)
    .range(
      (currentPage - 1) * resultsPerPage,
      currentPage * resultsPerPage - 1,
    );

  if (error) throw error;
  return data as IEventOrder[];
};

const useFetchCPOrders = (
  ownerId: string,
  currentPage: number,
  resultsPerPage: number,
) => {
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ['event_orders'],
    queryFn: () =>
      fetchCPOrders(ownerId, currentPage, resultsPerPage, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchCPOrders;
