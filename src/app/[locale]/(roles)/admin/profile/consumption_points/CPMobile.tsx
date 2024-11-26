'use client';

import ProfileSectionHeader from '@/app/[locale]/components/ui/ProfileSectionHeader';
import React from 'react';
import { useTranslations } from 'next-intl';
import { ListCPMobile } from './ListCPMobile';
import { ICPMobile } from '@/lib//types/types';

interface Props {
    cpsMobile: ICPMobile[];
}

export function CPMobile({ cpsMobile }: Props) {
    const t = useTranslations();

    return (
        <section className="px-4 py-6" aria-label="Products">
            <ProfileSectionHeader headerTitle="cp_mobile_list" />

            <ListCPMobile cpsMobile={cpsMobile} />
        </section>
    );
}
