import readUserSession from '@/lib//actions';
import createServerClient from '@/utils/supabaseServer';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { ConsumptionPoints } from './ConsumptionPoints';
import { IProfile, IConsumptionPoints } from '@/lib//types/types';

export default async function ProfilePage() {
    const cpsData = getCPSData();
    const profileData = getProfileData();
    const counterCPMobileData = getCPMobileCounter();
    const counterCPFixedData = getCPFixedCounter();
    const [cps, profile, counterCPMobile, counterCPFixed] = await Promise.all([
        cpsData,
        profileData,
        counterCPMobileData,
        counterCPFixedData,
    ]);
    if (!profile) return <></>;

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ConsumptionPoints
                cps={cps ?? []}
                profile={profile}
                counterCPMobile={counterCPMobile}
                counterCPFixed={counterCPFixed}
            />
        </Suspense>
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

async function getCPMobileCounter() {
    const supabase = await createServerClient();
    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { count, error: cpFixedError } = await supabase
        .from('cp_mobile')
        .select('id', { count: 'exact' })
        .eq('owner_id', session.id);

    if (cpFixedError) throw cpFixedError;

    return count as number | 0;
}

async function getCPFixedCounter() {
    const supabase = await createServerClient();
    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { count, error: cpFixedError } = await supabase
        .from('cp_fixed')
        .select('id', { count: 'exact' })
        .eq('owner_id', session.id);

    if (cpFixedError) throw cpFixedError;

    return count as number | 0;
}
