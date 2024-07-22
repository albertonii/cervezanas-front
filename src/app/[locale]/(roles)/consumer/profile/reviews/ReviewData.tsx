import Link from 'next/link';
import React, { ComponentProps } from 'react';
import { Rate } from '@/app/[locale]/components/reviews/Rate';
import { DeleteButton } from '@/app/[locale]/components/common/DeleteButton';
import { useLocale, useTranslations } from 'next-intl';
import { IReview } from '@/lib//types/types';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { formatDateString } from '@/utils/formatDate';
import DisplayImageProduct from '@/app/[locale]/components/common/DisplayImageProduct';
import { SupabaseProps } from '@/constants';
import DisplayImageProfile from '@/app/[locale]/components/common/DisplayImageProfile';

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

interface Props {
    review: IReview;
    handleSetReviews: ComponentProps<any>;
}

export default function ReviewData({ review, handleSetReviews }: Props) {
    const t = useTranslations();
    const locale = useLocale();
    const { supabase } = useAuth();

    const starColor = { filled: '#fdc300', unfilled: '#a87a12' };

    const handleDeleteReview = async (reviewId: string) => {
        try {
            const { error } = await supabase
                .from('reviews')
                .delete()
                .match({ id: reviewId });
            if (error) throw error;

            // TODO: Hay que añadir la referecia a review para la tabla order_items así podemos modificar el estado de review

            // Update order item is_reviewed status
            //   const { error: updateOrderItemError } = await supabase
            //     .from("order_items")
            //     .update({ is_reviewed: true })
            //     .eq("product_pack_id", pPackId)
            //     .eq("business_order_id", bOrderId);

            //   if (updateOrderItemError) {
            //     console.error(updateOrderItemError);
            //     throw updateOrderItemError;
            //   }

            handleSetReviews(reviewId);
        } catch (error) {
            alert(error);
        }
    };

    return (
        <article className="relative grid grid-cols-4 md:gap-8">
            {/* Delete review button in top right corner  */}
            {/* <div className="absolute right-0">
        <DeleteButton onClick={() => handleDeleteReview(review.id)} />
      </div> */}

            <section className="col-span-4 space-y-6 lg:col-span-1 ">
                {/* Seller  */}
                <div className="flex flex-col items-center space-y-2">
                    <h2 className="truncate text-xl transition-all ">
                        {t('seller_username')}:{' '}
                        <span className="hover:text-purple-500 cursor-pointer font-bold text-beer-draft hover:text-beer-blonde">
                            <Link
                                className=""
                                href={`/users/${review.users?.id}`}
                                locale={locale}
                            >
                                {review.users?.username}
                            </Link>
                        </span>
                    </h2>

                    <DisplayImageProfile
                        imgSrc={`${review.users?.avatar_url}`}
                        class={'mx-auto h-24 w-24 rounded-full'}
                    />
                </div>
            </section>

            {/* Review rate */}
            <section className="col-span-4 mt-4 space-y-4 md:mt-0 lg:col-span-3">
                <div className="tems-start flex flex-col-reverse justify-between md:flex-row md:items-center">
                    <div className="space-y-2">
                        {/* Img Product  */}
                        <div className="flex flex-row items-center space-x-4 space-y-4">
                            <figure className="aspect-w-1 aspect-h-1 sm:aspect-none col-span-4 h-20 w-auto flex-shrink-0 justify-center overflow-hidden rounded-lg lg:h-40 ">
                                {
                                    <DisplayImageProduct
                                        width={80}
                                        height={80}
                                        alt={''}
                                        imgSrc={`${
                                            BASE_PRODUCTS_URL +
                                            decodeURIComponent(
                                                review.products
                                                    ?.product_multimedia
                                                    ?.p_principal ??
                                                    '/icons/beer-240.png',
                                            )
                                        }`}
                                        class="h-full w-full object-cover object-center"
                                    />
                                }
                            </figure>

                            <span className="hover:text-purple-500 mr-auto cursor-pointer truncate text-xl font-bold text-beer-draft transition-all hover:text-beer-blonde dark:text-beer-foam">
                                <Link
                                    href={`/products/${review.products?.id}`}
                                    locale={locale}
                                >
                                    {review.products?.name}
                                </Link>
                            </span>
                        </div>

                        <footer>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                {t('reviewed')}:{' '}
                                <time dateTime="2022-01-20 19:00">
                                    {formatDateString(review.created_at)}
                                </time>
                            </p>
                        </footer>
                    </div>

                    <div className="flex space-x-2">
                        <Rate
                            rating={review.overall}
                            onRating={() => void {}}
                            count={review.overall}
                            color={starColor}
                            editable={false}
                        />

                        <p className="inline-flex items-center rounded bg-beer-blonde p-1.5 text-sm font-semibold text-white">
                            {review.overall} / 5
                        </p>
                    </div>
                </div>

                <div className="w-full rounded-md bg-beer-softFoam p-4 shadow-lg">
                    <p className="text-md font-medium text-beer-dark dark:text-gray-400">
                        {review.comment}
                    </p>
                </div>

                {/* Stars  */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    <div className="text-md w-full ">
                        <label htmlFor="aroma">{t('aroma')}</label>

                        <Rate
                            rating={review.aroma}
                            count={5}
                            color={starColor}
                            editable={false}
                            onRating={() => void {}}
                        />
                    </div>

                    <div className="text-md mb-4 w-full">
                        <label htmlFor="appearance">{t('appearance')}</label>
                        <Rate
                            rating={review.appearance}
                            count={5}
                            color={starColor}
                            editable={false}
                            onRating={() => void {}}
                        />
                    </div>

                    <div className="text-md mb-4 w-full">
                        <label htmlFor="taste">{t('taste')}</label>
                        <Rate
                            rating={review.taste}
                            count={5}
                            color={starColor}
                            editable={false}
                            onRating={() => void {}}
                        />
                    </div>

                    <div className="text-md mb-4 w-full">
                        <label htmlFor="mouthfeel">{t('mouthfeel')}</label>
                        <Rate
                            rating={review.mouthfeel}
                            count={5}
                            color={starColor}
                            editable={false}
                            onRating={() => void {}}
                        />
                    </div>

                    <div className="text-md mb-4 w-full">
                        <label htmlFor="bitterness">{t('bitterness')}</label>
                        <Rate
                            rating={review.bitterness}
                            count={5}
                            color={starColor}
                            editable={false}
                            onRating={() => void {}}
                        />
                    </div>

                    <div className="text-md mb-4 w-full">
                        <label htmlFor="overall">{t('overall')}</label>
                        <Rate
                            rating={review.overall}
                            count={5}
                            color={starColor}
                            editable={true}
                            onRating={() => void {}}
                        />
                    </div>
                </div>
            </section>
        </article>
    );
}
