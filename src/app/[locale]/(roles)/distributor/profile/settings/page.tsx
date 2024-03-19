import Profile from './Profile';
import createServerClient from '../../../../../../utils/supabaseServer';
import { redirect } from 'next/navigation';
import { VIEWS } from '../../../../../../constants';
import { IDistributorUser } from '../../../../../../lib/types/types';
import readUserSession from '../../../../../../lib/actions';

export default async function ProfilePage() {
    const profile = await getProfileData();
    if (!profile) return <></>;

    return (
        <>
            <Profile profile={profile} />
        </>
    );
}

async function getProfileData() {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { data: profileData, error: profileError } = await supabase
        .from('distributor_user')
        .select(
            `
        user_id,
        created_at,
        nif,
        bank_account,
        company_name,
        company_description,
        location_id,
        users (name, lastname, email)
      `,
        )
        .eq('user_id', session.id)
        .single();

    if (profileError) throw profileError;
    return profileData as IDistributorUser;
}
