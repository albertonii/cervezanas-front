'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ICPFixed, ICPMobile } from '@/lib/types/types';
import CervezanasEventList from './CervezanasEventList';
import ProfileSectionHeader from '@/app/[locale]/components/basic/ProfileSectionHeader';

interface Props {
    cpsMobile: ICPMobile[];
    cpsFixed: ICPFixed[];
    counter: number;
}

export default function CervezanasEvents({
    cpsMobile,
    cpsFixed,
    counter,
}: Props) {
    const t = useTranslations();

    return (
        <section className="px-4 py-6" aria-label="Events">
            <ProfileSectionHeader headerTitle="cervezanas_events" />

            <CervezanasEventList counter={counter} />
        </section>
    );
}
