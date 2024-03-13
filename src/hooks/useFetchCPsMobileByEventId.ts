'use client';

import { useQuery } from 'react-query';
import { ICPM_events } from '../lib/types/types';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../lib/schema';

const fetchCPSMobileByEventId = async (
  eventId: string,
  supabase: SupabaseClient<Database>,
) => {
  if (!eventId) return [];

  const { data, error } = await supabase
    .from('cpm_events')
    .select(
      `
        *
      `,
    )
    .eq('event_id', eventId)
    .select();

  if (error) throw error;

  return data as ICPM_events[];
};

const useFetchCPSMobileByEventsId = (eventId: string) => {
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ['cpm_events'],
    queryFn: () => fetchCPSMobileByEventId(eventId, supabase),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchCPSMobileByEventsId;
