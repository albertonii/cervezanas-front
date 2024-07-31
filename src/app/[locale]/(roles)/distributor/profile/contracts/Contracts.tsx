'use client';

import React from 'react';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { useTranslations } from 'next-intl';
import AssociatedProducersList from './AssociatedProducersList';

interface Props {
    counter: number;
}

export default function Contracts({ counter }: Props) {
    const t = useTranslations();
    const { user } = useAuth();
    if (!user) return null;

    return (
        <section className="px-4 py-6" aria-label="Distributors">
            <header className="flex flex-col space-y-4">
                <p className="flex justify-between py-4" id="header">
                    <span
                        id="title"
                        className="text-5xl uppercase font-semibold text-white"
                    >
                        {t('producers')}
                    </span>
                </p>

                <div className="w-40">
                    {/* <LinkDistributor producerId={user.id} /> */}
                </div>
            </header>
            {/* Section displaying all asociated contracts */}
            <AssociatedProducersList counter={counter} />
        </section>
    );
}
