import EventCPOrderCard from './EventCPOrderCard';
import React from 'react';
import { Store } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SupabaseProps } from '@/constants';
import { useLocale, useTranslations } from 'next-intl';
import { IEventOrderCPS, IEventOrderItem } from '@/lib/types/eventOrders';
import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';

interface Props {
    eventOrderItem: IEventOrderItem;
    eventOrderCP: IEventOrderCPS;
    domain: string;
}

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

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
            <div className="flex items-center mb-4">
                <Store className="w-6 h-6 text-beer-draft dark:text-white mr-2" />
                <div>
                    <Title
                        size="medium"
                        font="bold"
                        color="gray"
                        fontFamily="NexaRust-sans"
                    >
                        {eventOrderItem.event_order_cps?.cp_events?.cp?.cp_name}
                    </Title>
                    <Label
                        size="medium"
                        color="gray"
                        className="dark:text-gray-300"
                    >
                        {eventOrderItem.event_order_cps?.cp_events?.cp?.address}
                    </Label>
                </div>
            </div>

            {eventOrderItem.event_order_cps && (
                <EventCPOrderCard order={eventOrderCP} />
            )}
        </section>
    );
}
