'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { IUserReport } from '@/lib//types/types';
import ReportList from './ReportList';

interface Props {
    reports: IUserReport[];
}

export default function Reports({ reports }: Props) {
    const t = useTranslations();
    return (
        <div className="px-6 py-4">
            <section className="mt-4 flex flex-col space-y-4">
                <h2 className="text-2xl">{t('report_list')}</h2>

                <ReportList reports={reports} />
            </section>
        </div>
    );
}
