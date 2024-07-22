import EventPackItem from './EventPackItem';
import React, { useEffect, useState } from 'react';
import { IProductPackEventCartItem, IProductPack } from '@/lib/types/types';

interface Props {
    item: IProductPackEventCartItem;
    eventId: string;
}

export default function EventProduct({ item, eventId }: Props) {
    const [packs, setPacks] = useState<IProductPack[]>([]);

    useEffect(() => {
        setPacks(item.packs);
    }, [item]);

    return (
        <figure className="flex w-full flex-col space-y-2 border-2 bg-beer-softBlondeBubble p-2">
            {/* Display Consumption Point name */}
            <h2 className="text-lg text-gray-900">{item.cp_name}</h2>

            {/* Display product name */}
            <h2 className="text-lg text-gray-900">{item.name}</h2>

            {packs.map((pack) => {
                return (
                    <div key={pack.id}>
                        <EventPackItem
                            item={item}
                            pack={pack}
                            eventId={eventId}
                        />
                    </div>
                );
            })}
        </figure>
    );
}
