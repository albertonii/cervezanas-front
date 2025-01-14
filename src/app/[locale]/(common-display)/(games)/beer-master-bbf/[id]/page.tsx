import React from 'react';
import Main from './Main';
import createServerClient from '@/utils/supabaseServer';
import { IGameState } from '@/lib/types/beerMasterGame';

export default async function Page({ params }: any) {
    const { id } = params;

    const gameData = await getGameStateData(id);

    const [game] = await Promise.all([gameData]);

    return <Main gameState={game} />;
}

async function getGameStateData(gameId: string) {
    console.log(gameId);
    const supabase = await createServerClient();

    const { data: game, error: gameError } = await supabase
        .from('bm_steps_game_state')
        .select(
            `
                *,
                bm_steps (
                    *,
                    bm_steps_questions (
                        *
                    ),
                    bm_steps_rewards (
                        *
                    )
                ),
                bm_steps_achievements (*)
          `,
        )
        .eq('id', gameId)
        .single();

    return game as IGameState;
}
