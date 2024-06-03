'use client';

import useFetchProductsByOwner from '../../../../hooks/useFetchProductsByOwner';
import React, { useState } from 'react';
import { z, ZodType } from 'zod';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../(auth)/Context/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from 'react-query';
import { format_options } from '../../../../lib/beerEnum';
import { SubmitHandler, useForm } from 'react-hook-form';
import { SearchCheckboxProductsList } from '../common/SearchCheckboxProductsList';
import dynamic from 'next/dynamic';
import InputLabel from '../common/InputLabel';
import SelectInput from '../common/SelectInput';
import InputTextarea from '../common/InputTextarea';
import Spinner from '../common/Spinner';

const ModalWithForm = dynamic(() => import('./ModalWithForm'), { ssr: false });

type ModalAddLotFormData = {
    quantity: number;
    lot_name: string;
    lot_number: string;
    product_id: string;
    limit_notification: number;
    recipe?: string;
    expiration_date: Date;
    manufacture_date: Date;
    packaging: string;
};

const schema: ZodType<ModalAddLotFormData> = z.object({
    lot_number: z.string().min(1, { message: 'errors.input_min_1' }),
    lot_name: z.string().nonempty({ message: 'errors.input_required' }),
    quantity: z.number().positive({ message: 'errors.input_required' }),
    limit_notification: z
        .number()
        .positive({ message: 'errors.input_required' }),
    recipe: z.string().optional(),
    expiration_date: z.date(),
    manufacture_date: z.date(),
    packaging: z.string().transform((value) => {
        const valueNumber = parseInt(value);
        return format_options[valueNumber].label;
    }),
    product_id: z.string().nonempty({ message: 'errors.input_required' }),
});

type ValidationSchema = z.infer<typeof schema>;

export function AddLot() {
    const t = useTranslations();
    const { user, supabase } = useAuth();

    const [showModal, setShowModal] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);

    const { data: products } = useFetchProductsByOwner(user?.id);

    const form = useForm<ModalAddLotFormData>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {
            lot_number: '',
            lot_name: '',
            product_id: '',
            quantity: 100,
            limit_notification: 10,
            recipe: '',
            expiration_date: new Date(),
            manufacture_date: new Date(),
            packaging: t(format_options[0].label) ?? '',
        },
    });

    const { handleSubmit, reset } = form;

    const queryClient = useQueryClient();

    const handleInsertLot = async (form: ValidationSchema) => {
        setIsLoading(true);

        const {
            quantity,
            lot_number,
            lot_name,
            limit_notification,
            recipe,
            expiration_date,
            manufacture_date,
            packaging,
            product_id,
        } = form;

        const expirationDateToString = expiration_date?.toISOString();
        const manufactureDateToString = manufacture_date?.toISOString();

        const userId = user?.id;

        const { error } = await supabase.from('product_lots').insert({
            quantity,
            lot_number,
            lot_name,
            limit_notification,
            recipe,
            packaging,
            product_id,
            owner_id: userId,
            expiration_date: expirationDateToString,
            manufacture_date: manufactureDateToString,
        });

        if (error) {
            setIsLoading(false);
            throw error;
        }

        setIsLoading(false);
        setShowModal(false);
        reset();
    };

    const insertProductLotMutation = useMutation({
        mutationKey: ['insertProductLot'],
        mutationFn: handleInsertLot,
        onError: (error: any) => {
            console.error(error);
        },
    });

    const onSubmit: SubmitHandler<ValidationSchema> = (
        formValues: ModalAddLotFormData,
    ) => {
        return new Promise<void>((resolve, reject) => {
            insertProductLotMutation.mutate(formValues, {
                onSuccess: () => resolve(),
                onError: (error: any) => reject(error),
            });
        });
    };

    return (
        <ModalWithForm
            showBtn={true}
            showModal={showModal}
            setShowModal={setShowModal}
            title={'config_lot'}
            btnTitle={'add_lot'}
            description={'modal_product_description'}
            handler={handleSubmit(onSubmit)}
            classIcon={''}
            classContainer={`${isLoading && ' opacity-75'}`}
            form={form}
        >
            <>
                <form>
                    <section className="relative flex w-full flex-auto flex-col  py-6">
                        {/* Lot Name Lot Number */}
                        <div className="flex w-full flex-row space-x-3 ">
                            <InputLabel
                                form={form}
                                label={'lot_name'}
                                registerOptions={{
                                    required: true,
                                }}
                                placeholder={t('lot_name')}
                            />

                            <InputLabel
                                form={form}
                                label={'lot_number'}
                                registerOptions={{
                                    required: true,
                                }}
                                placeholder={t('lot_number')}
                            />
                        </div>

                        {/* Quantity & Quantity Notification */}
                        <div className="flex w-full flex-row space-x-3 ">
                            <InputLabel
                                form={form}
                                label={'quantity'}
                                registerOptions={{
                                    required: true,
                                    valueAsNumber: true,
                                    min: 0,
                                }}
                                placeholder={t('quantity')}
                            />

                            <InputLabel
                                form={form}
                                label={'limit_notification'}
                                registerOptions={{
                                    required: true,
                                    valueAsNumber: true,
                                    min: 0,
                                }}
                                placeholder={t('limit_notification')}
                            />
                        </div>

                        {/* Manufacture Date & Expiration Date */}
                        <div className="flex w-full flex-row space-x-3 ">
                            <InputLabel
                                form={form}
                                label={'manufacture_date'}
                                registerOptions={{
                                    required: true,
                                    valueAsDate: true,
                                }}
                                placeholder={t('manufacture_date')}
                                inputType={'date'}
                            />

                            <InputLabel
                                form={form}
                                label={'expiration_date'}
                                registerOptions={{
                                    required: true,
                                    valueAsDate: true,
                                }}
                                placeholder={t('expiration_date')}
                                inputType={'date'}
                            />
                        </div>

                        {/* Packaging & Receipt */}
                        <SelectInput
                            form={form}
                            options={format_options}
                            label={'packaging'}
                            registerOptions={{
                                required: true,
                            }}
                        />

                        <InputTextarea
                            form={form}
                            label={'recipe'}
                            registerOptions={{
                                required: true,
                            }}
                            placeholder={t('beer_recipe')}
                        />

                        <SearchCheckboxProductsList
                            products={products ?? []}
                            form={form}
                        />
                    </section>
                </form>
            </>
        </ModalWithForm>
    );
}
