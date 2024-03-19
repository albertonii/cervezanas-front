'use server';

import { IBMExperienceParticipants } from '../../../../../../../../../lib/types/quiz';
import createServerClient from '../../../../../../../../../utils/supabaseServer';

export async function hasUserParticipatedInExperienceBefore(
    userId: string,
    eventId: string,
    cpmId: string,
    cpfId: string,
    experienceId: string,
) {
    const supabase = await createServerClient();

    if (cpmId !== '') {
        const { data, error: errorParticipants } = await supabase
            .from('bm_experience_participants')
            .select('*')
            .eq('gamification_id', userId)
            .eq('event_id', eventId)
            .eq('cpm_id', cpmId)
            .eq('experience_id', experienceId)
            .maybeSingle();

        if (errorParticipants) {
            console.error(errorParticipants);
            throw new Error('Failed to check participation status');
        }

        return !!data;
    } else {
        const { data, error: errorParticipants } = await supabase
            .from('bm_experience_participants')
            .select('*')
            .eq('gamification_id', userId)
            .eq('event_id', eventId)
            .eq('cpf_id', cpfId)
            .eq('experience_id', experienceId)
            .maybeSingle();

        if (errorParticipants) {
            console.error(errorParticipants);
            throw new Error('Failed to check participation status');
        }

        return !!data;
    }
}

export async function getUserParticipant(
    userId: string,
    eventId: string,
    cpmId: string,
    cpfId: string,
    experienceId: string,
) {
    const supabase = await createServerClient();

    if (cpmId !== '') {
        const { data, error: errorParticipants } = await supabase
            .from('bm_experience_participants')
            .select('*')
            .eq('gamification_id', userId)
            .eq('event_id', eventId)
            .eq('cpm_id', cpmId)
            .eq('experience_id', experienceId)
            .maybeSingle();

        if (errorParticipants) {
            console.error(errorParticipants);
            throw new Error('Failed to get participation status');
        }

        return data as IBMExperienceParticipants;
    } else {
        const { data, error: errorParticipants } = await supabase
            .from('bm_experience_participants')
            .select('*')
            .eq('gamification_id', userId)
            .eq('event_id', eventId)
            .eq('cpf_id', cpfId)
            .eq('experience_id', experienceId)
            .maybeSingle();

        if (errorParticipants) {
            console.error(errorParticipants);
            throw new Error('Failed to get participation status');
        }

        return data as IBMExperienceParticipants;
    }
}
