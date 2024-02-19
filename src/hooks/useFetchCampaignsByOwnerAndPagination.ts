'use client';

import { useQuery } from 'react-query';
import { ICampaign } from '../lib/types';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { SupabaseClient } from '@supabase/supabase-js';

const fetchCampaignsByOwner = async (
  ownerId: string,
  currentPage: number,
  resultsPerPage: number,
  supabase: SupabaseClient<any>,
) => {
  const { data, error } = await supabase
    .from('campaigns')
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

  return data as ICampaign[];
};

const useFetchCampaignsByOwnerAndPagination = (
  ownerId: string,
  currentPage: number,
  resultsPerPage: number,
) => {
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ['campaignList', ownerId, currentPage, resultsPerPage],
    queryFn: () =>
      fetchCampaignsByOwner(ownerId, currentPage, resultsPerPage, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchCampaignsByOwnerAndPagination;
