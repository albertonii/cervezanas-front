import { redirect } from 'next/navigation';
import { VIEWS } from '@/constants';
import { IProfile, IConsumptionPoints } from '@/lib//types/types';
import createServerClient from '@/utils/supabaseServer';
import readUserSession from '@/lib//actions';
import { ConsumptionPoints } from './ConsumptionPoints';

export default async function ProfilePage() {
    const cpsData = getCPSData();
    const [cps] = await Promise.all([cpsData]);

    return (
        <>
            <ConsumptionPoints cps={cps ?? []} />
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
        cp_fixed (*),
        cp_mobile (*)
      `,
        );

    if (cpsError) console.error(cpsError);

    return cps as IConsumptionPoints[];
}
