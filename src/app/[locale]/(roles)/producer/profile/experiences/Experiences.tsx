'use client';

import ExperienceList from './ExperiencesList';
import AddBeerMasterExperienceModal from '@/app/[locale]/components/modals/experiences/AddBeerMasterExperienceModal';
import React from 'react';
import { useTranslations } from 'next-intl';
import { IExperience } from '@/lib//types/quiz';
import ProfileSectionHeader from '@/app/[locale]/components/basic/ProfileSectionHeader';

interface Props {
    experiences: IExperience[];
    counter: number;
}

export default function Experiences({ experiences, counter }: Props) {
    const t = useTranslations();

    return (
        <section
            className="px-4 py-6 flex flex-col space-y-4"
            aria-label="Experiences"
        >
            <ProfileSectionHeader
                headerTitle="experiences"
                btnActions={<AddBeerMasterExperienceModal />}
            />

            <ExperienceList counter={counter} experiences={experiences} />
        </section>
    );
}
