import Profile from './Profile';
import { IUserTable } from '@/lib/types/types';
import createServerClient from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';
import { VIEWS } from '@/constants';
import { Suspense } from 'react';
import readUserSession from '@/lib//actions';

export default async function ProfilePage() {
    const { profile } = await getProfileData();
    if (!profile) return <></>;

    return (
        <Suspense fallback={<h3>cargando..</h3>}>
            <Profile profile={profile} />
        </Suspense>
    );
}

async function getProfileData() {
    const supabase = await createServerClient();

    // Be careful when protecting pages. The server gets the user session from the cookies, which can be spoofed by anyone.
    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select(
            `
                *,
                orders (*),
                campaigns (*),
                customize_settings (*),
                profile_location (*)
            `,
        )
        .eq('id', session.id)
        .single();

    if (profileError) throw profileError;

    return { profile: profileData as IUserTable };
}
