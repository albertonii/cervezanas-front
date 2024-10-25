import UpdateAwardInformationForm from '@/app/[locale]/components/products/UpdateAwardInformationForm';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { IAward, IAwardUpdateForm } from '@/lib//types/types';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@/app/[locale]/components/ui/buttons/Button';

const emptyAward: IAward = {
    id: '',
    name: '',
    description: '',
    img_url: '',
    year: 2024,
    product_id: '',
};

interface Props {
    form: UseFormReturn<any, any>;
    handleArrayOfAwardsToDelete: (award: {
        id: string;
        img_url: string;
    }) => void;
}

interface FileProps {
    index: number;
    file: File;
}

export function UpdateAwardsSection({
    form,
    handleArrayOfAwardsToDelete,
}: Props) {
    const t = useTranslations();

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

        const award = fields[index] as IAwardUpdateForm;

        const awardId = award.award_id;
        const awardImgUrl = award.img_url;

        if (awardId) {
            handleArrayOfAwardsToDelete({ id: awardId, img_url: awardImgUrl });
        }

        remove(index);
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
                        <UpdateAwardInformationForm
                            form={form}
                            index={index}
                            handleRemoveAward={handleRemoveAward}
                        />
                    </div>
                ))}

                <Button primary medium onClick={() => handleAddAward()}>
                    {t('modal_product_award_add')}
                </Button>
            </div>
        </section>
    );
}
