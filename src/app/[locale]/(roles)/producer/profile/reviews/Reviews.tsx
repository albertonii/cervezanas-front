'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { useLocale, useTranslations } from 'next-intl';
import { IReview } from '@/lib//types/types';
import { Rate } from '@/app/[locale]/components/reviews/Rate';
import { formatDateString } from '@/utils/formatDate';
import { DeleteButton } from '@/app/[locale]/components/common/DeleteButton';
import DisplayImageProfile from '@/app/[locale]/components/common/DisplayImageProfile';
import DisplayImageProduct from '@/app/[locale]/components/common/DisplayImageProduct';
import { SupabaseProps } from '@/constants';
import ProfileSectionHeader from '@/app/[locale]/components/ui/ProfileSectionHeader';

interface Props {
    reviews: IReview[];
}

// TODO: Hacer vista de las reviews recibidas por los consumidores
export function Reviews({ reviews: r }: Props) {
    const t = useTranslations();
    const locale = useLocale();
    const { supabase } = useAuth();

    const [reviews, setReviews] = useState<IReview[]>(r);

    const starColor = { filled: '#fdc300', unfilled: '#a87a12' };

    const handleDeleteReview = async (reviewId: string) => {
        try {
            const { error } = await supabase
                .from('reviews')
                .delete()
                .match({ id: reviewId });
            if (error) throw error;

            setReviews((prev) =>
                prev.filter((review) => review.id !== reviewId),
            );
        } catch (error) {
            alert(error);
        }
    };

    return (
        <section
            className="px-4 py-6 flex flex-col space-y-4"
            aria-label="Reviews"
        >
            <ProfileSectionHeader headerTitle="reviews" />

            {reviews &&
                reviews.length > 0 &&
                reviews.map((review, index) => {
                    return (
                        <div
                            key={index}
                            className="rounded-sm bg-beer-foam p-4"
                        >
                            <article className="relative grid grid-cols-4 md:gap-8">
                                {/* Delete review button in top right corner  */}
                                {/* <div className="absolute right-0">
                                <DeleteButton
                                    onClick={() => handleDeleteReview(review.id)}
                                />
                                </div> */}

                                <div className="col-span-4 space-y-6 lg:col-span-1 ">
                                    {/* Consumer Review  */}
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="">
                                            <DisplayImageProfile
                                                imgSrc={
                                                    review.users?.avatar_url ??
                                                    '/icons/profile-240.png'
                                                }
                                                class={'w-20 h-20 rounded-full'}
                                            />
                                        </div>

                                        <span className="flex flex-col">
                                            <h2 className="truncate">
                                                {t('consumer_review_username')}:{' '}
                                            </h2>
                                            <Link
                                                className="hover:text-purple-500 cursor-pointer font-bold text-beer-draft hover:text-beer-blonde"
                                                href={`/user-info/${review.users?.id}`}
                                                locale={locale}
                                            >
                                                {review.users?.username}
                                            </Link>
                                        </span>
                                    </div>
                                </div>

                                {/* Review rate */}
                                <div className="col-span-4 mt-6 md:mt-0 lg:col-span-3">
                                    <div className="tems-start flex flex-col-reverse justify-between md:flex-row md:items-center">
                                        <div className="space-y-2">
                                            {/* Img Product  */}
                                            <div className="flex flex-row items-center space-x-4 space-y-4">
                                                {/* <Image
                                                        className="sm:w-100 sm:h-100 h-20 w-20 rounded"
                                                        width={80}
                                                        height={80}
                                                        src={`${
                                                            review.products
                                                                ?.product_multimedia
                                                                ?.p_principal ??
                                                            '/icons/beer-240.png'
                                                        } `}
                                                        alt=""
                                                    /> */}

                                                <DisplayImageProduct
                                                    imgSrc={
                                                        SupabaseProps.BASE_PRODUCTS_URL +
                                                        decodeURIComponent(
                                                            review.products
                                                                ?.product_multimedia
                                                                ?.p_principal ??
                                                                '/icons/beer-240.png',
                                                        )
                                                    }
                                                    alt={review.products?.name}
                                                    width={80}
                                                    height={80}
                                                    class="sm:w-100 sm:h-100 h-20 w-20 rounded"
                                                />

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
                                                        {formatDateString(
                                                            review.created_at,
                                                        )}
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

                                    <p className="text-md font-medium text-beer-dark dark:text-gray-400">
                                        {review.comment}
                                    </p>

                                    {/* Stars  */}
                                    <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                                        <div className="text-md w-full ">
                                            <label htmlFor="aroma">
                                                {t('aroma')}
                                            </label>

                                            <Rate
                                                rating={review.aroma}
                                                count={5}
                                                color={starColor}
                                                editable={false}
                                                onRating={() => void {}}
                                            />
                                        </div>

                                        <div className="text-md mb-4 w-full">
                                            <label htmlFor="appearance">
                                                {t('appearance')}
                                            </label>
                                            <Rate
                                                rating={review.appearance}
                                                count={5}
                                                color={starColor}
                                                editable={false}
                                                onRating={() => void {}}
                                            />
                                        </div>

                                        <div className="text-md mb-4 w-full">
                                            <label htmlFor="taste">
                                                {t('taste')}
                                            </label>
                                            <Rate
                                                rating={review.taste}
                                                count={5}
                                                color={starColor}
                                                editable={false}
                                                onRating={() => void {}}
                                            />
                                        </div>

                                        <div className="text-md mb-4 w-full">
                                            <label htmlFor="mouthfeel">
                                                {t('mouthfeel')}
                                            </label>
                                            <Rate
                                                rating={review.mouthfeel}
                                                count={5}
                                                color={starColor}
                                                editable={false}
                                                onRating={() => void {}}
                                            />
                                        </div>

                                        <div className="text-md mb-4 w-full">
                                            <label htmlFor="bitterness">
                                                {t('bitterness')}
                                            </label>
                                            <Rate
                                                rating={review.bitterness}
                                                count={5}
                                                color={starColor}
                                                editable={false}
                                                onRating={() => void {}}
                                            />
                                        </div>

                                        <div className="text-md mb-4 w-full">
                                            <label htmlFor="overall">
                                                {t('overall')}
                                            </label>
                                            <Rate
                                                rating={review.overall}
                                                count={5}
                                                color={starColor}
                                                editable={true}
                                                onRating={() => void {}}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                    );
                })}
        </section>
    );
}
