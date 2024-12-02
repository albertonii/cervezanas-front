import EventLayout from './EventLayout';
import readUserSession from '@/lib//actions';
import createServerClient from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { IConsumptionPoint } from '@/lib/types/consumptionPoints';

export default async function EventsPage() {
    const cpsData = getCPData();
    const eventsCounterData = getEventsCounter();
    const [cps, eventsCounter] = await Promise.all([
        cpsData,
        eventsCounterData,
    ]);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EventLayout cps={cps} counter={eventsCounter} />
        </Suspense>
    );
}

async function getCPData() {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { data, error: cpError } = await supabase
        .from('cp')
        .select(
            `
                *
            `,
        )
        .eq('owner_id', session.id);

    if (cpError) throw cpError;

    return data as IConsumptionPoint[];
}

async function getEventsCounter() {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { count, error } = await supabase
        .from('events')
        .select('id', { count: 'exact' }) // Selecciona solo una columna y habilita el conteo
        .eq('owner_id', session.id);

    if (error) throw error;

    return count as number | 0;
}
