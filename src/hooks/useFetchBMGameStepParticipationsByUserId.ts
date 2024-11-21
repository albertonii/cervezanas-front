'use client';

import { IBMGameStepsRegistered } from '@/lib/types/beerMasterGame';
import { IBMExperienceParticipants } from '@/lib/types/quiz';
import { useQuery } from 'react-query';
import { useAuth } from '../app/[locale]/(auth)/Context/useAuth';

const fetchBreweriesByOwnerId = async (
    userId: string,
    gameId: string,
    supabase: any,
) => {
    const { data, error } = await supabase
        .from('bm_game_steps_registered')
        .select(
            `
                *,
                bm_steps (
                    *
                )
            `,
        )
        .eq('user_id', userId)
        .eq('bm_steps.bm_state_id', gameId);

    if (error) throw error;
    return data as IBMGameStepsRegistered[];
};

const useFetchBMGameStepParticipationsByUserId = (
    userId: string,
    gameId: string,
) => {
    const { supabase } = useAuth();

    return useQuery({
        queryKey: 'bm_steps_participations',
        queryFn: () => fetchBreweriesByOwnerId(userId, gameId, supabase),
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export default useFetchBMGameStepParticipationsByUserId;
