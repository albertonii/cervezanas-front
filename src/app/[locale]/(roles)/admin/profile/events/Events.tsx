'use client';

import EventList from './EventList';
import AddEventModal from '@/app/[locale]/components/modals/event/AddEventModal';
import ProfileSectionHeader from '@/app/[locale]/components/ui/ProfileSectionHeader';
import React from 'react';
import { useTranslations } from 'next-intl';
import { IConsumptionPoint } from '@/lib/types/consumptionPoints';

interface Props {
    cps: IConsumptionPoint[];
    counter: number;
}

export default function Events({ cps, counter }: Props) {
    const t = useTranslations();

    return (
        <section className="px-4 py-6" aria-label="Events">
            <ProfileSectionHeader
                headerTitle="events"
                btnActions={<AddEventModal cps={cps} />}
            />

            <EventList counter={counter} cps={cps} />
        </section>
    );
}
