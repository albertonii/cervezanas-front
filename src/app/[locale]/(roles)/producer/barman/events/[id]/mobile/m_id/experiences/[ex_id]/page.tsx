import readUserSession from '../../../../../../../../../../../lib/actions';
import ManageExperienceParticipation from '../ManageExperienceParticipation';
import createServerClient from '../../../../../../../../../../../utils/supabaseServer';
import { redirect } from 'next/navigation';
import { VIEWS } from '../../../../../../../../../../../constants';
import { IBMExperienceParticipants } from '../../../../../../../../../../../lib/types/quiz';

export default async function BarmanProductPage({ params }: any) {
    const { id: eventId, m_id: cpmId, ex_id: experienceId } = params;
    const experienceParticipantData = getExperienceParticipantData(
        eventId,
        cpmId,
        experienceId,
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

async function getExperienceParticipantData(
    eventId: string,
    cpmId: string,
    experienceId: string,
) {
    const supabase = await createServerClient();
    const session = await readUserSession();

    if (!session) {
        redirect(VIEWS.SIGN_IN);
    }

    const { data, error: eventOrderItemError } = await supabase
        .from('bm_experience_participants')
        .select(
            `
                *,
                users (
                    *
                )
            `,
        )
        .eq('gamification_id', session.id)
        .eq('event_id', eventId)
        .eq('cpm_id', cpmId)
        .eq('experience_id', experienceId)
        .single();

    if (eventOrderItemError) throw eventOrderItemError;

    const eventOrderItem = data as IBMExperienceParticipants;

    return eventOrderItem;
}
