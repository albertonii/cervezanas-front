import InfoCPMobile from './InfoCPMobile';
import {
    ICPMobile,
    IEventExperience,
} from '../../../../../../../../../lib/types/types';
import createServerClient from '../../../../../../../../../utils/supabaseServer';

export default async function CPMobilePage({ params }: any) {
    const { id: eventId, m_id: cpId } = params;
    const cpMobileData = getCPMobile(cpId);
    const eventExperiencesData = getEventExperience(eventId, cpId);
    const [eventExperiences, cpMobile] = await Promise.all([
        eventExperiencesData,
        cpMobileData,
    ]);

    return (
        <InfoCPMobile
            cpMobile={cpMobile}
            eventId={eventId}
            eventExperiences={eventExperiences}
        />
    );
}

async function getCPMobile(cpId: string) {
    const supabase = await createServerClient();

    const { data: cpsMobile, error: cpMobileError } = await supabase
        .from('cp_mobile')
        .select(
            ` 
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
              product_multimedia!product_multimedia_product_id_fkey (p_principal)
            )
          )
        )
      `,
        )
        .eq('id', cpId)
        .single();

    if (cpMobileError) console.error(cpMobileError);

    return cpsMobile as ICPMobile;
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
                  cp_mobile_id,
                  cp_fixed_id,
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
