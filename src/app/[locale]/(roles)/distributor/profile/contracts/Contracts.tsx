'use client';

import React from 'react';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import AssociatedProducersList from './AssociatedProducersList';
import ProfileSectionHeader from '@/app/[locale]/components/ui/ProfileSectionHeader';

interface Props {
    counter: number;
}

export default function Contracts({ counter }: Props) {
    const { user } = useAuth();
    if (!user) return null;

    return (
        <section className="px-4 py-6" aria-label="Distributors">
            <ProfileSectionHeader headerTitle="producers" />

            {/* <div className="w-40">
                 <LinkDistributor producerId={user.id} /> 
            </div> */}

            {/* Section displaying all asociated contracts */}
            <AssociatedProducersList counter={counter} />
        </section>
    );
}
