'use client';

import { IEvent } from '../lib/types';
import { useQuery } from 'react-query';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../lib/schema';

const fetchProductLikes = async (
  pId: string,
  supabase: SupabaseClient<Database>,
) => {
  const { count, error } = await supabase
    .from('likes')
    .select(
      `
        id
      `,
      {
        count: 'exact',
      },
    )
    .eq('product_id', pId);

  if (error) throw error;
  return count as number;
};

const useFetchProductLikes = (pId: string) => {
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ['likes', pId],
    queryFn: () => fetchProductLikes(pId, supabase),
    refetchOnWindowFocus: false,
  });
};

export default useFetchProductLikes;
