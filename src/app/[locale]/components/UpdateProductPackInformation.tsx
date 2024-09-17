import Button from './common/Button';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IProductPack, ModalUpdateProductFormData } from '@/lib//types/types';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid'; // Ensure uuid is installed
import { faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UpdateProductPackItemForm from './UpdateProductPackItemForm';
import { useAuth } from '../(auth)/Context/useAuth';

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
    form: UseFormReturn<ModalUpdateProductFormData, any>;
}

export default function UpdateProductPackInformation({ form }: Props) {
    const t = useTranslations();
    const { supabase } = useAuth();

    const { control, getValues } = form;

    const { fields, append, remove } = useFieldArray({
        name: 'packs',
        control,
    });

    const handleRemovePack = async (
        packId: string,
        productId: string,
        index: number,
    ) => {
        if (packId && productId) {
            const imgUrlToRemoveFromDB = getValues(`packs.${index}.img_url`);
            const decodeUriPackImg = decodeURIComponent(imgUrlToRemoveFromDB);

            // Remove the image from the storage
            const { error: errorStorage } = await supabase.storage
                .from('products')
                .remove([decodeUriPackImg]);

            if (errorStorage) throw errorStorage;

            const { error } = await supabase
                .from('product_packs')
                .delete()
                .eq('product_id', productId);

            if (error) throw error;
        }

        remove(index);
    };

    const handleUpdatePack = () => {
        // Append a new pack with a unique id
        append({ ...emptyPack, id: uuidv4() });
    };

    return (
        <section className="relative border-2 rounded-lg border-gray-200 p-6 bg-white shadow-md">
            <FontAwesomeIcon
                icon={faMoneyBillWave}
                title={'Product Pack Price Icon'}
                className="h-12 w-12 text-beer-blonde absolute -top-4 -left-4 bg-white p-2 rounded-full shadow-lg"
            />

            <div className="mx-10">
                <h2 className="text-4xl font-['NexaRust-script']">
                    {t('add_product_pack')}
                </h2>

                <div className="space-y-2 mb-4">
                    <span className="text-sm text-gray-600 mb-4 block">
                        {t('add_product_pack_description')}
                    </span>

                    <span className="text-sm text-gray-600 mb-4 block">
                        {t('add_product_pack_description_2')}
                    </span>

                    <span className="text-sm text-gray-600 mb-4 block">
                        {t('add_product_pack_description_3')}
                    </span>
                </div>

                {fields.map((pack, index) => (
                    <div key={pack.id} className="relative mb-4">
                        <UpdateProductPackItemForm
                            pack={pack}
                            onRemove={handleRemovePack}
                            index={index}
                            form={form}
                        />
                    </div>
                ))}

                <Button primary medium onClick={handleUpdatePack} class="mt-4">
                    {fields.length === 0
                        ? t('add_pack')
                        : t('add_another_pack')}
                </Button>
            </div>
        </section>
    );
}
