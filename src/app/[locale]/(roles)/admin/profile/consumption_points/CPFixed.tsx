'use client';

import ProfileSectionHeader from '@/app/[locale]/components/ui/ProfileSectionHeader';
import React from 'react';
import { useTranslations } from 'next-intl';
import { ListCPFixed } from './ListCPFixed';
import { ICPFixed } from '@/lib//types/types';

interface Props {
    cpsFixed: ICPFixed[];
}

export function CPFixed({ cpsFixed }: Props) {
    const t = useTranslations();

    return (
        <section className="px-4 py-6" aria-label="Products">
            <ProfileSectionHeader headerTitle="cp_fixed_list" />

            <ListCPFixed cpsFixed={cpsFixed} />
        </section>
    );
}
