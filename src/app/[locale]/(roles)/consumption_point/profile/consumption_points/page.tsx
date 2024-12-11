import readUserSession from '@/lib//actions';
import createServerClient from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';
import { IProfile } from '@/lib/types/types';
import { ConsumptionPoints } from './ConsumptionPoints';
import { IConsumptionPoints } from '@/lib/types/consumptionPoints';

export default async function ProfilePage() {
    const cpsData = getCPSData();
    const profileData = getProfileData();
    const counterCPsData = getCPsCounter();
    const [cps, profile, counterCPs] = await Promise.all([
        cpsData,
        profileData,
        counterCPsData,
    ]);
    if (!profile) return <></>;

    return (
        <>
            <ConsumptionPoints
                cps={cps ?? []}
                profile={profile}
                counterCP={counterCPs}
            />
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
                cp (*)
            `,
        )
        .eq('owner_id', session.id);
    if (cpsError) console.error(cpsError);

    return cps as IConsumptionPoints[];
}

async function getProfileData() {
    const supabase = await createServerClient();
    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select(
            `
        cp_organizer_status
      `,
        )
        .eq('id', session.id);

    if (profileError) throw profileError;

    return profileData[0] as IProfile;
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
