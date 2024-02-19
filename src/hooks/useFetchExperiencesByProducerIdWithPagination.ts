'use client';

import { IExperience } from '../lib/types';
import { useQuery } from 'react-query';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
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
        *,
        bm_questions: beer_master_questions (
          id,
          question,
          experience_id,
          answers: beer_master_answers (*)
        )
      `,
      {
        count: 'exact',
      },
    )
    .eq('producer_id', ownerId)
    .range(
      (currentPage - 1) * resultsPerPage,
      currentPage * resultsPerPage - 1,
    );

  if (error) throw error;
  return data as IExperience[];
};

const useFetchExperiencesByProducerIdWithPagination = (
  currentPage: number,
  resultsPerPage: number,
) => {
  const { user, supabase } = useAuth();

  return useQuery({
    queryKey: ['experiences'],
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

export default useFetchExperiencesByProducerIdWithPagination;
