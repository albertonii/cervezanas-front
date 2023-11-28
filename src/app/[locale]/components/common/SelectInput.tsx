import React from "react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { InfoTooltip } from "./InfoTooltip";

interface Props {
  form: UseFormReturn<any, any>;
  hasInfoTooltip?: boolean;
  labelTooltip?: string;
  options: { label: string; value: any }[];
  label: string;
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
  };
}

export default function SelectInput({
  form,
  hasInfoTooltip,
  options,
  label,
  labelTooltip,
  defaultValue,
  registerOptions,
}: Props) {
  const t = useTranslations();

  const { register } = form;

  return (
    <>
      <label htmlFor={label} className="text-sm text-gray-600">
        {t(label)}

        {hasInfoTooltip && (
          <InfoTooltip content={`${t(labelTooltip)}`} delay={0} width={600} />
        )}
      </label>

      <select
        {...register(label, registerOptions)}
        id={label}
        className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
        defaultValue={defaultValue || ""}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {t(option.label)}
          </option>
        ))}
      </select>
    </>
  );
}
