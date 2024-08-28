import React from 'react';
import InputLabel from './common/InputLabel';
import { faCubes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { ModalAddProductFormData } from '@/lib//types/types';

interface Props {
    form: UseFormReturn<ModalAddProductFormData, any>;
}

export default function StockInformation({ form }: Props) {
    const t = useTranslations();

    const { getValues } = form;

    return (
        <div className="relative border-2 rounded-lg border-gray-200 p-6 bg-white shadow-md">
            <FontAwesomeIcon
                icon={faCubes}
                title={'Stock Icon'}
                className="h-12 w-12 text-beer-blonde absolute -top-4 -left-4 bg-white p-2 rounded-full shadow-lg"
            />

            <section className="mx-10">
                <p className="text-slate-700 my-4 text-xl font-semibold">
                    {t('modal_product_add_stock_title')}
                </p>

                {/* Stock commitment notice */}
                <p className="text-sm text-gray-600 mb-4 block">
                    El stock que se compromete a introducir a través de este
                    formulario es aquel que se compromete con la plataforma
                    <span className="font-semibold"> CERVEZANAS.</span> Este
                    stock debe estar disponible en todo momento.
                </p>

                {/* Stock quantity and Limitation */}
                <div className="flex w-full flex-row space-x-4">
                    <InputLabel
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
                        defaultValue={500}
                        isRequired={true}
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
                        defaultValue={20}
                        isRequired={true}
                    />
                </div>
            </section>
        </div>
    );
}
