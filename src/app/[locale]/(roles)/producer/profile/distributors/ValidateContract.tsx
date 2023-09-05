import React from "react";
import { useTranslations } from "next-intl";
import { UseFormRegister, UseFormReturn } from "react-hook-form";
import { DisplayInputError } from "../../../../../../components/common";

interface Props {
  form: UseFormReturn<any>;
}

export default function CollaborationDetails({ form }: Props) {
  const t = useTranslations();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <section className="border-1 rounded-medium space-y-8 border p-2">
      <div className="flex flex-col space-y-2">
        {/* Checkbox input to agree with the distribution contract terms and services */}
        <label htmlFor="terms" className="flex items-center gap-2">
          <input
            type="checkbox"
            id="terms"
            value=""
            {...register("is_signed")}
            className="h-4 w-4 rounded border-bear-light bg-beer-softBlonde text-beer-blonde focus:ring-2 focus:ring-bear-alvine dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-beer-softBlonde"
          />
          <p> {t("agree_terms_and_conditions_contract_distribution")}</p>
        </label>

        {/* Error input isSigned */}
        {errors.is_signed && <DisplayInputError message="errors.is_signed" />}
      </div>

      {/* Text area to write a message to the distributor to send the contract  */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="message">
          {t("message_to_distributor_contract_distribution")}
        </label>
        <textarea
          id="message"
          className="border-1 rounded-medium select:border-beer-gold border border-beer-blonde p-2 ring-1 focus:border-beer-gold "
          {...register("message")}
        />

        {/* Error input message */}
        {errors.message && <DisplayInputError message="errors.message" />}
      </div>
    </section>
  );
}
