import createServerClient from '../../../../../../utils/supabaseServer';
import { Reviews } from './Reviews';
import { redirect } from 'next/navigation';
import { IReview } from '../../../../../../lib/types/types';
import readUserSession from '../../../../../../lib/actions';

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

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(
            `
        *
      `,
        )
        .eq('id', session.id);

    if (reviewsError) throw reviewsError;

    return { reviews: reviewsData as IReview[] };
}
