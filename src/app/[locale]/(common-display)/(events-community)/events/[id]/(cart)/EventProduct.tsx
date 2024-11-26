import EventPackItem from './EventPackItem';
import React, { useEffect, useState } from 'react';
import { IProductPackEventCartItem, IProductPack } from '@/lib/types/types';
import Label from '@/app/[locale]/components/ui/Label';

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
        <figure className="flex w-full flex-col space-y-1 border-2 bg-beer-softBlondeBubble p-2">
            {/* Display Consumption Point name */}
            <Label>{item.cp_name}</Label>

            {/* Display product name */}
            <Label>{item.name}</Label>

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
