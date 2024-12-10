'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { InfoTooltip } from '../ui/InfoTooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface Props {
    label: string;
    inputType?: string;
    infoTooltip?: string;
    placeholder?: string;
    labelText?: string;
    defaultValue?: any;
    disabled?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
    value?: any;
    isRequired?: boolean;
    isLoading?: boolean;
    isNumberWithDecimals?: boolean;
}
const InputLabelNoForm = ({
    label,
    labelText,
    inputType = 'text',
    infoTooltip,
    placeholder,
    defaultValue,
    disabled,
    onChange,
    onInput,
    value,
    isRequired = false,
    isLoading = false,
    isNumberWithDecimals = false,
}: Props) => {
    const t = useTranslations();
    const [visible, setVisible] = useState(false);

    return (
        <div className="w-full">
            {(inputType === 'text' ||
                inputType === 'email' ||
                inputType === 'tel' ||
                inputType === 'url' ||
                inputType === 'date') && (
                <label
                    className={`flex-col flex w-full items-start space-y-2 text-sm text-gray-600 dark:text-gray-300`}
                    htmlFor={label}
                >
                    <span className="font-medium">
                        {labelText ? t(labelText) : t(label)}
                        {isRequired && <span className="text-red-500"> *</span>}
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
                        placeholder={placeholder}
                        defaultValue={defaultValue}
                        disabled={disabled || isLoading}
                        value={value}
                        onInput={onInput}
                        id={label}
                        onChange={onChange}
                    />
                </label>
            )}

            {inputType === 'number' && (
                <label
                    className={`flex-col flex w-full items-start space-y-2 text-sm text-gray-600 dark:text-gray-300`}
                    htmlFor={label}
                >
                    <span className="font-medium">
                        {labelText ? t(labelText) : t(label)}
                        {isRequired && <span className="text-red-500"> *</span>}
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
                        placeholder={placeholder}
                        defaultValue={defaultValue}
                        disabled={disabled || isLoading}
                        value={value}
                        onInput={onInput}
                        id={label}
                        step={isNumberWithDecimals ? '0.01' : '1'}
                        onChange={onChange}
                    />
                </label>
            )}

            {inputType === 'checkbox' && (
                <label
                    className={`${
                        inputType === 'checkbox'
                            ? 'flex-row-reverse items-end justify-end gap-1'
                            : 'flex-col '
                    } flex w-full items-start space-y-2 text-sm text-gray-600 dark:text-gray-300`}
                    htmlFor={label}
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
                        placeholder={placeholder}
                        defaultValue={defaultValue}
                        disabled={disabled || isLoading}
                        onInput={onInput}
                        id={label}
                    />
                </label>
            )}

            {inputType === 'password' && (
                <label
                    className={` relative w-full items-start space-y-2 text-sm text-gray-600 dark:text-gray-300`}
                    htmlFor={label}
                >
                    <span className="font-medium">
                        {labelText ? labelText : t(label)}
                    </span>

                    <input
                        type={visible ? 'text' : 'password'}
                        className={` 
                            ${disabled && 'bg-gray-100'}
                            ${'relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm'}
                            
                        
                        `}
                        placeholder={placeholder}
                        defaultValue={defaultValue}
                        disabled={disabled}
                        id={label}
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

            {inputType === 'file' && (
                <label
                    className={` relative w-full items-start space-y-2 text-sm text-gray-600 dark:text-gray-300`}
                    htmlFor={label}
                >
                    <span className="font-medium">
                        {labelText ? labelText : t(label)}
                    </span>

                    <input
                        type={inputType}
                        className={` 
                            ${disabled && 'bg-gray-100'}
                            ${'relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm'}
                        `}
                        placeholder={placeholder}
                        disabled={disabled || isLoading}
                        id={label}
                    />
                </label>
            )}
        </div>
    );
};

export default InputLabelNoForm;
