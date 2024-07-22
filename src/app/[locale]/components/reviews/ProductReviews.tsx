import React from 'react';
import { IndividualReview } from './IndividualReview';
import { IReview } from '@/lib//types/types';

interface Props {
    reviews: IReview[];
    handleSetReviews: React.Dispatch<React.SetStateAction<IReview[]>>;
}

export function ProductReviews({ reviews, handleSetReviews }: Props) {
    return (
        <section>
            {reviews.map((review) => (
                <div key={review.id} className="mb-8">
                    <IndividualReview
                        review={review}
                        handleSetReviews={handleSetReviews}
                    />
                </div>
            ))}
        </section>
    );
}
