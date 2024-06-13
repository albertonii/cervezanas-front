import AddProductPackItemForm from './AddProductPackItemForm';
import Button from './common/Button';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    IProductPack,
    ModalAddProductFormData,
} from '../../../lib/types/types';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { generateUUID } from '../../../lib/actions';

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

export default async function ProductPackInformation({ form }: Props) {
    const t = useTranslations();
    const { control } = form;

    const { fields, append, remove } = useFieldArray({
        name: 'packs',
        control,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const uuidV4 = await generateUUID();

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
        append({ ...emptyPack, id: uuidV4 });
    };

    return (
        <section className="relative border-2 rounded-lg border-gray-200 p-6 bg-white shadow-md">
            <FontAwesomeIcon
                icon={faMoneyBillWave}
                title={'Product Pack Price Icon'}
                className="h-12 w-12 text-beer-blonde absolute -top-4 -left-4 bg-white p-2 rounded-full shadow-lg"
            />

            <div className="mx-10">
                <h2 className="text-2xl text-gray-800 font-semibold">
                    {t('add_product_pack')}
                </h2>

                <div className="space-y-2">
                    <span className="text-sm text-gray-600 mb-4 block">
                        {t('add_product_pack_description')}
                    </span>

                    <span className="text-sm text-gray-600 mb-4 block">
                        {t('add_product_pack_description_2')}
                    </span>
                </div>

                {fields.map((pack, index) => (
                    <div key={pack.id} className="relative mb-4">
                        <AddProductPackItemForm
                            onRemove={handleRemovePack}
                            index={index}
                            form={form}
                        />
                    </div>
                ))}

                <Button
                    primary
                    medium
                    onClick={handleAddPack}
                    disabled={isSubmitting}
                    class="mt-4"
                >
                    {t('add_pack')}
                </Button>
            </div>
        </section>
    );
}
