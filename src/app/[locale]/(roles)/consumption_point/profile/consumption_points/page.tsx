import { redirect } from 'next/navigation';
import {
  IProfile,
  IConsumptionPoints,
} from '../../../../../../lib/types/types';
import createServerClient from '../../../../../../utils/supabaseServer';
import readUserSession from '../../../../../../lib/actions';
import { ConsumptionPoints } from './ConsumptionPoints';

export default async function ProfilePage() {
  const cpsData = getCPSData();
  const profileData = getProfileData();
  const [cps, profile] = await Promise.all([cpsData, profileData]);
  if (!profile) return <></>;

  return (
    <>
      <ConsumptionPoints cps={cps ?? []} profile={profile} />
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
