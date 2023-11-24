import { IReview } from "../../../../../../lib/types";
import createServerClient from "../../../../../../utils/supabaseServer";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../constants";
import { Reviews } from "./Reviews";

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
  const supabase = await createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  const { data: reviewsData, error: reviewsError } = await supabase
    .from("reviews")
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
}
