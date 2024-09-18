import React from 'react';
import { FieldError, SubmitHandler, useForm } from 'react-hook-form';
import { IShipmentTracking, ShipmentTrackingFormData } from '@/lib/types/types';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'react-query';
import DistributorShipmentTrackingMessageForm from './DistributorShipmentTrackingMessageForm';
import { handleUpdateShipmentTracking } from '../../../actions';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { useTranslations } from 'next-intl';

const schema: ZodType<ShipmentTrackingFormData> = z.object({
    id: z.string(),
    status: z.string(),
    // estimated_date: z.string(),
    is_updated_by_distributor: z.boolean(),
    shipment_company: z.string(),
    shipment_tracking_id: z.string(),
    shipment_url: z.string(),
    upd_estimated_date: z.string(),
    messages: z.array(
        z.object({
            content: z.string(),
            created_at: z.string(),
            tracking_id: z.string(),
        }),
    ),
});

type ValidationSchema = z.infer<typeof schema>;

interface Props {
    shipmentTracking: IShipmentTracking;
}

const DistributorShipmentTrackingForm = ({ shipmentTracking }: Props) => {
    const t = useTranslations();
    const { handleMessage } = useMessage();

    const form = useForm<ValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {
            id: shipmentTracking.id,
            status: shipmentTracking.status,
            is_updated_by_distributor:
                shipmentTracking.is_updated_by_distributor,
            shipment_company: shipmentTracking.shipment_company,
            shipment_tracking_id: shipmentTracking.shipment_tracking_id,
            shipment_url: shipmentTracking.shipment_url,
            upd_estimated_date: shipmentTracking.upd_estimated_date,
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = form;

    const updateShipmentTracking = async (form: ValidationSchema) => {
        setValue('id', shipmentTracking.id);
        await handleUpdateShipmentTracking(form)
            .then(() => {
                handleMessage({
                    type: 'success',
                    message: 'Shipment Tracking updated successfully',
                });
            })
            .catch((error) => {
                console.info('Error updating shipment tracking:', error);
                handleMessage({
                    type: 'error',
                    message: 'Error updating shipment tracking',
                });
                throw error;
            });
    };

    const updateShipmentTrackingMutation = useMutation({
        mutationKey: 'updateShipmentTracking',
        mutationFn: updateShipmentTracking,
        onError: (error) => {
            console.error(error);
        },
    });

    const onSubmit: SubmitHandler<ValidationSchema> = (
        formValues: ShipmentTrackingFormData,
    ) => {
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
        <div className="bg-white p-4 rounded-md shadow-md">
            {/* Errores detectados */}
            {Object.keys(errors).length > 0 && (
                <div className="flex flex-col gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="text-xl font-semibold text-red-600">
                        {t('errors.form_errors_detected')}
                    </h4>
                    <span className="text-md text-red-600">
                        {t('errors.correct_and_submit')}
                    </span>
                    <ul className="list-disc list-inside text-md text-red-600">
                        {Object.keys(errors).map((key, index) => {
                            const field = key as keyof ShipmentTrackingFormData;
                            return renderError(field, errors[field]);
                        })}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Status
                    </label>
                    <input
                        type="text"
                        {...register('status')}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                    {errors.status && (
                        <p className="text-red-500 text-sm">
                            {errors.status.message}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Shipment Company
                    </label>
                    <input
                        type="text"
                        {...register('shipment_company')}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                    {errors.shipment_company && (
                        <p className="text-red-500 text-sm">
                            {errors.shipment_company.message}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Shipment Tracking ID
                    </label>
                    <input
                        type="text"
                        {...register('shipment_tracking_id')}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                    {errors.shipment_tracking_id && (
                        <p className="text-red-500 text-sm">
                            {errors.shipment_tracking_id.message}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Shipment URL
                    </label>
                    <input
                        type="url"
                        {...register('shipment_url')}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                    {errors.shipment_url && (
                        <p className="text-red-500 text-sm">
                            {errors.shipment_url.message}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Updated Estimated Date
                    </label>
                    <input
                        type="date"
                        {...register('upd_estimated_date')}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                    {errors.upd_estimated_date && (
                        <p className="text-red-500 text-sm">
                            {errors.upd_estimated_date.message}
                        </p>
                    )}
                </div>

                <DistributorShipmentTrackingMessageForm
                    form={form}
                    trackingId={shipmentTracking.id}
                />

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Update Tracking Information
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DistributorShipmentTrackingForm;
