import Button from '../../../../components/common/Button';
import InputLabel from '../../../../components/common/InputLabel';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { IAward } from '../../../../../../lib/types/types';
import { SupabaseProps } from '../../../../../../constants';
import { DeleteButton } from '../../../../components/common/DeleteButton';
import { DisplayInputError } from '../../../../components/common/DisplayInputError';
import { FilePreviewImageMultimedia } from '../../../../components/common/FilePreviewImageMultimedia';

const emptyAward: IAward = {
    id: '',
    name: '',
    description: '',
    img_url: '',
    year: 0,
    product_id: '',
};

interface Props {
    form: UseFormReturn<any, any>;
}

interface FileProps {
    index: number;
    file: File;
}

export function UpdateAwardsSection({ form }: Props) {
    const t = useTranslations();

    const preUrl =
        SupabaseProps.BASE_URL + SupabaseProps.STORAGE_PRODUCTS_IMG_URL;

    const { control } = form;

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

    const handleAddAward = () => {
        append(emptyAward);
    };

    const handleRemoveAward = (index: number) => {
        setSelectedFiles((current) =>
            current.filter((selectedFile) => selectedFile.index !== index),
        );

        remove(index);
    };

    return (
        <section id="Award">
            {fields.map((field, index) => (
                <div key={field.id}>
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-11">
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
                        </div>

                        <div className="col-span-1 items-end flex justify-end">
                            <DeleteButton
                                onClick={() => handleRemoveAward(index)}
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
                            preUrl={preUrl}
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
}