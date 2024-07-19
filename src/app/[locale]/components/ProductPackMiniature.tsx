import { useTranslations } from 'next-intl';
import React from 'react';
import { SupabaseProps } from '../../../constants';
import { IProductPack } from '../../../lib/types/types';
import DisplayImageProduct from './common/DisplayImageProduct';

interface Props {
    pack: IProductPack;
}

export default function ProductPackMiniature({ pack }: Props) {
    const t = useTranslations();
    return (
        <div
            className={`
                absolute bottom-full left-1/2 m-auto w-[70vw] -translate-x-1/2 -translate-y-[2rem] 
                transform rounded-md bg-beer-foam shadow-xl transition-all duration-300 ease-in-out sm:w-[35vw] lg:w-[15vw] z-10
            `}
        >
            <div className="m-4 flex flex-col items-center text-lg">
                <span className="font-semibold">{pack.name}</span>
                <span className="">
                    {pack.quantity} {pack.quantity > 1 ? t('units') : t('unit')}{' '}
                    - {pack.price} €
                </span>

                <DisplayImageProduct
                    imgSrc={
                        SupabaseProps.BASE_PRODUCTS_URL +
                        decodeURIComponent(pack.img_url)
                    }
                    alt={pack.name}
                    width={600}
                    height={600}
                    class="w-[30vw] px-2 py-2 sm:w-[25vw] md:w-[20vw] lg:w-[10vw]"
                />
            </div>
        </div>
    );
}
