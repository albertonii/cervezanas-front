'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Button from './Button';

export default function ReporterFloatingButton() {
    const t = useTranslations();
    const router = useRouter();

    const handleClick = () => {
        router.push('/report');
    };

    return (
        <Button
            accent
            large
            class="fixed bottom-0 right-0 z-50 m-4"
            onClick={handleClick}
        >
            {t('report_problem')}
        </Button>
    );
}
