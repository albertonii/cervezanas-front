import AddProductPackItemForm from './form/AddProductPackItemForm';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IProductPack, ModalAddProductFormData } from '@/lib//types/types';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid'; // Ensure uuid is installed
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from './ui/buttons/Button';
import Description from './ui/Description';

const emptyPack: IProductPack = {
    id: '',
    product_id: '',
    created_at: '',
    quantity: 6,
    price: 0,
    img_url: '',
    name: '',
    randomUUID: '',
};

interface Props {
    form: UseFormReturn<ModalAddProductFormData, any>;
}

export default function ProductPackInformation({ form }: Props) {
    const t = useTranslations();
    const { control } = form;

    const { fields, append, remove } = useFieldArray({
        name: 'packs',
        control,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRemovePack = (index: number) => {
        if (isSubmitting) return;

        setIsSubmitting(true);

        remove(index);

        setTimeout(() => {
            // We need to remove like this because it's accessing twice to this method,
            // so if we find the index it's going to remove it two times
            // fields.findIndex((field) => field.id === id) > -1 &&
            //     remove(fields.findIndex((field) => field.id === id));
            setIsSubmitting(false);
        }, 100);
    };

    const handleAddPack = () => {
        // Append a new pack with a unique id
        append({ ...emptyPack, id: uuidv4() });
    };

    return (
        <section className="relative border-2 rounded-lg border-gray-200 p-6 bg-white shadow-md">
            <FontAwesomeIcon
                icon={faBoxOpen}
                title={'Product Pack Price Icon'}
                className="h-12 w-12 text-yellow-500 absolute -top-4 -left-4 bg-white p-2 rounded-full shadow-xl transform rotate-12"
            />

            <div className="mx-10">
                <h2 className="text-4xl font-['NexaRust-script']">
                    {t('add_product_pack')}
                </h2>

                <div className="space-y-2 mb-4">
                    <Description size={'xsmall'} color={'black'}>
                        {t('add_product_pack_description')}
                    </Description>

                    <Description size={'xsmall'} color={'black'}>
                        {t('add_product_pack_description_2')}
                    </Description>

                    <Description size={'xsmall'} color={'black'}>
                        {t('add_product_pack_description_3')}
                    </Description>
                </div>

                <div className="space-y-4 mb-6">
                    {fields.map((pack, index) => (
                        <div key={pack.id} className="relative mb-4">
                            <AddProductPackItemForm
                                onRemove={handleRemovePack}
                                index={index}
                                form={form}
                            />
                        </div>
                    ))}
                </div>

                <Button
                    primary
                    medium
                    onClick={handleAddPack}
                    disabled={isSubmitting}
                    class="mt-4"
                >
                    {fields.length === 0
                        ? t('add_pack')
                        : t('add_another_pack')}
                </Button>
            </div>
        </section>
    );
}
