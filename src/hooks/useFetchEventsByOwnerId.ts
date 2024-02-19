'use client';

import { IEvent } from '../lib/types';
import { useQuery } from 'react-query';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../lib/schema';

const fetchEventsByOwnerId = async (
  ownerId: string,
  currentPage: number,
  resultsPerPage: number,
  supabase: SupabaseClient<Database>,
) => {
  if (!ownerId) return [];

  const { data, error } = await supabase
    .from('events')
    .select(
      `
        *
      `,
      {
        count: 'exact',
      },
    )
    .eq('owner_id', ownerId)
    .range(
      (currentPage - 1) * resultsPerPage,
      currentPage * resultsPerPage - 1,
    );

  if (error) throw error;
  return data as IEvent[];
};

const useFetchEventsByOwnerId = (
  currentPage: number,
  resultsPerPage: number,
) => {
  const { user, supabase } = useAuth();

  return useQuery({
    queryKey: ['events', user?.id, currentPage, resultsPerPage],
    queryFn: () =>
      fetchEventsByOwnerId(user?.id, currentPage, resultsPerPage, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchEventsByOwnerId;
