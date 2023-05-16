import { ROUTE_SIGNIN } from "../../../config";
import { IReview } from "../../../lib/types.d";
import { createServerClient } from "../../../utils/supabaseServer";
import { Reviews } from "../../../components/customLayout";

export default async function ReviewsPage() {
  const { reviews } = await getReviewsData();
  if (!reviews) return null;

  return (
    <>
      <Reviews reviews={reviews} />
    </>
  );
}

async function getReviewsData() {
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

  const { data: reviewsData, error: reviewsError } = await supabase
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

  if (reviewsError) throw reviewsError;

  return { reviews: reviewsData as IReview[] };
  // }
}
