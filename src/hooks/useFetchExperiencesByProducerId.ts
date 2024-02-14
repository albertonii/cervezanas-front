'use client';

import { IExperience } from '../lib/types';
import { useQuery } from 'react-query';
import { useAuth } from '../app/[locale]/Auth/useAuth';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../lib/schema';

const fetchExperiencesByProducerId = async (
  ownerId: string,
  currentPage: number,
  resultsPerPage: number,
  supabase: SupabaseClient<Database>,
) => {
  if (!ownerId) return [];

  const { data, error } = await supabase
    .from('experiences')
    .select(
      `
        *
      `,
      {
        count: 'exact',
      },
    )
    .eq('producer_id', ownerId)
    .range((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage - 1)
    .select();

  if (error) throw error;
  return data as IExperience[];
};

const useFetchExperiencesByProducerId = (
  currentPage: number,
  resultsPerPage: number,
) => {
  const { user, supabase } = useAuth();

  return useQuery({
    queryKey: ['experiences', user?.id, currentPage, resultsPerPage],
    queryFn: () =>
      fetchExperiencesByProducerId(
        user?.id,
        currentPage,
        resultsPerPage,
        supabase,
      ),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchExperiencesByProducerId;
