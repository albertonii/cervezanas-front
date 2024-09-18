import Link from 'next/link';
import React, { useState } from 'react';
import { IBusinessOrder } from '@/lib/types/types';
import { useLocale, useTranslations } from 'next-intl';
import { formatDateDefaultInput } from '@/utils/formatDate';

interface Props {
    bOrder: IBusinessOrder;
}

const ProductBusinnesInformation = ({ bOrder }: Props) => {
    const [showTrackingInfo, setShowTrackingInfo] = useState(false);

    if (
        !bOrder.order_items ||
        bOrder.order_items.length === 0 ||
        !bOrder.shipment_tracking
    )
        return <></>;

    console.log(bOrder.shipment_tracking);
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

                {/* Mostrar botón para expandir información de tracking si el distribuidor la ha actualizado */}
                {is_updated_by_distributor ? (
                    <div className="mt-4">
                        <button
                            onClick={() =>
                                setShowTrackingInfo(!showTrackingInfo)
                            }
                            className="text-sm text-blue-500 hover:text-blue-700 underline"
                        >
                            {showTrackingInfo
                                ? t('tracking.hide_tracking_information')
                                : t('tracking.show_tracking_information')}
                        </button>

                        {/* Información de tracking */}
                        {showTrackingInfo && (
                            <div className="mt-2 p-4 bg-gray-100 rounded-md space-y-2">
                                {shipment_company && (
                                    <p>
                                        <span className="font-semibold">
                                            {t('tracking.company')}:{' '}
                                        </span>
                                        {shipment_company}
                                    </p>
                                )}
                                {shipment_url && (
                                    <p>
                                        <span className="font-semibold">
                                            {t('tracking.url')}:{' '}
                                        </span>
                                        <a
                                            href={shipment_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            {shipment_url}
                                        </a>
                                    </p>
                                )}
                                {shipment_tracking_id && (
                                    <p>
                                        <span className="font-semibold">
                                            {t(
                                                'tracking.identification_number',
                                            )}
                                            :{' '}
                                        </span>
                                        {shipment_tracking_id}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="mt-4">
                        {/* Mensaje de que el distribuidor no ha actualizado la información de tracking */}
                        <p className="text-sm text-red-500">
                            {t(
                                'tracking.distributor_not_updated_tracking_information',
                            )}
                        </p>

                        {/* Información del distribuidor enviará una notificación con la información de seguimiento una vez que haya sido actualizada. */}
                        <p className="text-sm text-gray-500">
                            {t('tracking.distributor_will_send_notification')}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductBusinnesInformation;
