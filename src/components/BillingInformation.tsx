import { Button } from "@supabase/ui";
import React from "react";
import { useTranslation } from "react-i18next";
import { BillingInfo } from "../types";

interface Props {
  option: BillingInfo;
  handleSetBillingOption: any;
}

export default function BillingInformation({
  option,
  handleSetBillingOption,
}: Props) {
  const { t } = useTranslation();

  return (
    <div
      key={option.id}
      className="flex flex-row justify-start items-start space-x-4 w-full"
    >
      <input
        type="radio"
        name="billing"
        value={option.id}
        id={"billing-" + option.id}
        onChange={(e) => {
          handleSetBillingOption(option.id);
        }}
        className={"mt-2"}
        checked={option.is_default}
      />
      <label
        htmlFor={"billing-" + option.id}
        className="dark:text-gray-300 text-gray-600"
      >
        <span className="text-md text-beer-dark">
          {option.name} {option.lastname}
        </span>

        <p className="text-lg">
          {option.address}, {option.address_extra}, {option.zipcode},{" "}
          {option.state}, {option.city}, {option.country}
        </p>
      </label>

      <div className="flex">
        <Button>{t("delete")}</Button>
        <Button className={"ml-6"}>{t("edit")}</Button>
      </div>
    </div>
  );
}
