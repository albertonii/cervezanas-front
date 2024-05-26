import { useTranslations } from 'next-intl';
import React from 'react';
import { SupabaseProps } from '../../../constants';
import { family_options } from '../../../lib/beerEnum';
import { IProduct } from '../../../lib/types/types';
import DisplayImageProduct from './common/DisplayImageProduct';

interface Props {
    product: IProduct;
}

export default function ProductMiniature({ product }: Props) {
    const t = useTranslations();
    if (!product) {
        return <></>;
    }

    const beerFamilyNumber: number = parseInt(product.beers!.family);
    const beerFamily = family_options[beerFamilyNumber].label;

    return (
        <div
            className={`
                absolute space-y-2 p-4 w-full flex flex-col items-center text-lg  bottom-full left-1/2 -translate-x-1/2  
                transform rounded-md bg-beer-softerFoam shadow-xl transition-all duration-300 ease-in-out sm:w-[35vw] lg:w-[25vw]
          `}
        >
            <span className="font-semibold">{product.name}</span>

            <span>
                {t('beer_style')}: {t(beerFamily)}
            </span>

            <DisplayImageProduct
                imgSrc={
                    SupabaseProps.BASE_PRODUCTS_URL +
                    decodeURIComponent(
                        product.product_multimedia?.p_principal ?? '',
                    )
                }
                alt={product.name}
                width={600}
                height={600}
                class="w-[30vw] px-2 py-2 sm:w-[25vw] md:w-[20vw] lg:w-[10vw]"
            />
        </div>
    );
}
