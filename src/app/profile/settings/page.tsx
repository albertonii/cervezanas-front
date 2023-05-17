import Profile from "./Profile";
import { IProfile } from "../../../lib/types.d";
import { createServerClient } from "../../../utils/supabaseServer";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../constants";

export default async function ProfilePage() {
  const { profile } = await getProfileData();
  if (!profile) return null;

  return (
    <>
      <Profile profile={profile} />
    </>
  );
}

async function getProfileData() {
  const supabase = createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.ROUTE_SIGNIN);
  }

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
}
