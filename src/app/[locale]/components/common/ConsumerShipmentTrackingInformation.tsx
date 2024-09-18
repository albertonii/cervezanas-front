import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IShipmentTracking } from '@/lib/types/types';
import { formatDateDefaultInput } from '@/utils/formatDate';

interface Props {
    shipmentTracking: IShipmentTracking;
}

const ConsumerShipmentTrackingInformation = ({ shipmentTracking }: Props) => {
    const t = useTranslations();

    const [is_updated_by_distributor, setIsUpdatedByDistributor] =
        useState(false);
    const [showTrackingInfo, setShowTrackingInfo] = useState(false);

    const {
        status,
        created_at,
        estimated_date,
        shipment_company,
        shipment_tracking_id,
        shipment_url,
        upd_estimated_date,
    } = shipmentTracking;

    useEffect(() => {
        if (shipmentTracking) {
            console.log(shipmentTracking.is_updated_by_distributor);
            setIsUpdatedByDistributor(
                shipmentTracking.is_updated_by_distributor,
            );
        }

        return () => {};
    }, [shipmentTracking]);

    return (
        <section className="col-span-2 md:col-span-1">
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
                        onClick={() => setShowTrackingInfo(!showTrackingInfo)}
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
                                        {t('tracking.identification_number')}:{' '}
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
        </section>
    );
};

export default ConsumerShipmentTrackingInformation;
