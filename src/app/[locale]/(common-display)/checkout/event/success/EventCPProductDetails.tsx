import EventCPOrderCard from './EventCPOrderCard';
import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';
import React from 'react';
import { Store } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { IEventOrderCPS, IEventOrderItem } from '@/lib/types/eventOrders';
interface Props {
    eventOrderItem: IEventOrderItem;
    eventOrderCP: IEventOrderCPS;
    domain?: string;
}

export default function EventCPProductDetails({
    eventOrderCP,
    eventOrderItem,
    domain,
}: Props) {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();

    const handleOnClick = (productId: string) => {
        router.push(`/${locale}/products/review/${productId}`);
    };

    const { product_packs } = eventOrderItem;

    if (!product_packs) return null;

    return (
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            {eventOrderItem.event_order_cps && (
                <EventCPOrderCard orderCP={eventOrderCP} />
            )}
        </section>
    );
}
