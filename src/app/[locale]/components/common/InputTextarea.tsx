"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { DisplayInputError } from "./DisplayInputError";

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
  };
  inputType?: string;
}
export default function InputTextarea({ form, label, registerOptions }: Props) {
  const t = useTranslations();

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div>
      <label className="relative flex cursor-pointer flex-col items-start space-y-2">
        {t(label)}

        <textarea
          className="max-h-[180px] w-full rounded-md border-2 border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
          {...register(label, registerOptions)}
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
