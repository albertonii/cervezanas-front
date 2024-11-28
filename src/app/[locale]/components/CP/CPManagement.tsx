'use client';

import AddConsumptionPointModal from './AddConsumptionPointModal';
import React from 'react';
import { useTranslations } from 'next-intl';
import { ListCPoints } from './ListCPoints';

interface Props {
    cpsId: string;
    counterCP: number;
}

export function CPManagement({ cpsId, counterCP }: Props) {
    const t = useTranslations();

    return (
        <section className="px-4 py-6" aria-label="Products">
            <header className="flex flex-col space-y-4">
                <div className="w-40">
                    <AddConsumptionPointModal cpsId={cpsId} />
                </div>
            </header>

            <ListCPoints cpsId={cpsId} counterCPMobile={counterCP} />
        </section>
    );
}
