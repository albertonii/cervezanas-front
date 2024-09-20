import Button from '@/app/[locale]/components/common/Button';
import TitleH3 from '@/app/[locale]/components/basic/TitleH3';
import InputTextarea from '@/app/[locale]/components/common/InputTextarea';
import React, { useState } from 'react';
import {
    FieldError,
    SubmitHandler,
    useFieldArray,
    useForm,
} from 'react-hook-form';
import {
    IShipmentTracking,
    ShipmentTrackingMessagesFormData,
} from '@/lib/types/types';
import { z, ZodType } from 'zod';
import { useMutation } from 'react-query';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { handleUpdateShipmentTrackingMessages } from '../../../actions';

const schemaMessages: ZodType<ShipmentTrackingMessagesFormData> = z.object({
    messages: z.array(
        z.object({
            content: z.string(),
            created_at: z.string(),
            tracking_id: z.string(),
        }),
    ),
});

type MessagesValidationSchema = z.infer<typeof schemaMessages>;

interface Props {
    shipmentTracking: IShipmentTracking;
}

const DistributorShipmentTrackingMessageForm = ({
    shipmentTracking,
}: Props) => {
    const t = useTranslations();

    const [isLoading, setIsLoading] = useState(false);

    const formTrackingMessages = useForm<MessagesValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schemaMessages),
        defaultValues: {
            messages: shipmentTracking.shipment_tracking_messages || [
                {
                    content: '',
                    created_at: new Date().toISOString(),
                    tracking_id: shipmentTracking.id,
                },
            ],
        },
    });

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = formTrackingMessages;

    const { fields, append, remove } = useFieldArray({
        name: 'messages',
        control,
    });

    const handleUpdateShipmentMessages = async (
        form: MessagesValidationSchema,
    ) => {
        setIsLoading(true);

        handleUpdateShipmentTrackingMessages(form, shipmentTracking.id);

        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    };

    const updateShipmentMessages = useMutation(
        'updateShipmentMessages',
        handleUpdateShipmentMessages,
    );

    const onSubmit: SubmitHandler<MessagesValidationSchema> = (
        formValues: ShipmentTrackingMessagesFormData,
    ) => {
        return new Promise<void>((resolve, reject) => {
            updateShipmentMessages.mutate(formValues, {
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
        <div
            className={`bg-white p-4 rounded-md shadow-lg ${
                isLoading && 'opacity-40'
            }`}
        >
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
                            const field =
                                key as keyof ShipmentTrackingMessagesFormData;
                            return renderError(field, errors[field]);
                        })}
                    </ul>
                </div>
            )}
            <TitleH3
                name="tracking.messages"
                description="tracking.tracking_description_messages"
            />
            <form onSubmit={handleSubmit(onSubmit)}>
                {fields.map((field, index) => (
                    <div key={field.id} className="mb-4">
                        <InputTextarea
                            form={formTrackingMessages}
                            label={`messages.${index}.content`}
                            labelText={`${t('tracking.message')} ${index + 1}`}
                        />

                        <div className="flex justify-end mt-2">
                            <Button small danger onClick={() => remove(index)}>
                                {t('tracking.remove_message')}
                            </Button>
                        </div>
                    </div>
                ))}

                <div className="flex justify-end mt-4">
                    <Button
                        btnType="button"
                        onClick={() =>
                            append({
                                content: '',
                                created_at: new Date().toISOString(),
                                tracking_id: shipmentTracking.id,
                            })
                        }
                        accent
                        small
                    >
                        {t('tracking.add_message')}
                    </Button>
                </div>

                <div className="flex justify-end mt-4">
                    <Button
                        btnType="submit"
                        isLoading={isLoading}
                        disabled={isLoading}
                        primary
                        medium
                    >
                        {t('tracking.update_messages')}
                    </Button>
                </div>
            </form>
        </div>
    );
};
export default DistributorShipmentTrackingMessageForm;
