import ProductPackMiniature from '@/app/[locale]/components/ProductPackMiniature';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IProductPack } from '@/lib//types/types';

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
                    className="hover:cursor-pointer flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-checked:border-primary"
                >
                    {pack.name}
                    <span className="mt-2 text-lg font-bold">
                        ${pack.price}
                    </span>
                </label>
            </label>

            <div className={`${!isHovering && 'hidden'} relative z-50`}>
                <ProductPackMiniature pack={pack} />
            </div>
        </div>
    );
}
