import Button from '../ui/buttons/Button';
import AddAwardInformationForm from './AddAwardInformationForm';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { IAward } from '@/lib/types/types';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { ModalAddProductFormData } from '@/lib/types/types';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        if (isSubmitting) return;

        setIsSubmitting(true);

        setSelectedFiles((current) =>
            current.filter((selectedFile) => selectedFile.index !== index),
        );

        remove(index);

        setTimeout(() => {
            setIsSubmitting(false);
        }, 100);
    };

    const handleAddAward = () => {
        append(emptyAward);
    };

    return (
        <section
            id="Award"
            className="relative border-2 rounded-lg border-gray-200 py-6 px-2 sm:px-6 bg-white shadow-md"
        >
            <FontAwesomeIcon
                icon={faTrophy}
                title={'Awards Icon'}
                className="h-12 w-12 text-beer-blonde absolute -top-4 -left-4 bg-white p-2 rounded-full shadow-lg"
            />

            <div className="mx-0 sm:mx-10 space-y-4 py-8 sm:py-0">
                <h2 className="text-4xl font-['NexaRust-script']">
                    {t('modal_product_awards_title')}
                </h2>

                <div className="space-y-2">
                    <span className="text-sm text-gray-600 mb-4 block">
                        {t('add_award_description')}
                    </span>
                </div>

                {fields.map((field, index) => (
                    <div key={field.id} className="space-y-6 py-4">
                        <AddAwardInformationForm
                            form={form}
                            index={index}
                            handleRemoveAward={handleRemoveAward}
                        />
                    </div>
                ))}

                {fields.length > 0 ? (
                    <Button
                        primary
                        medium
                        onClick={handleAddAward}
                        disabled={isSubmitting}
                    >
                        {t('modal_product_award_add_another')}
                    </Button>
                ) : (
                    <Button
                        primary
                        medium
                        onClick={handleAddAward}
                        disabled={isSubmitting}
                    >
                        {t('modal_product_award_add')}
                    </Button>
                )}
            </div>
        </section>
    );
};
