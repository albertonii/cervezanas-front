import { IReview } from "../lib/types.d";
import { IndividualReview } from "./reviews";

interface Props {
  reviews: IReview[];
  handleSetReviews: React.Dispatch<React.SetStateAction<IReview[]>>;
}

export default function ProductReviews({ reviews, handleSetReviews }: Props) {
  return (
    <div>
      {reviews.map((review) => (
        <div key={review.id} className="mb-8">
          <IndividualReview
            review={review}
            handleSetReviews={handleSetReviews}
          />
        </div>
      ))}
    </div>
  );
}
