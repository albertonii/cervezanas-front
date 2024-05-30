'use client';

import { useTranslations } from 'next-intl';
import { IBusinessOrder } from '../../../../../../lib/types/types';
import { BusinessOrderList } from './BusinessOrderList';

interface Props {
    bOrders: IBusinessOrder[];
}

export function BusinessOrders({ bOrders }: Props) {
    const t = useTranslations();

    return (
        <section className="px-4 py-6" aria-label="Orders">
            <p className="flex justify-between py-4" id="header">
                <span
                    id="title"
                    className="text-5xl uppercase font-semibold text-white"
                >
                    {t('marketplace_orders')}
                </span>
            </p>

            {bOrders && bOrders.length > 0 && (
                <BusinessOrderList bOrders={bOrders} />
            )}
        </section>
    );
}
