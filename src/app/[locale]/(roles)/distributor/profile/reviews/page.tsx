import { Reviews } from './Reviews';
import { redirect } from 'next/navigation';
import { VIEWS } from '@/constants';
import { IReview } from '@/lib/types/types';
import createServerClient from '@/utils/supabaseServer';
import readUserSession from '@/lib//actions';

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
    //TODO: We need to create a new table for the reviews related to the user talking about the distribution

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
