import { IEventExperience } from '../../../../lib/types/quiz';
import { IProduct } from '../../../../lib/types/types';
import createServerClient from '../../../../utils/supabaseServer';
import MainMaestroCervecero from './MainMaestroCervecero';

export const metadata = {
    title: { default: 'Experiencia Cervezanas', template: `%s | Cervezanas` },
    description: 'Experiencia Maestro Cervecero - Barcelona Beer Festival 2024',
};

export default async function MaestroCerveceroPage() {
    const eventExperiencesData = getMarketplaceProducts();
    const [eventExperiences] = await Promise.all([eventExperiencesData]);

    return <MainMaestroCervecero eventExperiences={eventExperiences} />;
}

async function getMarketplaceProducts() {
    const supabase = await createServerClient();

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
            .eq('event_id', '16092429-963d-41d6-98c4-b2a3eac00912');

    if (eventExperiencesError) throw eventExperiencesError;

    return eventExperiences as IEventExperience[];
}
