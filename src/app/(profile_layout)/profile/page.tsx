import Profile from "./Profile";
import { ROUTE_SIGNIN } from "../../../config";
import { IProfile } from "../../../lib/types.d";
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
  // Return different data by role
  // if (
  //   profileData[0].role === "producer" ||
  //   profileData[0].role === "consumer"
  // ) {
  const { data: productsData, error: productsError } = await supabase
    .from("products")
    .select(
      `
        *, 
        product_multimedia (*),
        product_inventory (*),
        likes (*),
        product_lot (*),
        beers (*), 
        product_pack (*)
      `
    )
    .eq("owner_id", session.user.id);

  if (productsError) throw productsError;

  profileData[0].products = productsData;
  return { profile: profileData[0] as IProfile };
  // }
}
