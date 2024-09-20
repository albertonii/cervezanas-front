import React, { useState } from 'react';
import { FieldError, SubmitHandler, useForm } from 'react-hook-form';
import { IShipmentTracking, ShipmentTrackingFormData } from '@/lib/types/types';
import { z, ZodType } from 'zod';
import { useMutation } from 'react-query';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { handleUpdateShipmentTracking } from '../../../actions';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { DISTRIBUTOR_ONLINE_ORDER_STATUS } from '@/constants';
import InputLabel from '@/app/[locale]/components/form/InputLabel';
import Button from '@/app/[locale]/components/ui/buttons/Button';

const schemaTrackingInfo: ZodType<ShipmentTrackingFormData> = z.object({
    id: z.string(),
    status: z.string(),
    is_updated_by_distributor: z.boolean(),
    shipment_company: z.string(),
    shipment_tracking_id: z.string(),
    shipment_url: z.string(),
    estimated_date: z.string(),
});

type TrackingInfoValidationSchema = z.infer<typeof schemaTrackingInfo>;

interface Props {
    shipmentTracking: IShipmentTracking;
}

const DistributorShipmentTrackingForm = ({ shipmentTracking }: Props) => {
    const t = useTranslations();

    const [isLoading, setIsLoading] = useState(false);

    const { handleMessage } = useMessage();
    const [bOrderStatus, setBOrderStatus] = useState(shipmentTracking.status);

    const formTrackingInfo = useForm<TrackingInfoValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schemaTrackingInfo),
        defaultValues: {
            id: shipmentTracking.id,
            status: shipmentTracking.status,
            is_updated_by_distributor:
                shipmentTracking.is_updated_by_distributor,
            shipment_company: shipmentTracking.shipment_company,
            shipment_tracking_id: shipmentTracking.shipment_tracking_id,
            shipment_url: shipmentTracking.shipment_url,
            estimated_date: shipmentTracking.estimated_date,
        },
    });

    const {
        handleSubmit: handleTrackingInfo,
        formState: { errors: errorsTrackingInfo },
        setValue: setValueTrackingInfo,
    } = formTrackingInfo;

    const updateShipmentTracking = async (
        form: TrackingInfoValidationSchema,
    ) => {
        setIsLoading(true);

        setValueTrackingInfo('id', shipmentTracking.id);
        await handleUpdateShipmentTracking(form)
            .then(() => {
                handleMessage({
                    type: 'success',
                    message: 'success.update_shipment_tracking',
                });
            })
            .catch((error) => {
                console.info('errors.update_shipment_tracking', error);
                handleMessage({
                    type: 'error',
                    message: 'errors.update_shipment_tracking',
                });
                throw error;
            });

        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    };

    const updateShipmentTrackingMutation = useMutation({
        mutationKey: 'updateShipmentTracking',
        mutationFn: updateShipmentTracking,
        onError: (error) => {
            console.error(error);
        },
    });

    const onSubmitTrackingInformation: SubmitHandler<
        TrackingInfoValidationSchema
    > = (formValues: ShipmentTrackingFormData) => {
        return new Promise<void>((resolve, reject) => {
            updateShipmentTrackingMutation.mutate(formValues, {
                onSuccess: () => {
                    resolve();
                },
                onError: (error) => {
                    reject(error);
                },
            });
        });
    };

    const handleBOrderStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value;
        setBOrderStatus(status);
    };

    const renderError = (field: string, error: FieldError | any) => {
        if (Array.isArray(error)) {
            return error.map((item, i) =>
                Object.keys(item).map((subField) => (
                    <li
                        key={`${field}_${i}_${subField}`}
                        className="mt-2 p-4 bg-red-100 border border-red-300 rounded-lg flex flex-col"
                    >
                        <span className="text-sm font-medium text-red-700">
                            {t('error_field_name')}:{' '}
                            <strong>
                                {t(field)} - {t(subField)} -
                            </strong>{' '}
                            {t('error_field_array_number')}: {i + 1}
                        </span>
                        <span className="text-sm text-red-600 mt-1">
                            {t('error_field_message')}:{' '}
                            {t(item[subField].message)}
                        </span>
                    </li>
                )),
            );
        } else if (typeof error === 'object' && error !== null) {
            // Eliminar todas las propiedades del objeto error menos 'message'
            const { message, ...rest } = error;

            return (
                <li
                    key={`${field}`}
                    className="mt-2 p-4 bg-red-100 border border-red-300 rounded-lg flex flex-col"
                >
                    <span className="text-sm font-medium text-red-700">
                        {t('error_field_name')}:{' '}
                        <strong>{t(`${field}`)}</strong>
                    </span>
                    <span className="text-sm text-red-600 mt-1">
                        {t('error_field_message')}: {t(message)}
                    </span>
                </li>
            );
        } else {
            return (
                <li key={field} className="mt-2">
                    <strong>{t(`${field}`)}:</strong> {error?.message}
                </li>
            );
        }
    };

    return (
        <div
            className={`bg-white p-4 rounded-md shadow-lg ${
                isLoading && 'opacity-40'
            }`}
        >
            {/* Errores detectados */}
            {Object.keys(errorsTrackingInfo).length > 0 && (
                <div className="flex flex-col gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="text-xl font-semibold text-red-600">
                        {t('errors.form_errors_detected')}
                    </h4>
                    <span className="text-md text-red-600">
                        {t('errors.correct_and_submit')}
                    </span>
                    <ul className="list-disc list-inside text-md text-red-600">
                        {Object.keys(errorsTrackingInfo).map((key, index) => {
                            const field = key as keyof ShipmentTrackingFormData;
                            return renderError(
                                field,
                                errorsTrackingInfo[field],
                            );
                        })}
                    </ul>
                </div>
            )}

            <form onSubmit={handleTrackingInfo(onSubmitTrackingInformation)}>
                <div className="mb-4 flex">
                    {/* Input select que actualizará el estado para ese business_order  */}

                    <InputLabel
                        labelText="tracking.company"
                        label="shipment_company"
                        form={formTrackingInfo}
                    />

                    <div>
                        <label
                            htmlFor="status"
                            className="block text-sm font-medium text-gray-700"
                        >
                            {t('tracking.status')}
                        </label>

                        <select
                            id="status"
                            name="status"
                            autoComplete="status"
                            className="m-2 block rounded-md border-gray-300 pl-3 pr-10 focus:border-beer-blonde focus:outline-none focus:ring-beer-blonde sm:text-sm md:text-base"
                            onChange={(e) => handleBOrderStatus(e)}
                            value={bOrderStatus}
                        >
                            <option
                                value={DISTRIBUTOR_ONLINE_ORDER_STATUS.PENDING}
                            >
                                {t(DISTRIBUTOR_ONLINE_ORDER_STATUS.PENDING)}
                            </option>
                            <option
                                value={
                                    DISTRIBUTOR_ONLINE_ORDER_STATUS.PROCESSING
                                }
                            >
                                {t(DISTRIBUTOR_ONLINE_ORDER_STATUS.PROCESSING)}
                            </option>
                            {/* <option value={DISTRIBUTOR_ONLINE_ORDER_STATUS.SHIPPED}>
                            {t(DISTRIBUTOR_ONLINE_ORDER_STATUS.SHIPPED)}
                        </option>
                        <option
                            value={DISTRIBUTOR_ONLINE_ORDER_STATUS.DELIVERED}
                        >
                            {t(DISTRIBUTOR_ONLINE_ORDER_STATUS.DELIVERED)}
                        </option> */}
                            <option
                                value={
                                    DISTRIBUTOR_ONLINE_ORDER_STATUS.CANCELLED
                                }
                            >
                                {t(DISTRIBUTOR_ONLINE_ORDER_STATUS.CANCELLED)}
                            </option>
                            <option
                                value={DISTRIBUTOR_ONLINE_ORDER_STATUS.ERROR}
                            >
                                {t(DISTRIBUTOR_ONLINE_ORDER_STATUS.ERROR)}
                            </option>
                        </select>
                    </div>
                </div>

                <div className="mb-4">
                    <InputLabel
                        labelText="tracking.shipment_tracking_id"
                        label="shipment_tracking_id"
                        form={formTrackingInfo}
                    />
                </div>

                <div className="mb-4">
                    <InputLabel
                        labelText="tracking.url"
                        inputType="url"
                        label="shipment_url"
                        form={formTrackingInfo}
                    />
                </div>

                <div className="mb-4">
                    <InputLabel
                        inputType="date"
                        form={formTrackingInfo}
                        label={'estimated_date'}
                        labelText={t('tracking.estimated_delivery_date')}
                    />
                </div>

                <div className={`flex justify-end`}>
                    <Button
                        isLoading={isLoading}
                        btnType="submit"
                        title="tracking.update_information"
                        medium
                        primary
                    >
                        {t('tracking.update_information')}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default DistributorShipmentTrackingForm;
