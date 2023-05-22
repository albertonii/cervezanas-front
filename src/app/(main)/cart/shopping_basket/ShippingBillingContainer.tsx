"use client";

import React, { ComponentProps, useState } from "react";
import Image from "next/image";
import { faLongArrowRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { NewShippingAddress } from "../../../../components/checkout";
import {
  Button,
  DisplayInputError,
  IconButton,
} from "../../../../components/common";
import { IBillingAddress, IShippingAddress } from "../../../../lib/types.d";
import { formatCurrency } from "../../../../utils";
import { DeleteAddress } from "../../../../components/modals/DeleteAddress";
import { useMessage } from "../../../../components/message";
import { useSupabase } from "../../../../components/Context/SupabaseProvider";

interface Props {
  shippingAddresses: IShippingAddress[];
  handleShippingAddresses: ComponentProps<any>;
  billingAddresses: IBillingAddress[];
  handleBillingAddresses: ComponentProps<any>;
  handleOnClickShipping: ComponentProps<any>;
  handleOnClickBilling: ComponentProps<any>;
  selectedShippingAddress: string;
  selectedBillingAddress: string;
  formShipping: UseFormReturn<any, any>;
  formBilling: UseFormReturn<any, any>;
}

export default function ShippingBillingContainer({
  shippingAddresses,
  handleShippingAddresses,
  selectedShippingAddress,
  billingAddresses,
  handleOnClickShipping,
  handleOnClickBilling,
  selectedBillingAddress,
  formShipping,
  formBilling,
}: Props) {
  const { t } = useTranslation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { handleMessage } = useMessage();

  const { supabase } = useSupabase();

  const {
    register: registerShipping,
    formState: { errors: errorsShipping },
  } = formShipping;

  const {
    register: registerBilling,
    formState: { errors: errorsBilling },
  } = formBilling;

  // Triggers when the user clicks on the button "Delete" in the modal for Campaign deletion
  const handleResponseDeleteModal = (value: boolean) => {
    // Remove Shipping Address
    const handleRemoveShippingAddress = async () => {
      const shippingAddressId = selectedShippingAddress;

      const { error: shippingAddressError } = await supabase
        .from("shipping_info")
        .delete()
        .eq("id", shippingAddressId);

      if (shippingAddressError) throw shippingAddressError;

      handleShippingAddresses(
        shippingAddresses.filter((c) => {
          return c.id !== shippingAddressId;
        })
      );

      handleMessage({
        type: "success",
        message: `${t("shipping_address_removed_successfully")}`,
      });
    };

    handleRemoveShippingAddress();
    // handleOnClickShipping(address);
  };

  return (
    <>
      <div className="border-product-softBlonde flex w-full flex-col items-stretch justify-center space-y-4 border md:flex-row md:space-x-6 md:space-y-0 xl:space-x-8">
        <div className="flex w-full flex-col justify-center space-y-6 bg-gray-50 px-4 py-6 dark:bg-gray-800 md:p-6 xl:p-8">
          <h2 className="text-2xl font-semibold leading-5 text-gray-800 dark:text-white">
            {t("shipping_and_billing_info")}
          </h2>

          <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-white">
            {t("shipping_info")}{" "}
          </h3>

          {/* Shipping */}
          <div className="flex w-full flex-col items-start justify-start space-y-4">
            <div className="flex w-full flex-col items-start justify-start space-y-2">
              <label
                htmlFor="shipping"
                className="text-sm font-medium text-gray-500"
              >
                {t("shipping")}
              </label>
            </div>
          </div>

          {/* Radio button for select shipping address */}
          <ul className="grid w-full gap-6 md:grid-cols-1">
            {shippingAddresses.map((address) => {
              return (
                <div key={address.id}>
                  <li onClick={() => handleOnClickShipping(address.id)}>
                    <input
                      type="radio"
                      id={`shipping-address-${address.id}`}
                      {...registerShipping("shipping_info_id", {
                        required: true,
                      })}
                      value={address.id}
                      className="peer hidden"
                      required
                    />

                    <label
                      htmlFor={`shipping-address-${address.id}`}
                      className="dark:peer-checked:text-product-blonde peer-checked:border-product-softBlonde peer-checked:text-product-dark inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200
                                         bg-white p-5 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-4 peer-checked:bg-bear-alvine dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    >
                      <div className="block">
                        <div className="w-full text-lg font-semibold">
                          {address.name} {address.lastname}
                        </div>
                        <div className="w-full">
                          {address.address}, {address.city}, {address.state},{" "}
                          {address.zipcode}, {address.country}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <IconButton
                          onClick={() => setShowDeleteModal(true)}
                          icon={faTrash}
                          title={"delete_address"}
                        />

                        <FontAwesomeIcon
                          icon={faLongArrowRight}
                          style={{
                            color: "#fdc300",
                            width: "25px",
                          }}
                          title={"arrow_right"}
                          width={25}
                          height={25}
                        />
                      </div>
                    </label>
                  </li>
                </div>
              );
            })}

            {/* Error input displaying */}
            {errorsShipping.shipping_info_id?.type === "required" && (
              <DisplayInputError message="errors.select_location_required" />
            )}
          </ul>

          {/* Add Shipping Information */}
          {shippingAddresses.length < 5 && (
            <NewShippingAddress
              handleShippingAddresses={handleShippingAddresses}
            />
          )}

          <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-white">
            {t("billing_info")}
          </h3>

          {/* Billing */}
          <div className="flex w-full flex-col items-start justify-start space-y-4">
            <div className="flex w-full flex-col items-start justify-start space-y-2">
              <label
                htmlFor="billing"
                className="text-sm font-medium text-gray-500"
              >
                {t("billing")}
              </label>
            </div>
          </div>

          {/* Radio button for select billing addresses */}
          <ul className="grid w-full gap-6 md:grid-cols-1">
            {billingAddresses.map((address) => {
              return (
                <div key={address.id}>
                  <li onClick={() => handleOnClickBilling(address.id)}>
                    <input
                      type="radio"
                      id={`billing-address-${address.id}`}
                      {...registerBilling("billing_info_id", {
                        required: true,
                      })}
                      value={address.id}
                      className="peer hidden"
                      required
                    />

                    <label
                      htmlFor={`billing-address-${address.id}`}
                      className="dark:peer-checked:text-product-blonde peer-checked:border-product-softBlonde peer-checked:text-product-dark inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200
                                         bg-white p-5 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-4 peer-checked:bg-bear-alvine dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    >
                      <div className="block">
                        <div className="w-full text-lg font-semibold">
                          {address.name} {address.lastname}
                        </div>
                        <div className="w-full">
                          {address.address}, {address.city}, {address.state},{" "}
                          {address.zipcode}, {address.country}
                        </div>
                      </div>

                      <FontAwesomeIcon
                        icon={faLongArrowRight}
                        style={{
                          color: "#fdc300",
                          width: "35px",
                        }}
                        title={"arrow_right"}
                        width={25}
                        height={25}
                      />
                    </label>
                  </li>
                </div>
              );
            })}

            {/* Error input displaying */}
            {errorsBilling.billing_info_id?.type === "required" && (
              <DisplayInputError message="errors.select_location_required" />
            )}
          </ul>

          {/* Add Billing Information  */}
          {/* {billingAddresses.length < 5 && (
            <NewBillingAddress
              handleBillingAddresses={handleBillingAddresses}
            />
          )} */}

          <div className="flex w-full items-start justify-between">
            <div className="flex items-center justify-center space-x-4">
              <div className="h-8 w-8">
                <Image
                  width={32}
                  height={32}
                  className="h-full w-full"
                  alt="logo"
                  src="https://i.ibb.co/L8KSdNQ/image-3.png"
                />
              </div>
              <div className="flex flex-col items-center justify-start">
                <p className="text-lg font-semibold leading-6 text-gray-800 dark:text-white">
                  DPD Delivery
                  <br />
                  <span className="font-normal">{t("delivery_24h")}</span>
                </p>
              </div>
            </div>
            <p className="text-lg font-semibold leading-6 text-gray-800 dark:text-white">
              {formatCurrency(8)}
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
        </div>
      </div>

      {showDeleteModal && (
        <DeleteAddress
          handleResponseModal={handleResponseDeleteModal}
          showModal={showDeleteModal}
          setShowModal={setShowDeleteModal}
        />
      )}
    </>
  );
}
