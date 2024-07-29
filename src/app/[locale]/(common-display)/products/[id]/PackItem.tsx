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
        <li
            className="flex flex-row space-x-4 transition-all ease-in-out duration-200 active:bg-beer-dark active:text-beer-gold active:border-beer-gold active:ring-2 active:ring-beer-gold"
            onClick={() => handleItemSelected(pack)}
        >
            <div
                className={`relative w-full  ${
                    selectedPackId === pack.id && 'bg-beer-softBlondeBubble'
                }`}
                key={pack.id}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {/* <!-- Active: "ring-2 ring-indigo-500" --> */}
                <label
                    className={`
                        ${
                            selectedPackId === pack.id
                                ? 'bg-beer-dark text-bear-dark border-beer-gold ring-2 ring-beer-gold'
                                : 'text-white'
                        }
                        transition-all ease-in-out duration-300 
                        group relative flex cursor-pointer items-center justify-center border px-4 py-3 text-sm uppercase
                        hover:bg-cerv-banana focus:outline-none sm:flex-1 bg-cerv-brown bg-opacity-40 font-semibold hover:text-bear-dark
                    `}
                    htmlFor={`pack-${pack.id}`}
                >
                    <input
                        type="radio"
                        id={`pack-${pack.id}`}
                        value={pack.id}
                        className={'hidden'}
                    />
                    <span id="size-choice-0-label">
                        {pack.quantity} {t('units')}
                    </span>
                </label>

                <div className={`${!isHovering && 'hidden'}`}>
                    <ProductPackMiniature pack={pack} />
                </div>
            </div>
        </li>
    );
}
