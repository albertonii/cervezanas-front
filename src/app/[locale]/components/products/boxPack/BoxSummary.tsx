import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '../../../../../utils/formatCurrency';
import { FilePreview } from '../../common/FilePreview';
import { DisplayInputError } from '../../common/DisplayInputError';
import { ModalAddBoxPackFormData } from '../../../../../lib/types/product';

interface Props {
    form: UseFormReturn<ModalAddBoxPackFormData, any>;
}

export function BoxSummary({ form: { getValues, formState } }: Props) {
    const t = useTranslations();

    const { errors } = formState;

    return (
        <>
            {/* Resumen de las características del producto que se va a crear  */}
            <section className="flex flex-col gap-2 space-y-4 border p-4">
                {/* Public  */}
                <fieldset className="flex flex-row gap-2">
                    <label className="text-md font-semibold text-gray-600">
                        {t('is_public')}
                    </label>

                    <span className="text-md">
                        {getValues('is_public') ? t('yes') : t('no')}
                    </span>
                </fieldset>

                {/* Name  */}
                <fieldset className="flex flex-row gap-2">
                    <label className="text-md font-semibold text-gray-600">
                        {t('name_label')}
                    </label>

                    <span className="text-md">{getValues('name')}</span>
                </fieldset>

                <fieldset className="flex flex-row gap-2">
                    <label className="text-md font-semibold text-gray-600">
                        {t('description')}
                    </label>

                    <span className="text-md">{getValues('description')}</span>
                </fieldset>

                {/* <fieldset className="flex flex-row justify-between gap-2 space-x-4">
                    <h4 className="space-x-2">
                        <label className="text-md font-semibold text-gray-600">
                            {t('intensity_label')}
                        </label>

                        <span className="text-md">
                            {getValues('intensity')}
                        </span>
                    </h4>

                    <h4 className="space-x-2">
                        <label className="text-md font-semibold text-gray-600">
                            {t('fermentation_label')}
                        </label>

                        <span className="text-md">
                            {getValues('fermentation')}
                        </span>
                    </h4>

                    <h4 className="space-x-2">
                        <label className="text-md font-semibold text-gray-600">
                            {t('color_label')}
                        </label>

                        <span className="text-md">{getValues('color')}</span>
                    </h4>
                </fieldset> */}

                {/* <fieldset className="flex flex-row justify-between gap-2 space-x-4">
                    <h4 className="space-x-2">
                        <label className="text-md font-semibold text-gray-600">
                            {t('origin_label')}
                        </label>

                        <span className="text-md">{getValues('origin')}</span>
                    </h4>

                    <h4 className="space-x-2">
                        <label className="text-md font-semibold text-gray-600">
                            {t('family_label')}
                        </label>

                        <span className="text-md">{getValues('family')}</span>
                    </h4>

                    <h4 className="space-x-2">
                        <label className="text-md font-semibold text-gray-600">
                            {t('era_label')}
                        </label>

                        <span className="text-md">{getValues('era')}</span>
                    </h4>
                </fieldset> */}

                {/* <fieldset className="flex flex-row justify-between gap-2 space-x-4">
                    <h4 className="space-x-2">
                        <label className="text-md font-semibold text-gray-600">
                            {t('format_label')}
                        </label>

                        <span className="text-md">
                            {t(getValues('format'))}
                        </span>
                    </h4>

                    <h4 className="space-x-2">
                        <label className="text-md font-semibold text-gray-600">
                            {t('volume_label')}
                        </label>

                        <span className="text-md">{getValues('volume')}</span>
                    </h4>

                    <h4 className="space-x-2">
                        <label className="text-md font-semibold text-gray-600">
                            {t('price')}
                        </label>

                        <span className="text-md">
                            {formatCurrency(getValues('price'))}
                        </span>
                    </h4>
                </fieldset> */}

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
                        <h4 className="text-xl text-beer-draft">
                            <label className="text-md font-semibold text-gray-600">
                                {t('form_errors_detected')}
                            </label>
                        </h4>

                        {Object.keys(errors).map((error, index) => (
                            <div key={index} className="text-md">
                                Campo: <DisplayInputError message={error} />
                            </div>
                        ))}

                        <div className="text-md">
                            {t('errors.correct_and_submit')}
                        </div>
                    </fieldset>
                )}
            </section>
        </>
    );
}
