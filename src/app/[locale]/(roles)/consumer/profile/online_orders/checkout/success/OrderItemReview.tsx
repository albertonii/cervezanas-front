import Button from '@/app/[locale]/components/ui/buttons/Button';
import ProductReview from '@/app/[locale]/components/reviews/ProductReview';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IBusinessOrder, IOrderItem } from '@/lib/types/types';

interface Props {
    bOrder: IBusinessOrder;
    orderItem: IOrderItem;
}

export default function OrderItemReview({ bOrder, orderItem }: Props) {
    const t = useTranslations();

    const [showReview, setShowReview] = useState(false);
    const [isReviewed, setIsReviewed] = useState(orderItem.is_reviewed);

    useEffect(() => {
        const isReviewedRes =
            isReviewed || bOrder.status !== 'delivered' ? true : false;
        setIsReviewed(isReviewedRes);
    }, [isReviewed]);

    const handleShowReviewOnClick = (showReview: boolean) => {
        setShowReview(showReview);
    };

    const handleSetIsReviewed = (isReviewed: boolean) => {
        setIsReviewed(isReviewed);
    };

    return (
        <section className="col-span-12 mt-6 ">
            {/* Review Product  */}
            <section className="mt-3 space-y-3 space-x-2 lg:space-x-8 text-beer-dark">
                {orderItem.is_reviewed && (
                    <span>{t('product_already_reviewed_condition')}</span>
                )}

                {bOrder.status !== 'delivered' && (
                    <span>{t('write_review_condition')}</span>
                )}

                <Button
                    disabled={isReviewed}
                    primary
                    medium
                    class="my-6 font-medium text-beer-draft hover:text-beer-dark "
                    onClick={() => {
                        if (
                            !orderItem.is_reviewed &&
                            bOrder.status === 'delivered' &&
                            orderItem.product_packs?.product_id
                        ) {
                            handleShowReviewOnClick(true);
                        }
                    }}
                >
                    {t('make_review_product_button')}
                </Button>
            </section>

            {showReview && orderItem.product_packs?.products && (
                <ProductReview
                    orderItem={orderItem}
                    handleShowReviewOnClick={handleShowReviewOnClick}
                    handleSetIsReviewed={handleSetIsReviewed}
                />
            )}
        </section>
    );
}
