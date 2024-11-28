'use client';

import { useTranslations } from 'next-intl';
import { IBusinessOrder } from '@/lib/types/types';
import { BusinessOrderList } from './BusinessOrderList';
import ProfileSectionHeader from '@/app/[locale]/components/ui/ProfileSectionHeader';

interface Props {
    bOrders: IBusinessOrder[];
}

export function BusinessOrders({ bOrders }: Props) {
    const t = useTranslations();

    return (
        <section className="px-4 py-6" aria-label="Orders">
            <ProfileSectionHeader headerTitle="marketplace_orders" />

            {bOrders && bOrders.length > 0 && (
                <BusinessOrderList bOrders={bOrders} />
            )}
        </section>
    );
}
