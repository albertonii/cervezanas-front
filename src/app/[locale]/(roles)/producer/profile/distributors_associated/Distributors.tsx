'use client';

import LinkDistributor from './LinkDistributor';
import AssociatedDistributorsList from './AssociatedDistributorsList';
import React from 'react';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { useTranslations } from 'next-intl';
import ProfileSectionHeader from '@/app/[locale]/components/basic/ProfileSectionHeader';

interface Props {
    counter: number;
}

export default function Distributors({ counter }: Props) {
    const t = useTranslations();
    const { user } = useAuth();
    if (!user) return null;

    return (
        <section className="px-4 py-6" aria-label="Distributors">
            <ProfileSectionHeader headerTitle="distributors" />

            <div className="w-40">
                <LinkDistributor producerId={user.id} />
            </div>

            {/* Section displaying all asociated distributors */}
            <AssociatedDistributorsList
                producerId={user.id}
                counter={counter}
            />
        </section>
    );
}
