import InputLabel from '../form/InputLabel';
import React from 'react';
import { FilePreviewImageMultimedia } from '../common/FilePreviewImageMultimedia';
import { UseFormReturn } from 'react-hook-form';
import { ModalAddProductFormData } from '@/lib//types/types';
import { useTranslations } from 'next-intl';
import { DeleteButton } from '../ui/buttons/DeleteButton';

interface Props {
    form: UseFormReturn<ModalAddProductFormData, any>;
    index: number;
    handleRemoveAward: (index: number) => void;
}

export default function AddAwardInformationForm({
    form,
    index,
    handleRemoveAward,
}: Props) {
    const t = useTranslations();

    return (
        <fieldset className="border border-gray-200 p-6 rounded-lg shadow-md bg-white">
            <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
                <InputLabel
                    form={form}
                    label={`awards.${index}.name`}
                    labelText={`${index + 1} ${t('name')}`}
                    registerOptions={{
                        required: true,
                    }}
                    placeholder={t('input_product_award_name_placeholder')}
                />

                <DeleteButton onClick={() => handleRemoveAward(index)} />
            </div>

            <InputLabel
                form={form}
                label={`awards.${index}.description`}
                labelText={'description'}
                registerOptions={{
                    required: true,
                }}
                placeholder={t('input_product_award_description_placeholder')}
            />

            <InputLabel
                form={form}
                label={`awards.${index}.year`}
                labelText={'year'}
                registerOptions={{
                    required: true,
                    valueAsNumber: true,
                }}
                placeholder={t('input_product_award_year_placeholder')}
                inputType="number"
                defaultValue={2021}
            />

            {/* File */}
            <div className="w-full">
                <label
                    htmlFor={`awards.${index}.img_url`}
                    className="text-sm text-gray-600"
                >
                    {t('upload_img_url')}
                </label>

                <FilePreviewImageMultimedia
                    form={form}
                    registerName={`awards.${index}.img_url`}
                />

                {/* {errors[`awards.${index}.img_url`]?.type ===
                            'required' && (
                            <DisplayInputError
                                message={t('errors.input_required')}
                            />
                        )} */}
            </div>
        </fieldset>
    );
}
