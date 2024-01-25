import React from "react";
import { useTranslations } from "next-intl";
import { UseFormRegister, UseFormReturn } from "react-hook-form";

type Props = {
  register: UseFormRegister<any>;
  inputName: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  // form: UseFormReturn<any, any>;
};

export default function InputForm({
  register,
  inputName,
  required,
  type = "text",
  placeholder,
}: // form,
Props) {
  // if (!form) return <>Error wey</>;

  const t = useTranslations();

  // const { register } = form;

  return (
    <label className="flex h-12 flex-col items-start space-y-2">
      {t(inputName)}

      <input
        {...register(inputName, { required: required })}
        className="h-full w-full rounded-md border-beer-softBlondeBubble hover:ring-1 hover:ring-beer-gold focus:border-beer-gold focus:ring-beer-gold"
        placeholder={`${t(placeholder)}*`}
        type={type}
      />
    </label>
  );
}
