import Profile from "./Profile";
import { ROUTE_SIGNIN } from "../../../config";
import { IProfile } from "../../../lib/types";
import { createServerClient } from "../../../utils/supabaseServer";

export default async function ProfilePage() {
  const { profile } = await getProfileData();
  return (
    <>
      <Profile profile={profile!} />
    </>
  );
}

async function getProfileData() {
  const supabase = createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: ROUTE_SIGNIN,
        permanent: false,
      },
    };

  const { data: profileData, error: profileError } = await supabase
    .from("users")
    .select(
      `
        *,
        orders (*),
        campaigns (*),
        customize_settings (*),
        profile_location (*)
      `
    )
    .eq("id", session.user.id);

  if (profileError) throw profileError;

  return { profile: profileData[0] as IProfile };
  // }
}
