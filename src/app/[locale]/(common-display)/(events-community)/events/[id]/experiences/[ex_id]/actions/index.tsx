'use server';

import createServerClient from '../../../../../../../../../utils/supabaseServer';

export async function hasUserParticipatedInExperienceBefore(
    userId: string,
    eventId: string,
    cpmId: string,
    experienceId: string,
) {
    const supabase = await createServerClient();

    // Check if exists
    const { data, error: errorParticipants } = await supabase
        .from('bm_experience_participants')
        .select('*')
        .eq('gamification_id', userId)
        .eq('event_id', eventId)
        .eq('cpm_id', cpmId)
        .eq('experience_id', experienceId)
        .single();

    if (errorParticipants) {
        console.error(errorParticipants);
        throw new Error('Failed to check participation status');
    }

    return !!data;
}
