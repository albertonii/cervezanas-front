'use client';

import CPDetails from './CPDetails';
import ProductList from './ProductList';
import React from 'react';
import { ICPMobile, IExperience } from '../../../../../../../../../lib/types';
import { useTranslations } from 'next-intl';
import Experiences from './Experiences';

interface Props {
  cpMobile: ICPMobile;
  eventId: string;
  experience: IExperience;
}

export default function InfoCPMobile({ cpMobile, experience, eventId }: Props) {
  const t = useTranslations();

  return (
    <section className="relative h-full w-full rounded-lg bg-white p-8 shadow-md">
      <section className="absolute  right-0 top-0 m-4 rounded-md bg-beer-gold px-4 py-2">
        <span
          className={`text-lg font-medium text-white ${
            cpMobile.status === 'active' ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {cpMobile.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      </section>

      {/* Display all the information inside the Mobile Consumption Point */}
      <section className="mt-10 grid grid-cols-1 md:grid-cols-2">
        <CPDetails cpMobile={cpMobile} />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8">{t('experiences')}</h2>

        <Experiences experience={experience}/>
      </section>

      {/* Products linked to this Mobile Consumption Point */}
      <section className="mt-8">
        <ProductList cpMobile={cpMobile} eventId={eventId} />
      </section>
    </section>
  );
}
