import React, { memo } from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { InfoTooltip } from '../ui/InfoTooltip';
import { DisplayInputError } from '../ui/DisplayInputError';

interface Props {
    form: UseFormReturn<any, any>;
    labelTooltip?: string;
    options: { label: string; value: any }[];
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
        shouldBeDirty?: boolean;
    };
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    optionLabelTranslationPrefix?: string;
    isRequired?: boolean;
    translateLabelTxt?: string;
}

const SelectInput = memo(
    ({
        form,
        options,
        label,
        labelText,
        labelTooltip,
        registerOptions,
        onChange,
        optionLabelTranslationPrefix,
        isRequired = false,
        translateLabelTxt = '',
    }: Props) => {
        const t = useTranslations(translateLabelTxt);

        const {
            setValue,
            watch,
            register,
            formState: { errors },
        } = form;

        const currentValue = watch(label); // Obtiene el valor actual del formulario

        const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            setValue(label, e.target.value, { shouldDirty: true }); // Actualiza el formulario
            onChange && onChange(e); // Llama al onChange si está definido
        };

        return (
            <div className="w-full">
                <label
                    htmlFor={label}
                    className="flex text-sm text-gray-600 dark:text-gray-300 font-medium "
                >
                    {labelText ? labelText : t(label)}
                    {isRequired && <span className="text-red-500 "> *</span>}
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
                    className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm mt-2"
                    value={currentValue} // Sincroniza el valor con react-hook-form
                    onChange={handleOnChange}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {t(
                                `${optionLabelTranslationPrefix ?? ''}${
                                    option.label
                                }`,
                            )}
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
