import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { SupabaseProps } from '../../../../../constants';
import { IBusinessOrder, IOrderItem } from '../../../../../lib/types';
import { formatCurrency } from '../../../../../utils/formatCurrency';
import Button from '../../../components/common/Button';
import DisplayImageProduct from '../../../components/common/DisplayImageProduct';
import ProductReview from '../../../components/reviews/ProductReview';

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

interface Props {
  bOrder: IBusinessOrder;
  orderItem: IOrderItem;
}

export default function BOrderItem({ bOrder, orderItem }: Props) {
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
    <>
      <article
        className="grid justify-between gap-2 rounded-lg border border-gray-200 sm:space-x-4 sm:p-4 lg:grid-cols-12 lg:space-x-2 lg:p-6"
        key={orderItem.business_order_id + '-' + orderItem.product_pack_id}
      >
        {orderItem.product_packs && (
          <>
            <header className="col-span-12">
              <h3 className="text-xl font-medium text-gray-900 hover:text-beer-draft">
                <p className="text-lg font-medium text-gray-900">
                  {orderItem.product_packs.name}
                </p>
              </h3>
            </header>

            <figure className="aspect-w-1 aspect-h-1 sm:aspect-none col-span-4 h-20 w-auto flex-shrink-0 justify-center overflow-hidden rounded-lg lg:h-40 ">
              <DisplayImageProduct
                width={120}
                height={120}
                alt={''}
                imgSrc={`${
                  BASE_PRODUCTS_URL +
                  decodeURIComponent(orderItem.product_packs.img_url)
                }`}
                class="h-full w-full object-cover object-center"
              />
            </figure>

            <div className="col-span-8 flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-900 ">
                {formatCurrency(orderItem.product_packs.price)}
              </p>

              <span className="text-sm text-gray-900">
                <p>{t('quantity_in_pack')}:</p>

                <p className="font-medium">
                  {orderItem.product_packs.quantity} {t('units')}
                </p>
              </span>

              <span className="text-sm text-gray-900">
                <p>{t('quantity_bought')}:</p>
                <p className="font-medium">
                  {orderItem.quantity} {t('packs')}
                </p>
              </span>
            </div>
          </>
        )}
      </article>

      {/* Review Product  */}
      <section className="col-span-12 mt-6">
        <div className="mt-3 space-y-3 text-beer-dark">
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
        </div>

        {showReview && orderItem.product_packs?.products && (
          <ProductReview
            orderItem={orderItem}
            handleShowReviewOnClick={handleShowReviewOnClick}
            handleSetIsReviewed={handleSetIsReviewed}
          />
        )}
      </section>
    </>
  );
}
