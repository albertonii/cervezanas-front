import InputLabel from '../common/InputLabel';
import React, { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { SupabaseProps } from '@/constants';
import { UseFormReturn } from 'react-hook-form';
import { DeleteButton } from '../common/DeleteButton';
import { ModalUpdateProductFormData } from '@/lib//types/types';
import { FilePreviewImageMultimedia } from '../common/FilePreviewImageMultimedia';

interface Props {
    form: UseFormReturn<ModalUpdateProductFormData, any>;
    index: number;
    handleRemoveAward: (index: number) => void;
}

export default function UpdateAwardInformationForm({
    form,
    index,
    handleRemoveAward,
}: Props) {
    const t = useTranslations();

    const { setValue } = form;

    const preUrl =
        SupabaseProps.BASE_URL + SupabaseProps.STORAGE_PRODUCTS_IMG_URL;

    const handleOnChangeImg = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return console.info('No hay archivos');

        setValue(`awards.${index}.img_url_changed`, true);
    };

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
                    preUrl={preUrl}
                    handleOnChangeImg={handleOnChangeImg}
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
