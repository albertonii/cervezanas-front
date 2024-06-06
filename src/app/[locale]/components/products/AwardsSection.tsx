import Button from '../common/Button';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { IAward } from '../../../../lib/types/types';
import { DeleteButton } from '../common/DeleteButton';
import { ModalAddProductFormData } from '../../../../lib/types/types';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { DisplayInputError } from '../common/DisplayInputError';
import { FilePreviewImageMultimedia } from '../common/FilePreviewImageMultimedia';
import InputLabel from '../common/InputLabel';

const emptyAward: IAward = {
    id: '',
    name: '',
    description: '',
    img_url: '',
    year: 2023,
    product_id: '',
};

interface Props {
    form: UseFormReturn<ModalAddProductFormData, any>;
}

interface FileProps {
    index: number;
    file: File;
}

export const AwardsSection = ({ form }: Props) => {
    const {
        control,
        formState: { errors },
    } = form;

    const t = useTranslations();

    const { fields, append, remove } = useFieldArray({
        name: 'awards',
        control,
    });

    const [selectedFiles, setSelectedFiles] = useState<FileProps[]>([]);

    useEffect(() => {
        selectedFiles.map((file) => {
            const src = URL.createObjectURL(file.file);

            const preview = document.getElementById(
                `prev-img-${file.index}`,
            ) as HTMLImageElement | null;

            if (preview !== null) {
                preview.src = src;
                preview.style.display = 'block';
            }
        });
    }, [selectedFiles]);

    const handleRemoveAward = (index: number) => {
        setSelectedFiles((current) =>
            current.filter((selectedFile) => selectedFile.index !== index),
        );

        remove(index);
    };

    const handleAddAward = () => {
        append(emptyAward);
    };

    return (
        <section
            id="Award"
            className="space-y-8 p-6 bg-white rounded-lg shadow-md border border-gray-200"
        >
            <h2 className="text-slate-500 text-xl font-semibold leading-relaxed">
                {t('modal_product_awards_title')}
            </h2>

            {fields.map((field, index) => (
                <div key={field.id} className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
                        <InputLabel
                            form={form}
                            label={`awards.${index}.name`}
                            labelText={`${index + 1} ${t('name')}`}
                            registerOptions={{
                                required: true,
                            }}
                            placeholder={t(
                                'input_product_award_name_placeholder',
                            )}
                        />

                        <DeleteButton
                            onClick={() => handleRemoveAward(index)}
                        />
                    </div>

                    <InputLabel
                        form={form}
                        label={`awards.${index}.description`}
                        labelText={t('description')}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder={t(
                            'input_product_award_description_placeholder',
                        )}
                    />

                    <InputLabel
                        form={form}
                        label={`awards.${index}.year`}
                        labelText={t('year')}
                        registerOptions={{
                            required: true,
                            valueAsNumber: true,
                        }}
                        placeholder={t('input_product_award_year_placeholder')}
                        inputType="number"
                        defaultValue={2021}
                    />

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
                </div>
            ))}

            <Button primary medium onClick={handleAddAward}>
                {t('modal_product_award_add')}
            </Button>
        </section>
    );
};
