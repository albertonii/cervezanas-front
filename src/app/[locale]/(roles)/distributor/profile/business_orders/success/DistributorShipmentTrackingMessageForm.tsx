import React from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { ShipmentTrackingFormData } from '@/lib/types/types';

interface Props {
    form: UseFormReturn<ShipmentTrackingFormData, any>;
    trackingId: string;
}

const DistributorShipmentTrackingMessageForm = ({
    form,
    trackingId,
}: Props) => {
    const { control, register } = form;

    const { fields, append, remove } = useFieldArray({
        name: 'messages',
        control,
    });

    return (
        <div className="bg-white p-4 rounded-md shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
                Distributor Messages
            </h3>

            {fields.map((field, index) => (
                <div key={field.id} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Message {index + 1}
                    </label>
                    <textarea
                        {...register(`messages.${index}.content` as const)}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
                        rows={3}
                        defaultValue={field.content} // Valor inicial del mensaje
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            type="button"
                            onClick={() => remove(index)} // Eliminar el mensaje actual
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}

            <div className="flex justify-end mt-4">
                <button
                    type="button"
                    onClick={() =>
                        append({
                            content: '',
                            created_at: new Date().toISOString(),
                            tracking_id: trackingId,
                        })
                    } // Añadir un nuevo mensaje vacío
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Add New Message
                </button>
            </div>
        </div>
    );
};
export default DistributorShipmentTrackingMessageForm;
