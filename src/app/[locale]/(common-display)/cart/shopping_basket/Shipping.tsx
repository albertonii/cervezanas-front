import React, { ComponentProps, useState } from "react";

import { faLongArrowRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import { DisplayInputError } from "../../../components/common/DisplayInputError";
import { IconButton } from "../../../components/common/IconButton";
import { UseFormReturn } from "react-hook-form";
import { IShippingAddress } from "../../../../../lib/types.d";
import { useTranslations } from "next-intl";
import { DeleteAddress } from "../../../components/modals/DeleteAddress";
import { useSupabase } from "../../../../../context/SupabaseProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "react-query";
import { useMessage } from "../../../components/message/useMessage";
import { NewShippingAddress } from "./NewShippingAddress";

interface Props {
  selectedShippingAddress: string;
  formShipping: UseFormReturn<any, any>;
  shippingAddresses: IShippingAddress[];
  handleOnClickShipping: ComponentProps<any>;
}

export default function Shipping({
  formShipping,
  shippingAddresses,
  selectedShippingAddress,
  handleOnClickShipping,
}: Props) {
  const t = useTranslations();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    register: registerShipping,
    formState: { errors: errorsShipping },
  } = formShipping;

  const { handleMessage } = useMessage();
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();

  // Triggers when the user clicks on the button "Delete" in the modal for Campaign deletion
  // Remove Shipping Address
  const handleRemoveShippingAddress = async () => {
    const shippingAddressId = selectedShippingAddress;

    const { error: shippingAddressError } = await supabase
      .from("shipping_info")
      .delete()
      .eq("id", shippingAddressId);

    if (shippingAddressError) throw shippingAddressError;

    handleMessage({
      type: "success",
      message: `${t("shipping_address_removed_successfully")}`,
    });
  };

  const deleteShippingAddress = useMutation({
    mutationKey: ["deleteShippingAddress"],
    mutationFn: handleRemoveShippingAddress,
    onSuccess: () => {
      queryClient.invalidateQueries("shippingAddresses");
    },
    onError: (error: any) => {
      console.error(error);
    },
  });

  const onSubmit = async (data: any) => {
    try {
      deleteShippingAddress.mutate(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-white">
        {t("shipping_info")}{" "}
      </h3>

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
            <article key={address.id}>
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
                    <span className="w-full text-lg font-semibold">
                      {address.name} {address.lastname}
                    </span>
                    <span className="w-full">
                      {address.address}, {address.city}, {address.state},{" "}
                      {address.zipcode}, {address.country}
                    </span>
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
            </article>
          );
        })}

        {/* Error input displaying */}
        {errorsShipping.shipping_info_id?.type === "required" && (
          <DisplayInputError message="errors.select_location_required" />
        )}
      </ul>

      {/* Add Shipping Information */}
      {shippingAddresses.length < 5 && <NewShippingAddress />}

      {showDeleteModal && (
        <DeleteAddress
          handleResponseModal={onSubmit}
          showModal={showDeleteModal}
          setShowModal={setShowDeleteModal}
        />
      )}
    </>
  );
}
