import React from "react";
import { useTranslations } from "next-intl";
import { UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<any>;
  inputName: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  id: string;
  defaultValue?: string | number;
};

export default function InputForm({
  register,
  inputName,
  required,
  type = "text",
  placeholder,
  id,
  defaultValue,
}: Props) {
  // if (!register) return;

  // if (!inputName) return;

  const t = useTranslations();
  return (
    <label className="flex h-12 flex-col items-start space-y-2" htmlFor={id}>
      <input
        {...register(inputName, { required: required })}
        className="h-full w-full rounded-md border-beer-softBlondeBubble hover:ring-1 hover:ring-beer-gold focus:border-beer-gold focus:ring-beer-gold"
        placeholder={`${t(placeholder)}*`}
        type={type}
        id={id}
        defaultValue={defaultValue}
      />
    </label>
  );
}
