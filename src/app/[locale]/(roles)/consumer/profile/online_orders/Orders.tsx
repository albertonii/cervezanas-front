'use client';

import { useTranslations } from 'next-intl';
import { OrderList } from './OrderList';

interface Props {
    counter: number;
}

export function Orders({ counter }: Props) {
    const t = useTranslations();

    return (
        <section className="px-4 py-6" aria-label="Orders">
            <p className="flex justify-between py-4" id="header">
                <span
                    id="title"
                    className="lowercase font-semibold text-white font-['NexaRust-script'] text-5xl md:text-7xl -rotate-2 ml-10"
                >
                    {t('marketplace_orders')}
                </span>
            </p>

            <OrderList counter={counter} />
        </section>
    );
}
