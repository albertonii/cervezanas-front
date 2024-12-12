import createServerClient from '@/utils/supabaseServer';
import readUserSession from '@/lib/actions';
import EventExperience from './EventExperience';
import { redirect } from 'next/navigation';
import { IEventExperience } from '@/lib/types/types';

export default async function CPPage({ params }: any) {
    const { ex_id: eventExperienceId } = params;
    const eventExperienceData = getEventExperienceData(eventExperienceId);
    const [eventExperience] = await Promise.all([eventExperienceData]);

    return <EventExperience eventExperience={eventExperience} />;
}

async function getEventExperienceData(eventExperienceId: string) {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { data: eventExperience, error: eventExperienceError } =
        await supabase
            .from('event_experiences')
            .select(
                `
                *,
                id,
                created_at,
                event_id,
                cp_id,
                experience_id,
                experiences!public_event_experiences_experience_id_fkey (
                  *,
                  bm_questions (
                    *,
                    products (
                      id,
                      name
                    )
                  )
                ),
                cp (
                  *,
                  cp_products (
                    *,
                    product_packs!cp_products_product_pack_id_fkey (
                      *,
                      products!product_packs_product_id_fkey (
                        id,
                        name,
                        description,
                        type,
                        product_media!product_media_product_id_fkey (*)
                      )
                    )
                  )
                ),
                events!public_event_experiences_event_id_fkey (
                  *
                )
              `,
            )
            .eq('id', eventExperienceId)
            .single();

    if (eventExperienceError) console.error(eventExperienceError);

    // TODO: Volver aquí. Ahora los cp_products pertenecen a cp_events. Por lo que hemos puesto unknow para que no de problema. Hay que crear una tabla nueva.
    return eventExperience as unknown as IEventExperience;
}
