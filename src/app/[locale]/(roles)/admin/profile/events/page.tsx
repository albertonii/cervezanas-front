import Events from './Events';
import createServerClient from '@/utils/supabaseServer';
import { IConsumptionPoint } from '@/lib/types/consumptionPoints';

export default async function EventsPage() {
    const cpsData = getCPData();
    const eventsCounterData = getEventsCounter();
    const [cps, eventsCounter] = await Promise.all([
        cpsData,
        eventsCounterData,
    ]);

    return <Events cps={cps} counter={eventsCounter} />;
}

async function getCPData() {
    const supabase = await createServerClient();

    const { data, error: cpError } = await supabase.from('cp').select(
        `
            *,
            consumption_points (
                owner_id,
                users (username, email)
            )
          `,
    );

    if (cpError) throw cpError;

    return data as IConsumptionPoint[];
}

async function getEventsCounter() {
    const supabase = await createServerClient();

    const { count, error } = await supabase
        .from('events')
        .select('id', { count: 'exact' }); // Selecciona solo una columna y habilita el conteo

    if (error) throw error;

    return count as number | 0;
}
