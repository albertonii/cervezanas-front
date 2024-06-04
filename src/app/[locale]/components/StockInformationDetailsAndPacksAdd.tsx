import React, { useState } from 'react';
import Button from './common/Button';
import InputLabel from './common/InputLabel';
import ProductAddPackItem from './ProductAddPackItems';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import {
    IProductPack,
    ModalAddProductFormData,
} from '../../../lib/types/types';
import { v4 as uuidv4 } from 'uuid'; // Ensure uuid is installed

interface Props {
    form: UseFormReturn<ModalAddProductFormData, any>;
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

export default function StockInformationDetailsAndPacksAdd({ form }: Props) {
    const t = useTranslations();

    const { getValues, control } = form;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { fields, append, remove } = useFieldArray({
        name: 'packs',
        control,
    });

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
        <section className="pt-16">
            <p className="text-slate-500 my-4 text-2xl leading-relaxed">
                {t('modal_product_add_stock_title')}
            </p>

            <div className="flex w-full flex-col space-y-16">
                {/* Stock quantity and Limitation */}
                <div className="flex w-full flex-row space-x-3 ">
                    <InputLabel
                        form={form}
                        label={'stock_quantity'}
                        labelText={t('stock_quantity_label')}
                        registerOptions={{
                            value: getValues('stock_quantity'),
                            required: true,
                            min: 0,
                            valueAsNumber: true,
                        }}
                        placeholder="500"
                        inputType="number"
                        defaultValue={500}
                    />

                    <InputLabel
                        form={form}
                        label={'stock_limit_notification'}
                        labelText={t('stock_limit_notification_label')}
                        registerOptions={{
                            value: getValues('stock_limit_notification'),
                            required: true,
                            min: 0,
                            valueAsNumber: true,
                        }}
                        placeholder="20"
                        inputType="number"
                        defaultValue={20}
                    />
                </div>

                {/* Packs */}
                <div className="flex flex-col space-y-2">
                    <span className="text-2xl ">{t('add_product_pack')}</span>

                    <span className="text-sm ">
                        {t('add_product_pack_description')}
                    </span>

                    {fields.map((pack, index) => (
                        <div key={pack.id} className="relative">
                            <ProductAddPackItem
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
                    >
                        {t('add_pack')}
                    </Button>
                </div>
            </div>
        </section>
    );
}
