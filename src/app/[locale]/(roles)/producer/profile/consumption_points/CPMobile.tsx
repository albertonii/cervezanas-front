'use client';

import AddCPMobileModal from './AddCPMobileModal';
import React from 'react';
import { useTranslations } from 'next-intl';
import { ListCPMobile } from './ListCPMobile';

interface Props {
    cpsId: string;
    counterCPMobile: number;
}

export function CPMobile({ cpsId, counterCPMobile }: Props) {
    const t = useTranslations();

    return (
        <section className="px-4 py-6" aria-label="Products">
            <header className="flex flex-col space-y-4">
                <div className="w-40">
                    <AddCPMobileModal cpsId={cpsId} />
                </div>
            </header>

            <ListCPMobile cpsId={cpsId} counterCPMobile={counterCPMobile} />
        </section>
    );
}
