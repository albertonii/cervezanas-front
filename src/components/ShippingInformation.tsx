import { Button } from "@supabase/ui";
import React from "react";
import { useTranslation } from "react-i18next";
import { ShippingInfo } from "../types";

interface Props {
  option: ShippingInfo;
  handleSetShippingOption: any;
}

export default function ShippingInformation({
  option,
  handleSetShippingOption,
}: Props) {
  const { t } = useTranslation();

  return (
    <div
      key={option.id}
      className="flex flex-row justify-start items-start space-x-4 w-full"
    >
      <input
        type="radio"
        name="shipping"
        value={option.id}
        id={"shipping-" + option.id}
        onChange={(e) => {
          handleSetShippingOption(option.id);
        }}
        className={"mt-2"}
        checked={option.is_default}
      />
      <label
        htmlFor={"shipping-" + option.id}
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
