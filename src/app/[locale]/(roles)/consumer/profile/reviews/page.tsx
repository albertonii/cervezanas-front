import { IReview } from "../../../../../../lib/types.d";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../constants";
import { Reviews } from "./Reviews";
import createServerClient from "../../../../../../utils/supabaseServer";

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
        *
      `
    )
    .eq("id", session.user.id);

  if (reviewsError) throw reviewsError;

  return { reviews: reviewsData as IReview[] };
}
