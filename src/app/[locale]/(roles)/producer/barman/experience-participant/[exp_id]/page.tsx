import readUserSession from '@/lib/actions';
import createServerClient from '@/utils/supabaseServer';
import ManageExperienceParticipation from './ManageExperienceParticipation';
import { redirect } from 'next/navigation';
import { IBMExperienceParticipants } from '@/lib/types/quiz';

export default async function BarmanProductPage({ params }: any) {
    const { exp_id: experienceParticipantId } = params;
    const experienceParticipantData = getExperienceParticipantData(
        experienceParticipantId,
    );
    const [experienceParticipant] = await Promise.all([
        experienceParticipantData,
    ]);
    return (
        <ManageExperienceParticipation
            experienceParticipant={experienceParticipant}
        />
    );
}

async function getExperienceParticipantData(experienceParticipantId: string) {
    const supabase = await createServerClient();
    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { data, error: eventOrderItemError } = await supabase
        .from('bm_experience_participants')
        .select(
            `
                *,
                events (*),
                cp_mobile (*),
                cp_fixed (*),
                gamification (
                    *,
                    users (
                        *                      
                    )
                )
            `,
        )
        .eq('id', experienceParticipantId)
        .single();

    if (eventOrderItemError) throw eventOrderItemError;

    return data as IBMExperienceParticipants;
}
