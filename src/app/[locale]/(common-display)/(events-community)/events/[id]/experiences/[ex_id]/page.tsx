import createServerClient from '@/utils/supabaseServer';
import readUserSession from '@/lib/actions';
import EventExperience from './EventExperience';
import { redirect } from 'next/navigation';
import { VIEWS } from '@/constants';
import { IEventExperience } from '@/lib/types/quiz';

export default async function CPMobilePage({ params }: any) {
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
              id,
              created_at,
              event_id,
              cp_mobile_id,
              cp_fixed_id,
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
              cp_mobile!public_event_experiences_cp_mobile_id_fkey (
                *,
                cpm_products!cpm_products_cp_id_fkey (
                  *,
                  cp_id,
                  product_pack_id,
                  product_packs!cpm_products_product_pack_id_fkey (
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
              cp_fixed!public_event_experiences_cp_fixed_id_fkey (
                *
              ),
              events!public_event_experiences_event_id_fkey (
                *
              )
            `,
            )
            .eq('id', eventExperienceId)
            .single();

    if (eventExperienceError) console.error(eventExperienceError);

    return eventExperience as IEventExperience;
}
