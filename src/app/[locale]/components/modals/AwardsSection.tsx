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
    const { control } = form;

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

    const handleRemoveAward = (index: number, awardId: string) => {
        setSelectedFiles((current) =>
            current.filter((selectedFile) => selectedFile.index !== index),
        );

        // We need to remove like this because it's accessing twice to this method,
        //  so if we find the index it's going to remove it two times
        fields.findIndex((field) => field.id === awardId) > -1 &&
            remove(fields.findIndex((field) => field.id === awardId));
    };

    const handleAddAward = () => {
        append(emptyAward);
    };

    return (
        <section id="Award" className="space-y-4">
            {fields.map((field, index) => (
                <div
                    key={field.id}
                    className="relative flex-auto space-y-4 pt-6"
                >
                    <div className="flex flex-row items-end">
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

                        <div className="ml-4">
                            <DeleteButton
                                onClick={() =>
                                    handleRemoveAward(index, field.id)
                                }
                            />
                        </div>
                    </div>

                    <InputLabel
                        form={form}
                        label={`awards.${index}.description`}
                        labelText={'description'}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder={t('description')}
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

                    <div className="space-y w-full">
                        <label
                            htmlFor="award_img_url"
                            className="text-sm text-gray-600"
                        >
                            {t('upload_img_url')}
                        </label>

                        <FilePreviewImageMultimedia
                            form={form}
                            registerName={`awards.${index}.img_url`}
                        />

                        {`errors.awards.${index}.img_url.type` ===
                            'required' && (
                            <DisplayInputError message="errors.input_required" />
                        )}
                    </div>
                </div>
            ))}

            <Button class="" primary medium onClick={() => handleAddAward()}>
                {t('modal_product_award_add')}
            </Button>
        </section>
    );
};
