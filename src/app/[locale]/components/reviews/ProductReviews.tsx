import React from 'react';
import { IndividualReview } from './IndividualReview';
import { IReview } from '@/lib/types/types';

interface Props {
    reviews: IReview[];
    handleSetReviews: React.Dispatch<React.SetStateAction<IReview[]>>;
}

export function ProductReviews({ reviews, handleSetReviews }: Props) {
    return (
        <section className="flex overflow-x-auto space-x-4 py-4">
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="flex-shrink-0 bg-white shadow-md rounded-lg p-4 w-80"
                >
                    <IndividualReview
                        review={review}
                        handleSetReviews={handleSetReviews}
                    />
                </div>
            ))}
        </section>
    );
}
