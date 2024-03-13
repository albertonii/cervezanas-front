'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import EventList from './EventList';
import { ICPFixed, ICPMobile } from '../../../../../../lib/types/types';

interface Props {
  cpsMobile: ICPMobile[];
  cpsFixed: ICPFixed[];
  counter: number;
}

export default function Events({ cpsMobile, cpsFixed, counter }: Props) {
  const t = useTranslations();

  return (
    <div className="px-6 py-4">
      <section className="mt-4 flex flex-col space-y-4">
        <h2 className="text-2xl">{t('events_list')}</h2>

        <EventList
          counter={counter}
          cpsMobile={cpsMobile}
          cpsFixed={cpsFixed}
        />
      </section>
    </div>
  );
}
