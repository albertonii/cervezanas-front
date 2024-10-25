import React from 'react';
import { FieldError, UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { SupabaseProps } from '@/constants';
import { ModalUpdateProductFormData } from '@/lib//types/types';
import { formatCurrency } from '@/utils/formatCurrency';
import {
    color_options,
    family_options,
    fermentation_options,
} from '@/lib/beerEnum';

interface Props {
    form: UseFormReturn<ModalUpdateProductFormData, any>;
}

export function UpdateProductSummary({ form }: Props) {
    const t = useTranslations();

    const {
        getValues,
        formState: { errors },
    } = form;

    const preUrl =
        SupabaseProps.BASE_URL + SupabaseProps.STORAGE_PRODUCTS_IMG_URL;

    const fermentationLabel = t(
        fermentation_options[getValues('fermentation')].label,
    );

    const colorLabel = t(color_options[getValues('color')].label);

    const familyLabel = t(family_options[getValues('family')].label);

    const renderError = (field: string, error: FieldError | any) => {
        if (Array.isArray(error)) {
            return error.map((item, i) =>
                Object.keys(item).map((subField) => (
                    <li
                        key={`${field}_${i}_${subField}`}
                        className="mt-2 p-4 bg-red-100 border border-red-300 rounded-lg flex flex-col"
                    >
                        <span className="text-sm font-medium text-red-700">
                            {t('error_field_name')}:{' '}
                            <strong>
                                {t(field)} - {t(subField)} -
                            </strong>{' '}
                            {t('error_field_array_number')}: {i + 1}
                        </span>
                        <span className="text-sm text-red-600 mt-1">
                            {t('error_field_message')}:{' '}
                            {t(item[subField].message)}
                        </span>
                    </li>
                )),
            );
        } else if (typeof error === 'object' && error !== null) {
            // Eliminar todas las propiedades del objeto error menos 'message'
            const { message, ...rest } = error;

            return (
                <li
                    key={`${field}`}
                    className="mt-2 p-4 bg-red-100 border border-red-300 rounded-lg flex flex-col"
                >
                    <span className="text-sm font-medium text-red-700">
                        {t('error_field_name')}:{' '}
                        <strong>{t(`${field}`)}</strong>
                    </span>
                    <span className="text-sm text-red-600 mt-1">
                        {t('error_field_message')}: {t(message)}
                    </span>
                </li>
            );
        } else {
            return (
                <li key={field} className="mt-2">
                    <strong>{t(`${field}`)}:</strong> {error?.message}
                </li>
            );
        }
    };

    return (
        <section className="flex flex-col gap-4 p-2 sm:p-6 bg-beer-softBlondeBubble rounded-lg shadow-md border border-gray-200">
            {/* Resumen de las características del producto que se va a crear  */}
            {/* Errores detectados */}
            {Object.keys(errors).length > 0 && (
                <div className="flex flex-col gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="text-xl font-semibold text-red-600">
                        {t('errors.form_errors_detected')}
                    </h4>
                    <span className="text-md text-red-600">
                        {t('errors.correct_and_submit')}
                    </span>
                    <ul className="list-disc list-inside text-md text-red-600">
                        {Object.keys(errors).map((key, index) => {
                            const field =
                                key as keyof ModalUpdateProductFormData;
                            return renderError(field, errors[field]);
                        })}
                    </ul>
                </div>
            )}

            {/* Public */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <label className="text-base font-semibold text-black ">
                    {t('is_public')}
                </label>
                <span className="text-md bg-white p-2  rounded-md border-2 border-gray-300 min-w-[180px] min-h-[40px]">
                    {getValues('is_public') ? t('yes') : t('no')}
                </span>
            </div>

            {/* Añadir border y demás  */}
            <div className="flex flex-col gap-4 p-6 bg-beer-softFoam rounded-lg shadow-md border border-gray-200">
                {/* Name */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <label className="text-base font-semibold text-black ">
                        {t('name_label')}
                    </label>
                    <span className="text-md bg-white p-2  rounded-md border-2 border-gray-300 min-w-[180px] min-h-[40px]">
                        {getValues('name')}
                    </span>
                </div>

                {/* Description */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <label className="text-base font-semibold text-black ">
                        {t('description')}
                    </label>
                    <span className="text-md truncate">
                        {getValues('description')}
                    </span>
                </div>

                {/* ABV Fermentation */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex flex-col">
                        <label className="text-base font-semibold text-black ">
                            {t('intensity_label')}
                        </label>

                        <span className="text-md bg-white p-2  rounded-md border-2 border-gray-300 min-w-[180px] min-h-[40px]">
                            {getValues('intensity')} %
                        </span>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-base font-semibold text-black ">
                            {t('fermentation_label')}
                        </label>
                        <span className="text-md bg-white p-2  rounded-md border-2 border-gray-300 min-w-[180px] min-h-[40px]">
                            {fermentationLabel}
                        </span>
                    </div>
                </div>

                {/* Color Family  */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex flex-col">
                        <label className="text-base font-semibold text-black ">
                            {t('color_label')}
                        </label>
                        <span className="text-md bg-white p-2  rounded-md border-2 border-gray-300 min-w-[180px] min-h-[40px]">
                            {colorLabel}
                        </span>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-base font-semibold text-black ">
                            {t('family_label')}
                        </label>
                        <span className="text-md bg-white p-2  rounded-md border-2 border-gray-300 min-w-[180px] min-h-[40px]">
                            {familyLabel}
                        </span>
                    </div>
                </div>

                {/* Format Volume Price */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex flex-col">
                        <label className="text-base font-semibold text-black ">
                            {t('format_label')}
                        </label>
                        <span className="text-md bg-white p-2  rounded-md border-2 border-gray-300 min-w-[180px] min-h-[40px]">
                            {t(getValues('format'))}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-base font-semibold text-black ">
                            {t('volume_label')} (ml)
                        </label>
                        <span className="text-md bg-white p-2  rounded-md border-2 border-gray-300 min-w-[180px] min-h-[40px]">
                            {getValues('volume')}
                        </span>
                    </div>
                    {/* <div className="flex flex-col">
                            <label className="text-base font-semibold text-black ">
                                {t('pvpr')}
                            </label>
                            <span className="text-md bg-white p-2  rounded-md border-2 border-gray-300 min-w-[180px] min-h-[40px]">
                                {formatCurrency(getValues('price'))}
                            </span>
                        </div> */}
                </div>

                {/* Stock Quantity and Notification */}
                {/* <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex flex-col">
                            <label className="text-base font-semibold text-black ">
                                {t('stock_quantity_label')}
                            </label>
                            <span className="text-md bg-white p-2  rounded-md border-2 border-gray-300 min-w-[180px] min-h-[40px]">
                                {getValues('stock_quantity')}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-base font-semibold text-black ">
                                {t('stock_limit_notification_label')}
                            </label>
                            <span className="text-md bg-white p-2  rounded-md border-2 border-gray-300 min-w-[180px] min-h-[40px]">
                                {getValues('stock_limit_notification')}
                            </span>
                        </div>
                    </div> */}
            </div>

            {/* Packs */}
            {getValues('packs').length > 0 && (
                <div className="flex flex-col gap-4 p-2 sm:p-6 bg-white rounded-lg shadow-md border ">
                    <h4 className="text-xl text-gray-600">{t('packs')}</h4>

                    {getValues('packs').map((pack, index) => (
                        <div
                            key={index}
                            className="flex flex-col md:flex-row flex-row gap-2 space-y-4 rounded border p-2  justify-between items-center"
                        >
                            <div className="flex flex-col">
                                <label className="text-base font-semibold text-black ">
                                    {t('pack_name')}
                                </label>
                                <span className="text-md bg-white p-2  rounded-md border-2 border-gray-300 min-w-[180px] min-h-[40px]">
                                    {pack.name.length === 0
                                        ? t('unassigned')
                                        : pack.name}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-base font-semibold text-black ">
                                    {t('pack_quantity')}
                                </label>
                                <span className="text-md bg-white p-2  rounded-md border-2 border-gray-300 min-w-[180px] min-h-[40px]">
                                    {pack.quantity}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-base font-semibold text-black ">
                                    {t('pack_price')} €
                                </label>
                                <span className="text-md bg-white p-2  rounded-md border-2 border-gray-300 min-w-[180px] min-h-[40px]">
                                    {formatCurrency(pack.price)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Awards */}
            {getValues('awards').length > 0 && (
                <div className="flex flex-col gap-4 p-2 sm:p-6 bg-white rounded-lg shadow-md border ">
                    <h4 className="text-xl text-gray-600">{t('awards')}</h4>

                    {getValues('awards').map((award, index) => (
                        <div
                            key={index}
                            className="flex flex-row gap-2 space-y-4 rounded border p-2 justify-between items-center"
                        >
                            <div className="flex flex-col">
                                <label className="text-base font-semibold text-black ">
                                    {t('award_name')}
                                </label>
                                <span className="text-md bg-white p-2  rounded-md border-2 border-gray-300 min-w-[180px] min-h-[40px]">
                                    {award.name.length === 0
                                        ? t('unassigned')
                                        : award.name}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-base font-semibold text-black ">
                                    {t('description')}
                                </label>
                                <span className="text-md bg-white p-2  rounded-md border-2 border-gray-300 min-w-[180px] min-h-[40px]">
                                    {award.description}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-base font-semibold text-black ">
                                    {t('award_year')}
                                </label>
                                <span className="text-md bg-white p-2  rounded-md border-2 border-gray-300 min-w-[180px] min-h-[40px]">
                                    {award.year}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
