"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { DisplayInputError } from "./DisplayInputError";
import { InfoTooltip } from "./InfoTooltip";

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
}
export default function InputLabel({
  form,
  label,
  labelText,
  registerOptions,
  inputType = "text",
  infoTooltip,
  placeholder,
  defaultValue,
  disabled,
}: Props) {
  const t = useTranslations();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="w-full">
      <label
        className={`flex w-full flex-col items-start space-y-2 text-sm text-gray-600`}
      >
        <span className="font-medium">
          {labelText ? labelText : t(label)}
          {infoTooltip && (
            <InfoTooltip content={`${t(infoTooltip)}`} delay={0} width={600} />
          )}
        </span>

        <input
          type={inputType ?? "text"}
          className={` 
          ${disabled && "bg-gray-100"}
            ${
              inputType === "checkbox"
                ? "h-4 w-4 rounded border-bear-light bg-beer-softBlonde text-beer-blonde focus:ring-2 focus:ring-bear-alvine dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-beer-softBlonde"
                : "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
            }
          
          `}
          {...register(label, registerOptions)}
          placeholder={placeholder}
          defaultValue={defaultValue}
          disabled={disabled}
        />
      </label>

      {errors[label] && (
        <DisplayInputError
          message={errors[label]?.message || "errors.input_required"}
        />
      )}
    </div>
  );
}