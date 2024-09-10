'use client';

import LinkDistributor from './LinkDistributor';
import AssociatedDistributorsList from './AssociatedDistributorsList';
import ProfileSectionHeader from '@/app/[locale]/components/basic/ProfileSectionHeader';
import React from 'react';

interface Props {
    counter: number;
}

export default function Distributors({ counter }: Props) {
    return (
        <section className="px-4 py-6" aria-label="Distributors">
            <ProfileSectionHeader
                headerTitle="distributors"
                btnActions={<LinkDistributor />}
                headerDescription="distributors_description"
            />

            {/* Section displaying all asociated distributors */}
            <AssociatedDistributorsList counter={counter} />
        </section>
    );
}
