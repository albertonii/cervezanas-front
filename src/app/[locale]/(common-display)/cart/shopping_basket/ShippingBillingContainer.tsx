"use client";

import Image from "next/image";
import Billing from "./Billing";
import Shipping from "./Shipping";
import { useTranslations } from "next-intl";
import React, { ComponentProps } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "../../../components/common/Button";
import { IBillingAddress, IAddress } from "../../../../../lib/types";
import { formatCurrency } from "../../../../../utils/formatCurrency";

interface Props {
  shippingAddresses: IAddress[];
  billingAddresses: IBillingAddress[];
  handleOnClickShipping: ComponentProps<any>;
  handleOnClickBilling: ComponentProps<any>;
  selectedShippingAddress: string;
  selectedBillingAddress: string;
  formShipping: UseFormReturn<any, any>;
  formBilling: UseFormReturn<any, any>;
}

export default function ShippingBillingContainer({
  shippingAddresses,
  billingAddresses,
  selectedShippingAddress,
  selectedBillingAddress,
  handleOnClickShipping,
  handleOnClickBilling,
  formShipping,
  formBilling,
}: Props) {
  const t = useTranslations();

  return (
    <section className="border-product-softBlonde flex w-full flex-col items-stretch justify-center space-y-4 border bg-gray-50 px-4 py-6 dark:bg-gray-800 md:flex-row md:space-x-6 md:space-y-0 md:p-6 xl:space-x-8 xl:p-8">
      <h2 className="text-2xl font-semibold leading-5 text-gray-800 dark:text-white">
        {t("shipping_and_billing_info")}
      </h2>
      {/* Shipping */}
      <Shipping
        formShipping={formShipping}
        shippingAddresses={shippingAddresses}
        handleOnClickShipping={handleOnClickShipping}
        selectedShippingAddress={selectedShippingAddress}
      />
      Toldo Andrea Madre Sonia
      {/* Billing */}
      <Billing
        formBilling={formBilling}
        selectedBillingAddress={selectedBillingAddress}
        billingAddresses={billingAddresses}
        handleOnClickBilling={handleOnClickBilling}
      />
      <div className="flex w-full items-start justify-between">
        <div className="flex items-center justify-center space-x-4">
          <figure className="h-8 w-8">
            <Image
              width={32}
              height={32}
              className="h-full w-full"
              alt="logo"
              src="https://i.ibb.co/L8KSdNQ/image-3.png"
              loader={() => "https://i.ibb.co/L8KSdNQ/image-3.png"}
            />
          </figure>

          <div className="flex flex-col items-center justify-start">
            <p className="text-lg font-semibold leading-6 text-gray-800 dark:text-white">
              DPD Delivery
              <br />
              <span className="font-normal">{t("delivery_24h")}</span>
            </p>
          </div>
        </div>
        <p className="text-lg font-semibold leading-6 text-gray-800 dark:text-white">
          {formatCurrency(0)}
        </p>
      </div>
      <div className="flex w-full items-center justify-center">
        <Button
          title={t("view_carrier_details") ?? "View details"}
          accent
          medium
          class="text-base font-medium sm:w-full"
        >
          {t("view_carrier_details")}
        </Button>
      </div>
    </section>
  );
}
