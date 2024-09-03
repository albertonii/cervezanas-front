'use client';

import EventList from './EventList';
import AddEvent from '@/app/[locale]/components/modals/event/AddEvent';
import React from 'react';
import { useTranslations } from 'next-intl';
import { ICPFixed, ICPMobile } from '@/lib/types/types';
import ProfileSectionHeader from '@/app/[locale]/components/basic/ProfileSectionHeader';

interface Props {
    cpsMobile: ICPMobile[];
    cpsFixed: ICPFixed[];
    counter: number;
}

export default function Events({ cpsMobile, cpsFixed, counter }: Props) {
    const t = useTranslations();

    return (
        <section className="px-4 py-6" aria-label="Events">
            <ProfileSectionHeader
                headerTitle="events"
                btnActions={
                    <AddEvent cpsMobile={cpsMobile} cpsFixed={cpsFixed} />
                }
            />

            <EventList
                counter={counter}
                cpsMobile={cpsMobile}
                cpsFixed={cpsFixed}
            />
        </section>
    );
}
