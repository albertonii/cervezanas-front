'use client';

import React, { ComponentProps } from 'react';
import { useTranslations } from 'next-intl';
import { IOrderItem } from '@/lib//types/types';
import { NewProductReview } from './NewProductReview';

interface Props {
    orderItem: IOrderItem;
    handleShowReviewOnClick: ComponentProps<any>;
    handleSetIsReviewed: ComponentProps<any>;
}

export default function ProductReview({
    orderItem,
    handleShowReviewOnClick,
    handleSetIsReviewed,
}: Props) {
    const t = useTranslations();

    return (
        <section className="container mx-auto space-y-4  border-gray-200 bg-white px-4 shadow-sm sm:rounded-lg sm:border sm:py-2 lg:py-4">
            <p>
                <h1 className="text-2xl font-bold">{t('review_product')}</h1>

                <span className="text-gray-500">
                    Te invitamos a valorar el siguiente producto y ayudar al
                    resto de usuarios. Sólo te llevará unos minutos y podrás
                    entrar en nuestro sorteo mensual de Opina y Gana.
                </span>
            </p>

            <NewProductReview
                orderItem={orderItem}
                handleShowReviewOnClick={handleShowReviewOnClick}
                handleSetIsReviewed={handleSetIsReviewed}
            />
        </section>
    );
}
