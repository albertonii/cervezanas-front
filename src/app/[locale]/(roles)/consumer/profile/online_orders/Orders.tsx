'use client';

import ProfileSectionHeader from '@/app/[locale]/components/basic/ProfileSectionHeader';
import { useTranslations } from 'next-intl';
import { OrderList } from './OrderList';

interface Props {
    counter: number;
}

export function Orders({ counter }: Props) {
    const t = useTranslations();

    return (
        <section className="px-4 py-6" aria-label="Orders">
            <ProfileSectionHeader
                headerTitle="marketplace_orders"
                headerDescription={'consumer_online_orders_description'}
            />

            <OrderList counter={counter} />
        </section>
    );
}
