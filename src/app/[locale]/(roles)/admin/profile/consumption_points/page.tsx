import readUserSession from '@/lib//actions';
import createServerClient from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';
import { IConsumptionPoints } from '@/lib/types/consumptionPoints';
import { ConsumptionPoints } from './ConsumptionPoints';

export default async function ProfilePage() {
    const cpsData = getCPSData();
    const cpsCounter = getCPsCounter();
    const [cps, counter] = await Promise.all([cpsData, cpsCounter]);

    return (
        <>
            <ConsumptionPoints cps={cps} counterCP={counter} />
        </>
    );
}

async function getCPSData() {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { data: cps, error: cpsError } = await supabase
        .from('consumption_points')
        .select(
            `
                *,
                cps (*)
            `,
        );

    if (cpsError) console.error(cpsError);

    return cps as IConsumptionPoints[];
}

async function getCPsCounter() {
    const supabase = await createServerClient();
    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { count, error: cpError } = await supabase
        .from('cp')
        .select('id', { count: 'exact' })
        .eq('owner_id', session.id);

    if (cpError) throw cpError;

    return count as number | 0;
}
