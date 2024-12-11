'use client';

import { useQuery } from 'react-query';
import { Database } from '@/lib//schema';
import { IEventExperience } from '@/lib/types/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';

const fetchEventExperiences = async (
    eventId: string,
    cpId: string,
    supabase: SupabaseClient<Database>,
) => {
    const { data, error } = await supabase
        .from('event_experiences')
        .select(
            ` 
                  id,
                  created_at,
                  event_id,
                  cp_id,
                  experience_id,
                  experiences!public_event_experiences_experience_id_fkey (
                    *
                  )
                `,
        )
        .eq('event_id', eventId)
        .eq('cp_id', cpId);

    if (error) throw error;

    return data as IEventExperience[];
};

const useFetchEventExperiencesByEventIdAndCPId = (
    eventId: string,
    cpId: string,
) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: 'experiences',
        queryFn: () => fetchEventExperiences(eventId, cpId, supabase),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchEventExperiencesByEventIdAndCPId;
