import Link from 'next/link';
import React, { useState } from 'react';
import { IBusinessOrder } from '@/lib/types/types';
import { useLocale, useTranslations } from 'next-intl';
import { formatDateDefaultInput } from '@/utils/formatDate';

interface Props {
    bOrder: IBusinessOrder;
}

const DistributorProductBusinnesInformation = ({ bOrder }: Props) => {
    const [showTrackingInfo, setShowTrackingInfo] = useState(false);

    if (
        !bOrder.order_items ||
        bOrder.order_items.length === 0 ||
        !bOrder.shipment_tracking
    )
        return <></>;

    const {
        status,
        created_at,
        estimated_date,
        is_updated_by_distributor,
        shipment_company,
        shipment_tracking_id,
        shipment_url,
        upd_estimated_date,
    } = bOrder.shipment_tracking;

    const t = useTranslations();
    const locale = useLocale();

    const productName = bOrder.order_items[0].product_packs?.products?.name;
    const productDescription =
        bOrder.order_items[0].product_packs?.products?.description;

    return (
        <section className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
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
            </div>

            <div className="col-span-2 md:col-span-1">
                <p>
                    <span className="font-semibold">{t('status')}: </span>
                    {t(status)}
                </p>

                <p>
                    <span className="font-semibold">{t('created_at')}: </span>
                    {formatDateDefaultInput(created_at)}
                </p>

                <p>
                    <span className="font-semibold">
                        {t('tracking.estimated_delivery_date')}:{' '}
                    </span>
                    {upd_estimated_date
                        ? formatDateDefaultInput(upd_estimated_date)
                        : formatDateDefaultInput(estimated_date)}
                </p>
            </div>
        </section>
    );
};

export default DistributorProductBusinnesInformation;
