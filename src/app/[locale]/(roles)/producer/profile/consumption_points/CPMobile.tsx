'use client';

import AddCPMobileModal from './AddCPMobileModal';
import React from 'react';
import { useTranslations } from 'next-intl';
import { ListCPMobile } from './ListCPMobile';

interface Props {
  cpsId: string;
}

export function CPMobile({ cpsId }: Props) {
  const t = useTranslations();

  return (
    <section className="px-4 py-6" aria-label="Products">
      <header className="flex flex-col space-y-4">
        <p className="flex justify-between py-4" id="header">
          <span
            id="title"
            className="text-5xl uppercase font-semibold text-white"
          >
            {t('cp_mobile_list')}
          </span>
        </p>

        <div className="w-40">
          <AddCPMobileModal cpsId={cpsId} />
        </div>
      </header>

      <ListCPMobile cpsId={cpsId} />
    </section>
  );
}
