'use server';

import { IBMExperienceParticipants } from '@/lib/types/quiz';
import createServerClient from '@/utils/supabaseServer';

export async function hasUserParticipatedInExperienceBefore(
    userId: string,
    eventId: string,
    cpId: string,
    experienceId: string,
) {
    const supabase = await createServerClient();

    const { data, error: errorParticipants } = await supabase
        .from('bm_experience_participants')
        .select('*')
        .eq('gamification_id', userId)
        .eq('event_id', eventId)
        .eq('cp_id', cpId)
        .eq('experience_id', experienceId)
        .maybeSingle();

    if (errorParticipants) {
        console.error(errorParticipants);
        throw new Error('Failed to check participation status');
    }

    return !!data;
}

export async function getUserParticipant(
    userId: string,
    eventId: string,
    cpId: string,
    experienceId: string,
) {
    const supabase = await createServerClient();

    const { data, error: errorParticipants } = await supabase
        .from('bm_experience_participants')
        .select('*')
        .eq('gamification_id', userId)
        .eq('event_id', eventId)
        .eq('cp_id', cpId)
        .eq('experience_id', experienceId)
        .maybeSingle();

    if (errorParticipants) {
        console.error(errorParticipants);
        throw new Error('Failed to get participation status');
    }

    return data as IBMExperienceParticipants;
}
