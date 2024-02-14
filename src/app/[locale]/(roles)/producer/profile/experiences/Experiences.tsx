'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { IExperience } from '../../../../../../lib/types';
import AddExperience from '../../../../components/modals/experiences/AddExperience';
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
        <h2 className="text-4xl">{t('experiences')}</h2>

        <div className="w-40">
          <AddExperience experiences={experiences} />
        </div>
      </header>

      <ExperienceList counter={counter} experiences={experiences} />
    </section>
  );
}
