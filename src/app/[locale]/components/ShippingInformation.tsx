import React from "react";
import { useTranslations } from "next-intl";
import { IShippingInfo } from "../../../lib/types";
import { Button } from "../../../components/common";

interface Props {
  option: IShippingInfo;
  handleSetShippingOption: any;
}

export default function ShippingInformation({
  option,
  handleSetShippingOption,
}: Props) {
  const t = useTranslations();

  return (
    <div
      key={option.id}
      className="flex w-full flex-row items-start justify-start space-x-4"
    >
      <input
        type="radio"
        name="shipping"
        value={option.id}
        id={"shipping-" + option.id}
        onChange={() => {
          handleSetShippingOption(option.id);
        }}
        className={"mt-2"}
        checked={option.is_default}
      />
      <label
        htmlFor={"shipping-" + option.id}
        className="text-gray-600 dark:text-gray-300"
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
        <Button class={"ml-6"}>{t("edit")}</Button>
      </div>
    </div>
  );
}
