'use client';

import ExperienceList from './ExperiencesList';
import AddBeerMasterExperienceModal from '@/app/[locale]/components/modals/experiences/AddBeerMasterExperienceModal';
import React from 'react';
import { useTranslations } from 'next-intl';
import { IExperience } from '@/lib//types/quiz';

interface Props {
    experiences: IExperience[];
    counter: number;
}

export default function Experiences({ experiences, counter }: Props) {
    const t = useTranslations();

    return (
        <section className="px-4 py-6" aria-label="Experiences">
            <header className="flex flex-col space-y-4">
                <p className="flex justify-between py-4" id="header">
                    <span
                        id="title"
                        className="font-['NexaRust-script'] text-5xl md:text-7xl text-white -rotate-2"
                    >
                        {t('experiences')}
                    </span>
                </p>

                <div className="w-40">
                    <AddBeerMasterExperienceModal />
                </div>
            </header>

            <ExperienceList counter={counter} experiences={experiences} />
        </section>
    );
}
