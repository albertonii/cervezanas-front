'use client';

import React from 'react';
import { InfoTooltip } from '../ui/InfoTooltip';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { DisplayInputError } from '../ui/DisplayInputError';

interface Props {
    form: UseFormReturn<any, any>;
    label: string;
    labelText?: string;
    registerOptions?: {
        required?: boolean;
        min?: number;
        max?: number;
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
        validate?: any;
        valueAsNumber?: boolean;
    };
    placeholder?: string;
    disabled?: boolean;
    infoTooltip?: string;
    isRequired?: boolean;
    rows?: number;
}
export default function InputTextarea({
    form,
    label,
    labelText,
    registerOptions,
    placeholder,
    disabled = false,
    infoTooltip,
    isRequired = false,
    rows = 3,
}: Props) {
    const t = useTranslations();

    const {
        register,
        formState: { errors },
    } = form;

    return (
        <div className="w-full">
            <label className="flex w-full flex-col items-start space-y-2 text-sm text-gray-600">
                <span className="">
                    {labelText ? labelText : t(label)}
                    {isRequired && <span className="text-red-500"> *</span>}
                    {infoTooltip && (
                        <InfoTooltip
                            content={`${t(infoTooltip)}`}
                            delay={0}
                            width={'max-content'}
                        />
                    )}
                </span>

                <textarea
                    className={`
                        ${disabled && 'bg-gray-100'}
                        max-h-[180px] sm:h-32 w-full rounded-md border-2 border-gray-300 px-3 py-2 text-gray-900 
                        placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm`}
                    {...register(label, registerOptions)}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={rows}
                />
            </label>

            {errors[label] && (
                <DisplayInputError
                    message={errors[label]?.message || 'errors.input_required'}
                />
            )}
        </div>
    );
}
