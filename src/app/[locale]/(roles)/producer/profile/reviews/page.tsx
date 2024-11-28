import readUserSession from '@/lib//actions';
import createServerClient from '@/utils/supabaseServer';
import { Reviews } from './Reviews';
import { redirect } from 'next/navigation';
import { IReview } from '@/lib/types/types';

export default async function ReviewsPage() {
    const { reviews } = await getReviewsData();

    return <Reviews reviews={reviews} />;
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
                    id,
                    name,
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
        .eq('products.owner_id', session.id)
        .not('products', 'is', null);

    if (reviewsError) throw reviewsError;

    return { reviews: reviewsData as IReview[] };
}
