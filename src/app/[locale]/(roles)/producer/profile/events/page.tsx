import EventLayout from './EventLayout';
import readUserSession from '../../../../../../lib/actions';
import createServerClient from '../../../../../../utils/supabaseServer';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { VIEWS } from '../../../../../../constants';
import { ICPFixed, ICPMobile } from '../../../../../../lib/types/types';

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
        <Suspense fallback={<div>Loading...</div>}>
            <EventLayout
                cpsMobile={cpsMobile}
                cpsFixed={cpsFixed}
                counter={eventsCounter}
            />
        </Suspense>
    );
}

async function getCPMobileData() {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect(VIEWS.SIGN_IN);
    }

    const { data: cpMobiles, error: cpError } = await supabase
        .from('cp_mobile')
        .select(
            `
                *
            `,
        )
        .eq('owner_id', session.id);

    if (cpError) throw cpError;

    return cpMobiles as ICPMobile[];
}

async function getCPFixedData() {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect(VIEWS.SIGN_IN);
    }

    const { data: cpFixeds, error: cpError } = await supabase
        .from('cp_fixed')
        .select(
            `
            *
          `,
        )
        .eq('owner_id', session.id);

    if (cpError) throw cpError;

    return cpFixeds as ICPFixed[];
}

async function getEventsCounter() {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect(VIEWS.SIGN_IN);
    }

    const { count, error } = await supabase
        .from('events')
        .select('id', { count: 'exact' }) // Selecciona solo una columna y habilita el conteo
        .eq('owner_id', session.id);

    if (error) throw error;

    return count as number | 0;
}
