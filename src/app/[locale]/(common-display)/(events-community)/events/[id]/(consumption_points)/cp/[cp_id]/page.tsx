import CPInformation from './CPInformation';
import createServerClient from '@/utils/supabaseServer';
import { IEventExperience } from '@/lib/types/types';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';

export default async function CPMobilePage({ params }: any) {
    const { id: eventId, cp_id: cpId } = params;
    const cpData = getConsumptionPoint(cpId);
    const eventExperiencesData = getEventExperience(eventId, cpId);
    const [eventExperiences, cpEvent] = await Promise.all([
        eventExperiencesData,
        cpData,
    ]);

    return (
        <CPInformation
            cpEvent={cpEvent}
            eventId={eventId}
            eventExperiences={eventExperiences}
        />
    );
}

async function getConsumptionPoint(cpId: string) {
    const supabase = await createServerClient();

    const { data: cp, error: cpMobileError } = await supabase
        .from('cp_events')
        .select(
            ` 
              *,
              cp (
                *,
                cp_products (
                    *,
                    product_packs (
                        *,
                        products (
                            *,
                            product_media (*)
                        )
                    )
                )
              )
            `,
        )
        .eq('id', cpId)
        .single();

    if (cpMobileError) console.error(cpMobileError);

    return cp as IConsumptionPointEvent;
}

async function getEventExperience(eventId: string, cpId: string) {
    const supabase = await createServerClient();

    const { data: eventExperience, error: eventExperienceError } =
        await supabase
            .from('event_experiences')
            .select(
                ` 
                  id,
                  created_at,
                  event_id,
                  cp_id,
                  experience_id,
                  experiences!public_event_experiences_experience_id_fkey (
                    *
                  )
                `,
            )
            .eq('cp_mobile_id', cpId)
            .eq('event_id', eventId);

    if (eventExperienceError) console.error(eventExperienceError);

    return eventExperience as IEventExperience[];
}
