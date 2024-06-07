import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { DisplayInputError } from '../../common/DisplayInputError';
import { ModalAddBoxPackFormData } from '../../../../../lib/types/product';
import { formatCurrency } from '../../../../../utils/formatCurrency';

interface Props {
    form: UseFormReturn<ModalAddBoxPackFormData, any>;
}

export function BoxSummary({ form }: Props) {
    const t = useTranslations();

    const {
        getValues,
        formState: { errors },
    } = form;

    return (
        <>
            {/* Resumen de las características del producto que se va a crear  */}
            <section className="flex flex-col gap-2 space-y-4 border p-4">
                {/* Public  */}
                <fieldset className="flex justify-between flex-row gap-2">
                    <label className="text-md text-gray-600 flex flex-col gap-2 max-w-[33vw]">
                        <span className="font-semibold">{t('is_public')}:</span>

                        <span className="">
                            {getValues('is_public') ? t('yes') : t('no')}
                        </span>
                    </label>

                    {/* Name  */}
                    <label className="flex flex-col text-md text-gray-600 max-w-[33vw]">
                        <span className="font-semibold">
                            {t('name_label')}:
                        </span>

                        <span className="truncate">{getValues('name')}</span>
                    </label>

                    <label className="flex flex-col text-md gap-2 text-gray-600 max-w-[33vw] ">
                        <span className="font-semibold">
                            {t('description')}:
                        </span>

                        <span className="truncate">
                            {getValues('description')}
                        </span>
                    </label>
                </fieldset>

                <fieldset className="flex flex-row justify-between gap-2 space-x-4">
                    <label className="text-md text-gray-600 space-x-2">
                        <span className="font-semibold">{t('price')}</span>

                        <span className="text-md">
                            {formatCurrency(getValues('price'))}
                        </span>
                    </label>

                    <label className="text-md text-gray-600 space-x-2">
                        <span className="font-semibold">{t('weight')}</span>

                        <span className="text-md">{getValues('weight')}</span>
                    </label>
                </fieldset>

                {/* <fieldset className="flex flex-row justify-between gap-2 space-x-4">
                    <h4 className="space-x-2">
                        <label className="text-md font-semibold text-gray-600">
                            {t('stock_quantity_label')}
                        </label>

                        <span className="text-md">
                            {getValues('stock_quantity')}
                        </span>
                    </h4>

                    <h4 className="space-x-2">
                        <label className="text-md font-semibold text-gray-600">
                            {t('stock_limit_notification_label')}
                        </label>

                        <span className="text-md">
                            {getValues('stock_limit_notification')}
                        </span>
                    </h4>
                </fieldset> */}

                {/* {getValues('packs').length > 0 && (
                    <h4 className="text-xl text-beer-draft">
                        <label className="text-md font-semibold text-gray-600">
                            {t('packs')}
                        </label>
                    </h4>
                )} */}

                {/* {getValues('packs').map((pack, index) => (
                    <fieldset
                        key={index}
                        className="flex flex-col gap-2 space-y-4 rounded border p-2"
                    >
                        <div className="flex flex-row justify-between">
                            <div className="space-x-2">
                                <label className="text-md font-semibold text-gray-600">
                                    {t('pack_name')}
                                </label>

                                <span className="text-md">
                                    {pack.name.length === 0
                                        ? t('unassigned')
                                        : pack.name}
                                </span>
                            </div>

                            <div className="space-x-2">
                                <label className="text-md font-semibold text-gray-600">
                                    {t('pack_quantity')}
                                </label>

                                <span className="text-md">{pack.quantity}</span>
                            </div>
                        </div>

                        <div className="flex flex-row justify-between">
                            <h4 className="space-x-2">
                                <label className="text-md font-semibold text-gray-600">
                                    {t('pack_price')} €
                                </label>

                                <span className="text-md">
                                    {formatCurrency(pack.price)}
                                </span>
                            </h4>

                            <h4 className="space-x-2">
                                <label className="text-md font-semibold text-gray-600">
                                    {t('pack_img_url')}
                                </label>

                                <span className="text-md">
                                    {pack.img_url.length === 0 ? (
                                        t('unassigned')
                                    ) : (
                                        <FilePreview file={pack.img_url[0]} />
                                    )}
                                </span>
                            </h4>
                        </div>
                    </fieldset>
                ))} */}

                {/* Errores detectados:  */}
                {Object.keys(errors).length > 0 && (
                    <fieldset className="flex flex-col gap-2 space-y-4 rounded border p-2">
                        <h4 className="text-xl text-red-600">
                            <label className="text-md font-semibold text-gray-600">
                                {t('errors.form_errors_detected')}
                            </label>
                        </h4>

                        <span className="text-md text-red-600">
                            {t('errors.correct_and_submit')}
                        </span>

                        {Object.keys(errors).map((error, index) => (
                            <div key={index} className="text-md">
                                Campo: <DisplayInputError message={error} />
                            </div>
                        ))}
                    </fieldset>
                )}
            </section>
        </>
    );
}
