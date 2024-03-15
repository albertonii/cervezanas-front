'use client';

import EventList from './EventList';
import AddEvent from './AddEvent';
import React from 'react';
import { useTranslations } from 'next-intl';
import { ICPFixed, ICPMobile } from '../../../../../../lib/types/types';

interface Props {
    cpsMobile: ICPMobile[];
    cpsFixed: ICPFixed[];
    counter: number;
}

export default function Events({ cpsMobile, cpsFixed, counter }: Props) {
    const t = useTranslations();

    return (
        <section className="px-4 py-6" aria-label="Events">
            <header className="flex flex-col space-y-4">
                <p className="flex justify-between py-4" id="header">
                    <span
                        id="title"
                        className="text-5xl font-semibold text-beer-blonde"
                    >
                        {t('events')}
                    </span>
                </p>

                <div className="w-40">
                    <AddEvent cpsMobile={cpsMobile} cpsFixed={cpsFixed} />
                </div>
            </header>

            <EventList
                counter={counter}
                cpsMobile={cpsMobile}
                cpsFixed={cpsFixed}
            />
        </section>
    );
}
