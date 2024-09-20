'use client';

import React from 'react';
import AddCPFixedModal from './AddCPFixedModal';
import { useTranslations } from 'next-intl';
import { ListCPFixed } from './ListCPFixed';
import ProfileSectionHeader from '@/app/[locale]/components/ui/ProfileSectionHeader';

interface Props {
    cpsId: string;
}

export function CPFixed({ cpsId }: Props) {
    const t = useTranslations();

    return (
        <section className="px-4 py-6" aria-label="Products">
            <ProfileSectionHeader
                headerTitle="cp_fixed_list"
                btnActions={<AddCPFixedModal cpsId={cpsId} />}
            />

            <ListCPFixed cpsId={cpsId} />
        </section>
    );
}
