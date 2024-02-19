'use client';

import LinkDistributor from './LinkDistributor';
import AssociatedDistributorsList from './AssociatedDistributorsList';
import React from 'react';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { useTranslations } from 'next-intl';

export default function Distributors() {
  const t = useTranslations();
  const { user } = useAuth();
  if (!user) return null;

  return (
    <section className="px-4 py-6" aria-label="Distributors">
      <header className="flex flex-col space-y-4">
        <p className="flex justify-between py-4" id="header">
          <span
            id="title"
            className="text-5xl uppercase font-semibold text-white"
          >
            {t('distributors')}
          </span>
        </p>

        <div className="w-40">
          <LinkDistributor producerId={user.id} />
        </div>
      </header>

      {/* Section displaying all asociated distributors */}
      <AssociatedDistributorsList producerId={user.id} />
    </section>
  );
}
