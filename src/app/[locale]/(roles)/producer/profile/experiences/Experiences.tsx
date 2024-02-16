'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { IExperience } from '../../../../../../lib/types';
import AddExperience from '../../../../components/modals/experiences/AddBeerMasterExperienceModal';
import ExperienceList from './ExperiencesList';

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
            className="text-5xl uppercase font-semibold text-white"
          >
            {t('experiences')}
          </span>
        </p>

        <div className="w-40">
          <AddExperience />
        </div>
      </header>

      <ExperienceList counter={counter} experiences={experiences} />
    </section>
  );
}
