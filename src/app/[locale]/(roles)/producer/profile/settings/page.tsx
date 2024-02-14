import Profile from './Profile';
import { IProducerUser } from '../../../../../../lib/types';
import createServerClient from '../../../../../../utils/supabaseServer';
import { redirect } from 'next/navigation';
import { VIEWS } from '../../../../../../constants';
import readUserSession from '../../../../../../lib/actions';
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

  const {
    data: { session },
  } = await readUserSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  const { data: profileData, error: profileError } = await supabase
    .from('producer_user')
    .select(
      `
        *
      `,
    )
    .eq('user_id', session.user.id)
    .single();

  // const { data: profileData, error: profileError } = await supabase
  //   .from("users")
  //   .select(
  //     `
  //     *,
  //     orders (*),
  //     campaigns (*),
  //     customize_settings (*),
  //     profile_location (*)
  //   `
  //   )
  //   .eq("id", session.user.id)
  //   .single();

  if (profileError) throw profileError;

  return profileData as IProducerUser;
}
