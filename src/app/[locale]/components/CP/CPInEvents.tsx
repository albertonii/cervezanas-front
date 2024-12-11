'use client';

import Button from '../ui/buttons/Button';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ListCPointsInEvents } from './ListCPointsInEvents';

interface Props {
    counterCP: number;
}

export function CPInEvents({ counterCP }: Props) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const t = useTranslations('event');
    const router = useRouter();

    const handleButtonClick = () => {
        router.push(
            `${baseUrl}/producer/profile/consumption_points/guest_order_lookup`,
        );
    };

    return (
        <section className="px-4 py-6" aria-label="Products">
            <Button large primary onClick={handleButtonClick}>
                {t('lookup_event_order_action_label')}
            </Button>
            <ListCPointsInEvents counterCP={counterCP} />
        </section>
    );
}
