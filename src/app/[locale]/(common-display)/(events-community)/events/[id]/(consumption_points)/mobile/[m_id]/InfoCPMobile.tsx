'use client';

import CPDetails from './CPDetails';
import ProductList from './ProductList';
import EventExperiences from './EventExperiences';
import Label from '@/app/[locale]/components/ui/Label';
import Title from '@/app/[locale]/components/ui/Title';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import React from 'react';
import { ROUTE_EVENTS } from '@/config';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { IEventExperience } from '@/lib/types/types';
import { ICPMobile } from '@/lib/types/consumptionPoints';

interface Props {
    cpMobile: ICPMobile;
    eventId: string;
    eventExperiences: IEventExperience[];
}

export default function InfoCPMobile({
    cpMobile,
    eventExperiences,
    eventId,
}: Props) {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();

    const experiencesCounter = eventExperiences.length;

    const handleOnClickEventComeBack = () => {
        return router.push(`/${locale}${ROUTE_EVENTS}/${eventId}`);
    };

    return (
        <section className="relative h-full w-[1000px] rounded-lg bg-white p-8 shadow-md bg-[url('/assets/rec-graf2b.png')] bg-content bg-no-repeat bg-bottom m-auto">
            {/* <section className="absolute  right-0 top-0 m-4 rounded-md bg-beer-gold px-4 py-2">
                <span
                    className={`text-lg font-medium text-white ${
                        cpMobile.status === 'active'
                            ? 'text-green-500'
                            : 'text-red-500'
                    }`}
                >
                    {cpMobile.status === 'active' ? 'Active' : 'Inactive'}
                </span>
            </section> */}

            <Button
                title={'come_back_event'}
                primary
                small
                onClick={handleOnClickEventComeBack}
            >
                {t('back_to_event')}
            </Button>

            {/* Event Experiences  */}
            {experiencesCounter > 0 && (
                <section className=" mt-4">
                    <Title size="xlarge">{t('experiences')}</Title>

                    <Label size="medium" color="gray">
                        {t('event_experience_participation_description', {
                            experiencesCounter: experiencesCounter,
                        })}
                    </Label>

                    <EventExperiences eventExperiences={eventExperiences} />
                </section>
            )}

            {/* Display all the information inside the Mobile Consumption Point */}
            <section className="mt-10 grid grid-cols-1 md:grid-cols-2">
                <CPDetails cpMobile={cpMobile} />
            </section>

            {/* Products linked to this Mobile Consumption Point */}
            <section className="mt-8">
                <ProductList cpMobile={cpMobile} eventId={eventId} />
            </section>
        </section>
    );
}
