import ProductPackMiniature from '@/app/[locale]/components/ProductPackMiniature';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IProductPack } from '@/lib/types/types';

interface Props {
    pack: IProductPack;
    handleItemSelected: (item: IProductPack) => void;
    selectedPackId: string;
}

export default function PackItem({
    pack,
    handleItemSelected,
    selectedPackId,
}: Props) {
    const t = useTranslations();
    const [isHovering, setIsHovering] = useState(false);

    return (
        <div
            className={`relative w-full  ${
                selectedPackId === pack.id && 'bg-beer-softBlondeBubble'
            }`}
            key={pack.id}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => handleItemSelected(pack)}
        >
            {/* <!-- Active: "ring-2 ring-indigo-500" --> */}
            <label htmlFor={`pack-${pack.id}`}>
                <input
                    type="radio"
                    id={`pack-${pack.id}`}
                    value={pack.id}
                    checked={selectedPackId === pack.id}
                    className="peer sr-only"
                />
                <label
                    htmlFor={pack.id}
                    className="hover:cursor-pointer text-xl flex items-center justify-between rounded-xl peer-checked:rounded-none border-2 px-8 pb-2 hover:bg-gray-50 hover:text-beer-draft peer-checked:text-black peer-checked:border-none peer-checked:bg-beer-softBlondeBubble font-semibold dark:bg-bear-dark_brown"
                >
                    {pack.name}
                    <span className="mt-2 text-xl font-bold">
                        {pack.price} €
                    </span>
                </label>
            </label>

            <div className={`${!isHovering && 'hidden'} relative z-50`}>
                <ProductPackMiniature pack={pack} />
            </div>
        </div>
    );
}
