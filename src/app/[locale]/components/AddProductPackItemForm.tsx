import { useTranslations } from 'next-intl';
import { memo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { pack_type_options } from '@/lib//beerEnum';
import { ModalAddProductFormData } from '@/lib//types/types';
import { DeleteButton } from './common/DeleteButton';
import { FilePreviewImageMultimedia } from './common/FilePreviewImageMultimedia';
import InputLabel from './common/InputLabel';
import Spinner from './common/Spinner';

const AddProductPackItemForm = memo(
    ({
        onRemove,
        index,
        form,
    }: {
        onRemove: (index: number) => void;
        index: number;
        form: UseFormReturn<ModalAddProductFormData, any>;
    }) => {
        const t = useTranslations();
        const [isSubmitting, setIsSubmitting] = useState(false);

        const { getValues, register } = form;

        const handleRemovePack = (index: number) => {
            if (isSubmitting) return;

            setIsSubmitting(true);

            setTimeout(() => {
                // We need to remove like this because it's accessing twice to this method,
                // so if we find the index it's going to remove it two times
                // fields.findIndex((field) => field.id === id) > -1 &&
                //     remove(fields.findIndex((field) => field.id === id));
                onRemove(index);
                setIsSubmitting(false);
            }, 1000);
        };

        return (
            <fieldset className="border border-gray-200 p-6 rounded-lg shadow-md bg-white">
                {isSubmitting ? (
                    <Spinner size="medium" />
                ) : (
                    <div className="space-y-6 w-full">
                        {/* Quantity and price */}
                        <div className="flex w-full flex-row items-end space-x-4">
                            <div className="w-full">
                                <label
                                    htmlFor={`packs.${index}.pack`}
                                    className="text-sm text-gray-600"
                                >
                                    {t('pack_quantity')} nº {index + 1}
                                </label>
                                <select
                                    required
                                    id={`packs.${index}.pack`}
                                    {...register(
                                        `packs.${index}.quantity` as const,
                                        {
                                            value: getValues(
                                                `packs.${index}.quantity`,
                                            ),
                                            required: true,
                                            valueAsNumber: true,
                                        },
                                    )}
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                                >
                                    {pack_type_options.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.value}
                                        </option>
                                    ))}
                                </select>
                                {`errors.packs.${index}.pack.type` ===
                                    'required' && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {t('errors.input_required')}
                                    </p>
                                )}
                            </div>

                            <InputLabel
                                form={form}
                                label={`packs.${index}.price`}
                                labelText={`${t('pack_price')} €`}
                                registerOptions={{
                                    value: getValues(`packs.${index}.price`),
                                    required: true,
                                    min: 0,
                                    valueAsNumber: true,
                                }}
                                placeholder="2.5"
                                inputType="number"
                                defaultValue={3}
                            />

                            {/* Delete BTN */}
                            <div className="flex-grow-0">
                                <DeleteButton
                                    onClick={() => handleRemovePack(index)}
                                />
                            </div>
                        </div>

                        {/* Pack name */}
                        <InputLabel
                            form={form}
                            label={`packs.${index}.name`}
                            labelText={t('pack_name')}
                            registerOptions={{
                                value: getValues(`packs.${index}.name`),
                                required: true,
                            }}
                            placeholder={`Pack ${index + 1}`}
                        />

                        {/* File */}
                        <div className="flex w-full flex-row items-end space-x-4">
                            <div className="w-full">
                                <label
                                    htmlFor={`packs.${index}.img_url`}
                                    className="text-sm text-gray-600"
                                >
                                    {t('pack_img_url')}
                                </label>
                                <FilePreviewImageMultimedia
                                    form={form}
                                    registerName={`packs.${index}.img_url`}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </fieldset>
        );
    },
);

export default AddProductPackItemForm;
