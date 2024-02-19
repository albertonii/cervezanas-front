'use client';

import { useQuery } from 'react-query';
import { ICPMobile } from '../lib/types';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../lib/schema';

const fetchCPMobile = async (
  cpId: string,
  currentPage: number,
  resultsPerPage: number,
  supabase: SupabaseClient<Database>,
) => {
  const { data, error } = await supabase
    .from('cp_mobile')
    .select(
      `
        *
      `,
    )
    .eq('cp_id', cpId)
    .range(
      (currentPage - 1) * resultsPerPage,
      currentPage * resultsPerPage - 1,
    );

  if (error) throw error;

  return data as ICPMobile[];
};

const useFetchCPMobile = (
  cpId: string,
  currentPage: number,
  resultsPerPage: number,
) => {
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ['cpMobile', cpId, currentPage, resultsPerPage],
    queryFn: () => fetchCPMobile(cpId, currentPage, resultsPerPage, supabase),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchCPMobile;
