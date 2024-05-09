import DisplayImageProduct from '../../../components/common/DisplayImageProduct';
import React, { useState } from 'react';
import { IProduct, IProductPack } from '../../../../../lib/types/types';
import { useTranslations } from 'next-intl';
import ProductPackMiniature from '../../../components/ProductPackMiniature';

interface Props {
    product: IProduct;
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
            className="flex flex-row space-x-4"
            onClick={() => handleItemSelected(pack)}
        >
            <div
                className={`relative w-full rounded-md ${
                    selectedPackId === pack.id &&
                    'bg-beer-softBlondeBubble ring-2 '
                }`}
                key={pack.id}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {/* <!-- Active: "ring-2 ring-indigo-500" --> */}
                <label
                    className={`
                      group relative flex cursor-pointer items-center justify-center border px-4 py-3 text-sm uppercase
                    text-white hover:bg-cerv-banana focus:outline-none sm:flex-1 bg-cerv-brown bg-opacity-40 font-semibold hover:text-black
                    `}
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
