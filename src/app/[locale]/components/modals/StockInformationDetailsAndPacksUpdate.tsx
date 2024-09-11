import Button from '../common/Button';
import InputLabel from '../common/InputLabel';
import React from 'react';
import ProductUpdatePackItems from './ProductUpdatePackItems';
import { useTranslations } from 'next-intl';
import { IProductPack, ModalUpdateProductFormData } from '@/lib//types/types';
import { useAuth } from '../../(auth)/Context/useAuth';
import { useFieldArray, UseFormReturn } from 'react-hook-form';

interface Props {
    form: UseFormReturn<ModalUpdateProductFormData, any>;
}

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

export default function StockInformationDetailsAndPacksUpdate({ form }: Props) {
    const t = useTranslations();

    const { supabase } = useAuth();

    const {
        getValues,
        control,
        formState: { dirtyFields, isDirty },
    } = form;

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

    const handleAddPack = () => {
        append(emptyPack);
    };

    return (
        <section className="pt-16">
            <p className="text-slate-500 my-4 text-xl leading-relaxed">
                {t('modal_product_add_stock_title')}
            </p>

            <div className="flex w-full flex-col space-y-16">
                {/* Stock quantity and Limitation */}
                <div className="flex w-full flex-row space-x-3 ">
                    {/* <InputLabel
                        form={form}
                        label={'stock_quantity'}
                        labelText={'stock_quantity_label'}
                        registerOptions={{
                            value: getValues('stock_quantity'),
                            required: true,
                            min: 0,
                            valueAsNumber: true,
                        }}
                        placeholder="500"
                        inputType="number"
                    />

                    <InputLabel
                        form={form}
                        label={'stock_limit_notification'}
                        labelText={'stock_limit_notification_label'}
                        registerOptions={{
                            value: getValues('stock_limit_notification'),
                            required: true,
                            min: 0,
                            valueAsNumber: true,
                        }}
                        placeholder="20"
                        inputType="number"
                    /> */}
                </div>

                {/* Packs */}
                <div className="flex flex-col space-y-2">
                    <span className="text-2xl ">{t('add_product_pack')}</span>

                    <span className="text-sm ">
                        {t('add_product_pack_description')}
                    </span>
                </div>

                {fields.map((pack, index) => (
                    <>
                        <ProductUpdatePackItems
                            pack={pack}
                            onRemove={handleRemovePack}
                            index={index}
                            form={form}
                        />
                    </>
                ))}

                <Button class="" primary medium onClick={() => handleAddPack()}>
                    {t('add_pack')}
                </Button>
            </div>
        </section>
    );
}
