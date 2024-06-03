'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { DisplayInputError } from './DisplayInputError';
import { InfoTooltip } from './InfoTooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

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
        shouldBeDirty?: boolean;
    };
    inputType?: string;
    infoTooltip?: string;
    placeholder?: string;
    labelText?: string;
    defaultValue?: any;
    disabled?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: any;
}
const InputLabel = ({
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
    value,
}: Props) => {
    const t = useTranslations();
    const [visible, setVisible] = useState(false);

    const {
        register,
        setValue,
        formState: { errors },
    } = form;

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(label, e.target.value);
        if (onChange) onChange(e);
    };

    return (
        <div className="w-full">
            {(inputType === 'text' ||
                inputType === 'number' ||
                inputType === 'email' ||
                inputType === 'tel' ||
                inputType === 'date') && (
                <label
                    className={`${'flex-col '} flex w-full items-start space-y-2 text-sm text-gray-600`}
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
                        type={inputType}
                        className={` 
                            ${disabled && 'bg-gray-100'}
                            ${'relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm'}
                            
                        
                        `}
                        {...register(label, {
                            ...registerOptions,
                            onChange: handleOnChange,
                        })}
                        placeholder={placeholder}
                        defaultValue={defaultValue}
                        disabled={disabled}
                        min={registerOptions?.min}
                        max={registerOptions?.max}
                        value={value}
                    />
                </label>
            )}

            {inputType === 'checkbox' && (
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
                        type={inputType}
                        className={` 
                            ${disabled && 'bg-gray-100'}
                            ${'float-right h-5 w-5 rounded border-bear-light bg-beer-softBlonde text-beer-blonde focus:ring-2 focus:ring-bear-alvine dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-beer-softBlonde'}
                            
                        
                        `}
                        {...register(label, {
                            ...registerOptions,
                            onChange: handleOnChange,
                        })}
                        placeholder={placeholder}
                        defaultValue={defaultValue}
                        disabled={disabled}
                        min={registerOptions?.min}
                        max={registerOptions?.max}
                    />
                </label>
            )}

            {inputType === 'password' && (
                <label
                    className={` relative w-full items-start space-y-2 text-sm text-gray-600`}
                >
                    <input
                        type={visible ? 'text' : 'password'}
                        className={` 
                            ${disabled && 'bg-gray-100'}
                            ${'relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm'}
                            
                        
                        `}
                        {...register(label, {
                            ...registerOptions,
                            onChange: handleOnChange,
                        })}
                        placeholder={placeholder}
                        defaultValue={defaultValue}
                        disabled={disabled}
                        min={registerOptions?.min}
                        max={registerOptions?.max}
                    />

                    <span
                        className={
                            'z-10 absolute cursor-pointer right-[0.8em] top-0'
                        }
                    >
                        <FontAwesomeIcon
                            icon={visible ? faEyeSlash : faEye}
                            onClick={() => setVisible(!visible)}
                        />
                    </span>
                </label>
            )}

            {errors[label] && (
                <DisplayInputError
                    message={errors[label]?.message || 'errors.input_required'}
                />
            )}
        </div>
    );
};

export default InputLabel;
