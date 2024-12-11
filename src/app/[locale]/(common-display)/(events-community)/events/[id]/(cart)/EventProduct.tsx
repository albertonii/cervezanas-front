import React from 'react';
import EventPackItem from './EventPackItem';
import { IProductPackEventCartItem } from '@/lib/types/types';

interface Props {
    item: IProductPackEventCartItem;
    eventId: string;
}

export default function EventProduct({ item, eventId }: Props) {
    return (
        <div className="w-full bg-white dark:bg-gray-700 rounded-lg shadow p-4 flex flex-col space-y-2">
            {/* Encabezado del Producto */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {item.name}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-300">
                    {item.cp_name}
                </span>
            </div>

            {/* Paquetes */}
            <div className="space-y-2">
                {item.packs.map((pack) => (
                    <EventPackItem
                        key={pack.id}
                        pack={pack}
                        item={item}
                        eventId={eventId}
                    />
                ))}
            </div>
        </div>
    );
}
