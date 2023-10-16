import React, { ComponentProps, useState } from "react";
import { faLongArrowRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import { DisplayInputError } from "../../../components/common/DisplayInputError";
import { IconButton } from "../../../components/common/IconButton";
import { useMutation, useQueryClient } from "react-query";
import { UseFormReturn } from "react-hook-form";
import { IBillingAddress } from "../../../../../lib/types.d";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DeleteAddress } from "../../../components/modals/DeleteAddress";
import { useSupabase } from "../../../../../context/SupabaseProvider";
import { useMessage } from "../../../components/message/useMessage";
import { NewBillingAddress } from "./NewBillingAddress";

interface Props {
  selectedBillingAddress: string;
  formBilling: UseFormReturn<any, any>;
  billingAddresses: IBillingAddress[];
  handleOnClickBilling: ComponentProps<any>;
}

export default function Billing({
  formBilling,
  billingAddresses,
  selectedBillingAddress,
  handleOnClickBilling,
}: Props) {
  const t = useTranslations();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    register: registerBilling,
    formState: { errors: errorsBilling },
  } = formBilling;

  const { handleMessage } = useMessage();
  const { supabase } = useSupabase();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // Triggers when the user clicks on the button "Delete" in the modal for Campaign deletion
  const handleRemoveBillingAddress = async () => {
    const billingAddressId = selectedBillingAddress;

    const { error: billingAddressError } = await supabase
      .from("billing_info")
      .delete()
      .eq("id", billingAddressId);

    if (billingAddressError) throw billingAddressError;

    handleMessage({
      type: "success",
      message: `${t("billing_address_removed_successfully")}`,
    });
  };

  const deleteBillingAddress = useMutation({
    mutationKey: ["deleteBillingAddress"],
    mutationFn: handleRemoveBillingAddress,
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("billingAddresses");
      setIsSubmitting(false);
    },
    onError: (error: any) => {
      console.error(error);
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: any) => {
    try {
      deleteBillingAddress.mutate(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-white">
        {t("billing_info")}{" "}
      </h3>

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

      {/* Radio button for select billing address */}
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
        {errorsBilling.billing_info_id?.type === "required" && (
          <DisplayInputError message="errors.select_location_required" />
        )}
      </ul>

      {/* Add Billing Information */}
      {billingAddresses.length < 5 && <NewBillingAddress />}

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
