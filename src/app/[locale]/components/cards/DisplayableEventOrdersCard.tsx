// components/DisplayableEventOrdersCard.tsx

'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { IEventOrderCPS } from '@/lib/types/eventOrders';

interface Props {
    order: IEventOrderCPS;
}

const DisplayableEventOrdersCard: React.FC<Props> = ({ order }) => {
    const t = useTranslations('event');

    return (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden md:max-w-2xl">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <p className="mt-2 text-3xl font-bold text-beer-gold dark:text-beer-foam">
                        #{order.order_number}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DisplayableEventOrdersCard;
