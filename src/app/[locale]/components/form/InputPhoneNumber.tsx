'use client';

import PhoneInput from 'react-phone-input-2';
import React from 'react';
import { ROLE_ENUM } from '@/lib/enums';
import { useTranslations } from 'next-intl';
import { Controller, UseFormReturn } from 'react-hook-form';

/**
 * Props:
 * - labelCountry: Nombre de la propiedad en react-hook-form que guardará el "código país" (en tu schema, p.ej. 'company_phone_country_code').
 * - labelPhone:   Nombre de la propiedad en r-h-f que guardará el "número local" (p.ej. 'company_phone_number').
 */
interface PhoneNumberInputProps {
    form: UseFormReturn<any, any>;
    role: ROLE_ENUM;
}

/**
 * InputPhoneNumber:
 *  - Muestra un select con la lista de "country codes" (o country “value”).
 *  - Muestra un input para el número local.
 *  - Valida con libphonenumber-js si es un número válido para ese país.
 */
export function InputPhoneNumber({ form, role }: PhoneNumberInputProps) {
    const t = useTranslations();

    const {
        formState: { errors },
        control,
    } = form;

    return (
        <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
                {t('public_user_information.company_phone')}
            </label>

            {/* Con Controller, unificamos react-hook-form y PhoneInput */}
            <Controller
                control={control}
                name="company_phone"
                rules={{
                    required: role === ROLE_ENUM.Distributor,
                }}
                render={({ field, fieldState }) => (
                    <>
                        <PhoneInput
                            preferredCountries={['es']}
                            country={'es'}
                            value={field.value || ''}
                            onChange={(phone) => field.onChange(phone)}
                            placeholder="Selecciona código y escribe tu número"
                            inputStyle={{
                                width: '100%',
                            }}
                        />

                        {fieldState.error && (
                            <p className="mt-1 text-xs text-red-600">
                                {t('errors.invalid_phone_format')}
                            </p>
                        )}
                    </>
                )}
            />
        </div>
    );
}
