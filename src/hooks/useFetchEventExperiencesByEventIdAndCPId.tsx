'use client';

import { useQuery } from 'react-query';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib//schema';
import { IEventExperience } from '@/lib//types/quiz';

const fetchEventExperiences = async (
    eventId: string,
    cpMobileId: string,
    supabase: SupabaseClient<Database>,
) => {
    const { data, error } = await supabase
        .from('event_experiences')
        .select(
            ` 
                  id,
                  created_at,
                  event_id,
                  cp_mobile_id,
                  cp_fixed_id,
                  experience_id,
                  experiences!public_event_experiences_experience_id_fkey (
                    *
                  )
                `,
        )
        .eq('event_id', eventId)
        .eq('cp_mobile_id', cpMobileId);

    if (error) throw error;

    return data as IEventExperience[];
};

const useFetchEventExperiencesByEventIdAndCPMobileId = (
    eventId: string,
    cpMobileId: string,
) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: ['experiences'],
        queryFn: () => fetchEventExperiences(eventId, cpMobileId, supabase),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchEventExperiencesByEventIdAndCPMobileId;
