'use client';

import ReportList from './ReportList';
import ProfileSectionHeader from '@/app/[locale]/components/ui/ProfileSectionHeader';
import React from 'react';
import { useTranslations } from 'next-intl';
import { IUserReport } from '@/lib/types/types';

interface Props {
    reports: IUserReport[];
}

export default function Reports({ reports }: Props) {
    const t = useTranslations();

    return (
        <section className="px-6 py-4 mt-4 flex flex-col space-y-4">
            <ProfileSectionHeader headerTitle="report_list" />

            <ReportList reports={reports} />
        </section>
    );
}
