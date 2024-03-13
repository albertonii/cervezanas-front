'use client';

import { useQuery } from 'react-query';
import { IExperience } from '../lib/types/types';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../lib/schema';

const fetchExperiences = async (
  producerId: string,
  supabase: SupabaseClient<Database>,
) => {
  const { data, error } = await supabase
    .from('experiences')
    .select(
      `
        *
      `,
    )
    .eq('producer_id', producerId);

  if (error) throw error;

  return data as IExperience[];
};

const useFetchExperiencesByProducerId = () => {
  const { supabase, user } = useAuth();

  return useQuery({
    queryKey: ['experiences', user.id],
    queryFn: () => fetchExperiences(user.id, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchExperiencesByProducerId;
