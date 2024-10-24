import React from 'react';
import { SupabaseProps } from '@/constants';
import { IProduct } from '@/lib/types/types';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import DisplayImageProduct from '@/app/[locale]/components/ui/DisplayImageProduct';

interface Props {
    product: IProduct;
}

const MinimalisticProductCard = ({ product }: Props) => {
    const locale = useLocale();
    const imgUrl =
        product.product_media?.find((media) => media.is_primary)?.url ?? '';

    return (
        <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out w-[150px] h-48 hover:bg-beer-softFoam">
            <Link
                href={`/products/${product.id}`}
                locale={locale}
                target="_blank"
            >
                <DisplayImageProduct
                    class="w-full h-24 object-cover p-2"
                    imgSrc={
                        SupabaseProps.BASE_PRODUCTS_URL +
                        decodeURIComponent(imgUrl)
                    }
                    alt={product.name}
                />
                <div className="p-4">
                    <h3 className="text-sm font-semibold hover:underline text-gray-800">
                        {product.name}
                    </h3>
                </div>
            </Link>
        </div>
    );
};

export default MinimalisticProductCard;
