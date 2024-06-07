'use client';

import dynamic from 'next/dynamic';
import React, { ComponentProps, useState } from 'react';
import { z, ZodType } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../(auth)/Context/useAuth';
import { IProductLot } from '../../../../lib/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { format_options } from '../../../../lib/beerEnum';
import { useMutation, useQueryClient } from 'react-query';
import InputLabel from '../common/InputLabel';
import SelectInput from '../common/SelectInput';
import InputTextarea from '../common/InputTextarea';
import { formatDateDefaultInput } from '../../../../utils/formatDate';
import Spinner from '../common/Spinner';

const ModalWithForm = dynamic(() => import('./ModalWithForm'), { ssr: false });

type ModalUpdLotFormData = {
    lot_name: string;
    lot_number: string;
    product_id: string;
    quantity: number;
    limit_notification: number;
    recipe?: string;
    expiration_date: string;
    manufacture_date: string;
    packaging: string;
};

const schema: ZodType<ModalUpdLotFormData> = z.object({
    lot_number: z.string().min(1, { message: 'errors.input_number_min_1' }),
    lot_name: z.string().nonempty({ message: 'errors.input_required' }),
    quantity: z.number().positive({ message: 'errors.input_required' }),
    limit_notification: z
        .number()
        .positive({ message: 'errors.input_required' }),
    recipe: z.string().optional(),
    expiration_date: z.string().nonempty({ message: 'errors.input_required' }),
    manufacture_date: z.string().nonempty({ message: 'errors.input_required' }),
    packaging: z.string().transform((value) => {
        const valueNumber = parseInt(value);
        return format_options[valueNumber].label;
    }),
    product_id: z.string().nonempty({ message: 'errors.input_required' }),
});

type ValidationSchema = z.infer<typeof schema>;

interface Props {
    productLot: IProductLot;
    showModal: boolean;
    handleEditShowModal: ComponentProps<any>;
}

export function UpdateLot({
    productLot,
    showModal,
    handleEditShowModal,
}: Props) {
    const t = useTranslations();
    const { user, supabase } = useAuth();
    const queryClient = useQueryClient();

    const [isLoading, setIsLoading] = useState(false);

    const packagingNum = format_options.find(
        (option) => option.label === productLot.packaging,
    )?.value;

    const form = useForm<ModalUpdLotFormData>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {
            lot_number: productLot.lot_number,
            lot_name: productLot.lot_name,
            product_id: productLot.product_id,
            quantity: productLot.quantity,
            limit_notification: productLot.limit_notification,
            recipe: productLot.recipe,
            manufacture_date: formatDateDefaultInput(
                productLot.manufacture_date,
            ),
            expiration_date: formatDateDefaultInput(productLot.expiration_date),
        },
    });

    const { handleSubmit } = form;

    const handleLotUpdate = async (form: ValidationSchema) => {
        setIsLoading(true);

        const {
            quantity,
            lot_number,
            lot_name,
            limit_notification,
            recipe,
            manufacture_date,
            expiration_date,
            packaging,
        } = form;

        if (productLot) {
            const { error } = await supabase
                .from('product_lots')
                .update({
                    quantity,
                    lot_number,
                    lot_name,
                    limit_notification,
                    recipe,
                    manufacture_date,
                    expiration_date,
                    owner_id: user?.id,
                    packaging,
                })
                .eq('id', productLot.id);

            if (error) {
                setIsLoading(false);
                throw error;
            }
        }

        setIsLoading(false);
        handleEditShowModal(false);
        queryClient.invalidateQueries('productLotList');
    };

    const updateLotMutation = useMutation({
        mutationKey: ['updateLot'],
        mutationFn: handleLotUpdate,
    });

    const onSubmit: SubmitHandler<ValidationSchema> = (
        formValues: ModalUpdLotFormData,
    ) => {
        return new Promise<void>((resolve, reject) => {
            updateLotMutation.mutate(formValues, {
                onSuccess: () => {
                    resolve();
                },
                onError: (error) => {
                    reject(error);
                },
            });
        });
    };

    return (
        <ModalWithForm
            showBtn={false}
            showModal={showModal}
            setShowModal={handleEditShowModal}
            title={'config_lot'}
            btnTitle={'save'}
            description={'modal_product_description'}
            handler={handleSubmit(onSubmit)}
            handlerClose={() => handleEditShowModal(false)}
            classIcon={''}
            classContainer={`${isLoading && ' opacity-75'}`}
            form={form}
        >
            <>
                <form>
                    <section className="relative flex-auto py-6">
                        <div className="flex w-full flex-col ">
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
                                    }}
                                    placeholder={t('manufacture_date')}
                                    inputType={'date'}
                                />

                                <InputLabel
                                    form={form}
                                    label={'expiration_date'}
                                    registerOptions={{
                                        required: true,
                                    }}
                                    placeholder={t('expiration_date')}
                                    inputType={'date'}
                                />
                            </div>

                            {/* Packaging & Recipe */}
                            <SelectInput
                                form={form}
                                options={format_options}
                                label={'packaging'}
                                registerOptions={{
                                    required: true,
                                }}
                                defaultValue={packagingNum}
                            />

                            <InputTextarea
                                form={form}
                                label={'recipe'}
                                registerOptions={{
                                    required: true,
                                }}
                                placeholder={t('beer_recipe')}
                            />

                            {/* Separator  */}
                            <div className="inline-flex w-full items-center justify-center">
                                <hr className="my-4 h-[0.15rem] w-full rounded border-0 bg-beer-foam dark:bg-gray-700" />
                            </div>

                            {/* Display lot attached to product  */}
                            <div className="flex w-full flex-row space-x-3 ">
                                <div className="space-y w-full ">
                                    <label
                                        htmlFor="lot"
                                        className="text-sm text-gray-600 md:text-lg"
                                    >
                                        {t('lot_attached_to_product')}
                                    </label>

                                    <p className="text-md font-semibold md:text-2xl">
                                        {productLot.products?.name}{' '}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </form>
            </>
        </ModalWithForm>
    );
}
