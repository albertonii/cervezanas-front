import { ICPFixed, ICPMobile } from '@/lib//types/types';
import createServerClient from '@/utils/supabaseServer';
import Events from './Events';

export default async function EventsPage() {
    const cpsMobileData = getCPMobileData();
    const cpsFixedData = getCPFixedData();
    const eventsCounterData = getEventsCounter();
    const [cpsMobile, cpsFixed, eventsCounter] = await Promise.all([
        cpsMobileData,
        cpsFixedData,
        eventsCounterData,
    ]);

    return (
        <Events
            cpsMobile={cpsMobile}
            cpsFixed={cpsFixed}
            counter={eventsCounter}
        />
    );
}

async function getCPMobileData() {
    const supabase = await createServerClient();

    const { data: cpMobiles, error: cpError } = await supabase
        .from('cp_mobile')
        .select(
            `
            *,
            consumption_points (
                owner_id,
                users (username, email)
            )
          `,
        );

    if (cpError) throw cpError;

    return cpMobiles as ICPMobile[];
}

async function getCPFixedData() {
    const supabase = await createServerClient();

    const { data: cpFixeds, error: cpError } = await supabase
        .from('cp_fixed')
        .select(
            `
            *,
            consumption_points (
                owner_id,
                users (username, email)
            )
          `,
        );

    if (cpError) throw cpError;

    return cpFixeds as ICPFixed[];
}

async function getEventsCounter() {
    const supabase = await createServerClient();

    const { count, error } = await supabase
        .from('events')
        .select('id', { count: 'exact' }); // Selecciona solo una columna y habilita el conteo

    if (error) throw error;

    return count as number | 0;
}
