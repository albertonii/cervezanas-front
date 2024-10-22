import Button from './ui/buttons/Button';
import UpdateProductPackItemForm from './UpdateProductPackItemForm';
import ProductPackSectionHeader from './modals/ProductPackSectionHeader';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useTranslations } from 'next-intl';
import { useAuth } from '../(auth)/Context/useAuth';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IProductPack, ModalUpdateProductFormData } from '@/lib//types/types';

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
        <section className="relative border-2 rounded-lg border-gray-200 py-6 px-2 sm:px-6 bg-white shadow-md">
            <FontAwesomeIcon
                icon={faBoxOpen}
                title={'Product Pack Price Icon'}
                className="h-12 w-12 text-yellow-500 absolute -top-4 -left-4 bg-white p-2 rounded-full shadow-xl transform rotate-12"
            />

            <div className="mx-10">
                <ProductPackSectionHeader title={'add_product_pack'} />

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
