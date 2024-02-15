'use client';

import { useQuery } from 'react-query';
import { ICPM_events } from '../lib/types';
import { useAuth } from '../app/[locale]/Auth/useAuth';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../lib/schema';

const fetchCPSFixedByEventId = async (
  eventId: string,
  supabase: SupabaseClient<Database>,
) => {
  if (!eventId) return [];

  const { data, error } = await supabase
    .from('cpf_events')
    .select(
      `
        *
      `,
    )
    .eq('event_id', eventId);

  if (error) throw error;

  return data as ICPM_events[];
};

const useFetchCPSFixedByEventsId = (eventId: string) => {
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ['cpf_events'],
    queryFn: () => fetchCPSFixedByEventId(eventId, supabase),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchCPSFixedByEventsId;
