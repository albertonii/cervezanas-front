"use client";

import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
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
    value?: any;
  };
  inputType?: string;
  infoTooltip?: string;
  placeholder?: string;
  labelText?: string;
}
export default function InputLabel({
  form,
  label,
  labelText,
  registerOptions,
  inputType,
  infoTooltip,
  placeholder,
}: Props) {
  const t = useTranslations();

  const {
    register,
    formState: { errors },
  } = form;

  useEffect(() => {
    console.log(errors);
    console.log(errors[label]);
    console.log(errors["price"]);
  }, [errors]);

  return (
    <div className="w-full">
      <label className="flex w-full flex-col items-start space-y-2 text-sm text-gray-600">
        <span>
          {labelText ? labelText : t(label)}
          {infoTooltip && (
            <InfoTooltip
              content={`${t("intensity_tooltip")}`}
              delay={0}
              width={600}
            />
          )}
        </span>

        <input
          type={inputType ?? "text"}
          className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
          {...register(label, registerOptions)}
          placeholder={placeholder}
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
