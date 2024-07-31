import React, { memo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { InfoTooltip } from './InfoTooltip';
import { DisplayInputError } from './DisplayInputError';

interface Props {
    form: UseFormReturn<any, any>;
    labelTooltip?: string;
    options: { label: string; value: any }[];
    label: string;
    labelText?: string;
    defaultValue?: any;
    registerOptions?: {
        required?: boolean;
        min?: number;
        max?: number;
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
        validate?: any;
        valueAsNumber?: boolean;
        shouldBeDirty?: boolean;
    };
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectInput = memo(
    ({
        form,
        options,
        label,
        labelText,
        labelTooltip,
        defaultValue,
        registerOptions,
        onChange,
    }: Props) => {
        const t = useTranslations();

        const {
            setValue,
            register,
            formState: { errors },
        } = form;

        const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            setValue(label, e.target.value, { shouldDirty: true });
            onChange && onChange(e);
        };

        return (
            <div className="w-full">
                <label htmlFor={label} className="flex text-sm text-gray-600">
                    {labelText ? labelText : t(label)}

                    {labelTooltip && (
                        <InfoTooltip
                            content={`${t(labelTooltip)}`}
                            delay={0}
                            width={600}
                        />
                    )}
                </label>

                <select
                    {...register(label, registerOptions)}
                    id={label}
                    className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                    value={defaultValue}
                    onChange={handleOnChange}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {t(option.label)}
                        </option>
                    ))}
                </select>

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

export default SelectInput;
