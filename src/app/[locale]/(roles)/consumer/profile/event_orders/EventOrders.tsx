'use client';

import { useTranslations } from 'next-intl';
import { EventOrderList } from './EventOrderList';

interface Props {
    counter: number;
}

export function EventOrders({ counter }: Props) {
    const t = useTranslations();

    return (
        <section className="px-4 py-6" aria-label="Event Orders">
            <div className="flex flex-col space-y-4 text-white uppercase font-semibold">
                <span className="text-5xl lowercase font-semibold text-white font-['NexaRust-script'] md:text-7xl -rotate-2 ml-10">{t('event_orders')}</span>
            </div>

            <EventOrderList counter={counter} />
        </section>
    );
}
