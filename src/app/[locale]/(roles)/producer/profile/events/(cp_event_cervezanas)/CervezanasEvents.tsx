'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import CervezanasEventList from './CervezanasEventList';
import ProfileSectionHeader from '@/app/[locale]/components/ui/ProfileSectionHeader';

interface Props {
    counter: number;
}

export default function CervezanasEvents({ counter }: Props) {
    const t = useTranslations();

    return (
        <section className="px-4 py-6" aria-label="Events">
            <ProfileSectionHeader headerTitle="cervezanas_events" />

            <CervezanasEventList counter={counter} />
        </section>
    );
}
