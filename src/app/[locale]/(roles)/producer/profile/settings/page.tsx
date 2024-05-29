import createServerClient from '../../../../../../utils/supabaseServer';
import readUserSession from '../../../../../../lib/actions';
import Profile from './Profile';
import { IProducerUser } from '../../../../../../lib/types/types';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function ProfilePage() {
    const profile = await getProfileData();
    if (!profile) return <></>;

    return (
        <Suspense fallback={<h3>cargando..</h3>}>
            <Profile profile={profile} />
        </Suspense>
    );
}

async function getProfileData() {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { data: profileData, error: profileError } = await supabase
        .from('producer_user')
        .select(
            `
                *,
                users (*)
            `,
        )
        .eq('user_id', session.id)
        .single();

    if (profileError) throw profileError;

    return profileData as IProducerUser;
}
