import { IReview } from '@/lib//types/types';
import { redirect } from 'next/navigation';
import { VIEWS } from '@/constants';
import { Reviews } from './Reviews';
import createServerClient from '@/utils/supabaseServer';
import readUserSession from '@/lib//actions';

export default async function ReviewsPage() {
    const reviewsData = await getReviewsData();
    const [reviews] = await Promise.all([reviewsData]);

    if (!reviews) return <></>;

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
              *,
              products (
                *,
                product_media (
                  *
                )
              ),
              users (
                id,
                username,
                avatar_url
              )
            `,
        )
        .eq('owner_id', session.id);

    if (reviewsError) throw reviewsError;

    return reviewsData as IReview[];
}
