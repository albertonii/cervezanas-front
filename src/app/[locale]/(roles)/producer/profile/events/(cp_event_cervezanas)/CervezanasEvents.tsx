'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ICPFixed, ICPMobile } from '@/lib/types/types';
import CervezanasEventList from './CervezanasEventList';

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
            <p className="flex justify-between py-4" id="header">
                <span
                    id="title"
                    className="font-['NexaRust-script'] text-5xl md:text-7xl text-white -rotate-2"
                >
                    {t('cervezanas_events')}
                </span>
            </p>

            <CervezanasEventList counter={counter} />
        </section>
    );
}
