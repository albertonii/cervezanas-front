'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ListCPointsInEvents } from './ListCPointsInEvents';

interface Props {
    counterCP: number;
}

export function CPInEvents({ counterCP }: Props) {
    const t = useTranslations();

    return (
        <section className="px-4 py-6" aria-label="Products">
            <ListCPointsInEvents counterCPMobile={counterCP} />
        </section>
    );
}
