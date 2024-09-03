'use client';

import React from 'react';
import AddCPFixedModal from './AddCPFixedModal';
import { useTranslations } from 'next-intl';
import { ListCPFixed } from './ListCPFixed';
import { ICPFixed } from '@/lib//types/types';
import ProfileSectionHeader from '@/app/[locale]/components/basic/ProfileSectionHeader';

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
