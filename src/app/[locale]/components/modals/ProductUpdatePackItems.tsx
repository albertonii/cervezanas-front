import { useTranslations } from 'next-intl';
import { memo, useState } from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { SupabaseProps } from '../../../../constants';
import { pack_type_options } from '../../../../lib/beerEnum';
import {
    ModalUpdateProductFormData,
    ModalUpdateProductPackFormData,
} from '../../../../lib/types/types';
import { DeleteButton } from '../common/DeleteButton';
import { FilePreviewImageMultimedia } from '../common/FilePreviewImageMultimedia';
import InputLabel from '../common/InputLabel';
import Spinner from '../common/Spinner';

const ProductUpdatePackItem = memo(
    ({
        pack,
        onRemove,
        index,
        form,
    }: {
        pack: ModalUpdateProductPackFormData;
        onRemove: (packId: string, productId: string, index: number) => void;
        index: number;
        form: UseFormReturn<ModalUpdateProductFormData, any>;
    }) => {
        const t = useTranslations();

        const preUrl =
            SupabaseProps.BASE_URL + SupabaseProps.STORAGE_PRODUCTS_IMG_URL;

        const [isSubmitting, setIsSubmitting] = useState(false);

        const { register, getValues, control } = form;

        const { remove } = useFieldArray({
            name: 'packs',
            control,
        });

        const handleRemovePack = async (
            packId: string,
            productId: string,
            index: number,
        ) => {
            if (isSubmitting) return;
            setIsSubmitting(true);

            setTimeout(() => {
                // We need to remove like this because it's accessing twice to this method,
                // so if we find the index it's going to remove it two times
                // fields.findIndex((field) => field.id === id) > -1 &&
                //     remove(fields.findIndex((field) => field.id === id));
                onRemove(packId, productId, index);
                remove(index);
                setIsSubmitting(false);
            }, 1000);
        };

        return (
            <fieldset className="border border-solid border-gray-300 p-3">
                {isSubmitting ? (
                    <Spinner size="medium" />
                ) : (
                    <div className="space-y w-full">
                        {/* Quantity and price  */}
                        <div className="flex w-full flex-row items-end space-x-3">
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
                                    className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
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
                                    <p>{t('errors.input_required')}</p>
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
                        </div>

                        {/* Pack name  */}
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

                        {/* File  */}
                        <div className="flex w-full flex-row items-end space-x-3 space-y-2">
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
                                    preUrl={preUrl}
                                />
                            </div>

                            {/* Delete BTN  */}
                            <div className="flex-grow-0">
                                <DeleteButton
                                    onClick={() =>
                                        handleRemovePack(
                                            pack.id!,
                                            getValues(
                                                `packs.${index}.product_id`,
                                            ),
                                            index,
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                )}
            </fieldset>
        );
    },
);

export default ProductUpdatePackItem;
