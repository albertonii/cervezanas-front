'use client';

import React, { memo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { DisplayInputError } from './DisplayInputError';
import { InfoTooltip } from './InfoTooltip';

interface Props {
    form: UseFormReturn<any, any>;
    label: string;
    registerOptions?: {
        required?: boolean;
        min?: number;
        max?: number;
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
        validate?: any;
        valueAsNumber?: boolean;
        valueAsDate?: boolean;
        value?: any;
    };
    inputType?: string;
    infoTooltip?: string;
    placeholder?: string;
    labelText?: string;
    defaultValue?: any;
    disabled?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const InputLabel = memo(
    ({
        form,
        label,
        labelText,
        registerOptions,
        inputType = 'text',
        infoTooltip,
        placeholder,
        defaultValue,
        disabled,
        onChange,
    }: Props) => {
        const t = useTranslations();
        const {
            register,
            formState: { errors },
        } = form;

        return (
            <div className="w-full">
                <label
                    className={`${
                        inputType === 'checkbox'
                            ? 'flex-row-reverse items-end justify-end gap-1'
                            : 'flex-col '
                    } flex w-full items-start space-y-2 text-sm text-gray-600`}
                >
                    <span className="font-medium">
                        {labelText ? labelText : t(label)}
                        {infoTooltip && (
                            <InfoTooltip
                                content={`${t(infoTooltip)}`}
                                delay={0}
                                width={600}
                            />
                        )}
                    </span>

                    <input
                        type={inputType ?? 'text'}
                        className={` 
                            ${disabled && 'bg-gray-100'}
                            ${
                                inputType === 'checkbox'
                                    ? 'float-right h-5 w-5 rounded border-bear-light bg-beer-softBlonde text-beer-blonde focus:ring-2 focus:ring-bear-alvine dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-beer-softBlonde'
                                    : 'relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm'
                            }
                        
                        `}
                        {...register(label, registerOptions)}
                        placeholder={placeholder}
                        defaultValue={defaultValue}
                        disabled={disabled}
                        min={registerOptions?.min}
                        max={registerOptions?.max}
                        onChange={onChange}
                    />
                </label>

                {errors[label] && (
                    <DisplayInputError
                        message={
                            errors[label]?.message || 'errors.input_required'
                        }
                    />
                )}
            </div>
        );
    },
);

export default InputLabel;
