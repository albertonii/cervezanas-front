import { IEventExperience } from '../../../../lib/types/quiz';
import { IProduct } from '../../../../lib/types/types';
import createServerClient from '../../../../utils/supabaseServer';
import MainMaestroCervecero from './MainMaestroCervecero';

export const metadata = {
    title: { default: 'Experiencia Cervezanas', template: `%s | Cervezanas` },
    description: 'Experiencia Maestro Cervecero - Barcelona Beer Festival 2024',
};

export default async function MaestroCerveceroPage() {
    const eventExperiencesData = getMaestroCerveceroEventExperiences();
    const [eventExperiences] = await Promise.all([eventExperiencesData]);

    return <MainMaestroCervecero eventExperiences={eventExperiences} />;
}

async function getMaestroCerveceroEventExperiences() {
    const supabase = await createServerClient();

    const eventId = process.env.NEXT_PUBLIC_EVENT_ID;

    if (!eventId) throw new Error('No event id found in env vars');

    const { data: eventExperiences, error: eventExperiencesError } =
        await supabase
            .from('event_experiences')
            .select(
                `
                *,
                cp_mobile (*),
                cp_fixed (*),
                experience_id (*)
            `,
            )
            .eq('event_id', eventId);

    if (eventExperiencesError) throw eventExperiencesError;

    return eventExperiences as IEventExperience[];
}
