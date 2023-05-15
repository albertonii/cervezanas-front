import { ROUTE_SIGNIN } from "../../config";
import { createServerClient } from "../../utils/supabaseServer";
import Profile from "./Profile";

export default async function ProfilePage() {
  const { submittedCPs, monthlyProducts, profile, reviews, product_lots, cps } =
    await getProfileData();

  return (
    <>
      <Profile
        submittedCPs={submittedCPs}
        monthlyProducts={monthlyProducts}
        profile={profile}
        reviews={reviews}
        product_lots={product_lots}
        cps={cps}
      />
    </>
  );
}

async function getProfileData() {
  // Create authenticated Supabase Client
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
  if (
    profileData[0].role === "producer" ||
    profileData[0].role === "consumer"
  ) {
    const {
      data: productsData,
      error: productsError,
      count,
    } = await supabase
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

    const { data: reviewData, error: reviewError } = await supabase
      .from("reviews")
      .select(
        `
        *,
        products (*,
          product_multimedia (*)
        ),
        users (*)
      `
      )
      .eq("owner_id", session.user.id);

    if (reviewError) throw reviewError;

    const { data: productLotData, error: productLotError } = await supabase
      .from("product_lot")
      .select(
        `
      *,
      products (
        *
      )
    `
      )
      .eq("owner_id", session?.id);

    if (productLotError) console.error(productLotError);

    const { data: cps, error: cpsError } = await supabase
      .from("consumption_points")
      .select(
        `
        *,
        cp_fixed (*),
        cp_mobile (*)
      `
      )
      .eq("owner_id", session.user.id);
    if (cpsError) console.error(cpsError);

    profileData[0].products = productsData;

    return {
      products_count: count,
      product_lots: productLotData ?? [],
      profile: profileData[0] ?? [],
      reviews: reviewData ?? [],
      cps: cps ?? [],
    };
  } else {
    const { data: submittedCPs, error: submittedCPsError } = await supabase
      .from("consumption_points")
      .select(
        `
        *,
        owner_id (id, name, email, username, role)
        `
      );

    if (submittedCPsError) console.error(submittedCPsError);

    const { data: monthlyProducts, error: mProductsError } =
      await supabase.from("monthly_products").select(`*,
              product_id(*)
              `);

    if (mProductsError) console.error(mProductsError);

    return {
      submittedCPs,
      monthlyProducts,
    };
  }
}
