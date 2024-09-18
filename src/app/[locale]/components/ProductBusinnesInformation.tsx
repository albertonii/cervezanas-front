import Link from 'next/link';
import React from 'react';
import { IBusinessOrder } from '@/lib/types/types';
import { useLocale, useTranslations } from 'next-intl';

interface Props {
    bOrder: IBusinessOrder;
}

const ProductBusinnesInformation = ({ bOrder }: Props) => {
    if (
        !bOrder.order_items ||
        bOrder.order_items.length === 0 ||
        !bOrder.shipment_tracking
    )
        return <></>;

    const t = useTranslations();
    const locale = useLocale();

    const productName = bOrder.order_items[0].product_packs?.products?.name;
    const productDescription =
        bOrder.order_items[0].product_packs?.products?.description;

    return (
        <section className="col-span-2 md:col-span-1">
            <h3 className="text-xl font-medium text-gray-900 hover:text-beer-draft">
                <Link
                    href={`/products/${bOrder.order_items[0].product_packs?.products?.id}`}
                    locale={locale}
                    target="_blank"
                >
                    {productName}
                </Link>
            </h3>

            <span className="space-y-1">
                <p className="text-sm text-gray-500">{t('description')}</p>
                <p className="truncate">{productDescription}</p>
            </span>
        </section>
    );
};

export default ProductBusinnesInformation;
