import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../Auth";
import { Modal } from "../modals";
import { DisplayInputError } from "../common";
import { useSupabase } from "../Context/SupabaseProvider";
import { IModalShippingAddress, IShippingAddress } from "../../lib/types.d";
import { useMutation, useQueryClient } from "react-query";

interface Props {
  handleShippingAddresses: (s: IShippingAddress) => void;
}

export function NewShippingAddress({ handleShippingAddresses }: Props) {
  const t = useTranslations();
  const { supabase } = useSupabase();

  const { user } = useAuth();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<IModalShippingAddress>();

  const handleAddShippingAddress = async (
    formValues: IModalShippingAddress
  ) => {
    const {
      name,
      lastname,
      document_id,
      phone,
      address,
      address_extra,
      address_observations,
      country,
      state,
      city,
      zipcode,
      shipping_checked,
    } = formValues;

    const { data, error } = await supabase
      .from("shipping_info")
      .insert({
        owner_id: user?.id,
        name,
        lastname,
        document_id,
        phone,
        address,
        address_extra,
        address_observations,
        country,
        zipcode,
        city,
        state,
        is_default: shipping_checked,
      })
      .select();

    if (error) throw error;
    if (!data) throw new Error("No data returned from supabase");

    handleShippingAddresses(data[0]);
  };

  const insertShippingMutation = useMutation({
    mutationKey: ["insertShipping"],
    mutationFn: handleAddShippingAddress,
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shippingAddresses"] });
      setShowModal(false);
      setIsSubmitting(false);
      reset();
    },
    onError: (error: any) => {
      console.error(error);
      setIsSubmitting(false);
    },
  });

  const onSubmit = (formValues: IModalShippingAddress) => {
    try {
      insertShippingMutation.mutate(formValues);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      showBtn={true}
      showModal={showModal}
      setShowModal={setShowModal}
      title={t("add_shipping_address")}
      btnTitle={t("add_shipping_address")}
      description={""}
      icon={faAdd}
      handler={handleSubmit(onSubmit)}
      btnSize={"large"}
      classIcon={"w-6 h-6"}
      classContainer={`!w-1/2 ${isSubmitting && "opacity-50"}`}
    >
      <form className="w-full">
        <>
          {/* Shipping information */}
          <section>
            <fieldset className="mb-3 rounded bg-beer-foam">
              {/* Shipping Data */}
              <div className="w-full">
                <h2 className="my-2 text-lg font-semibold tracking-wide text-gray-700">
                  {t("shipping_data")}
                </h2>

                <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
                  <input
                    {...register("name", { required: true })}
                    className="mr-6 w-full px-3 focus:outline-none"
                    placeholder={`${t("name")}*`}
                    required
                  />
                  {errors.name?.type === "required" && (
                    <DisplayInputError message="errors.input_required" />
                  )}
                </label>

                <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
                  <input
                    {...register("lastname", { required: true })}
                    className="mr-6 w-full px-3 focus:outline-none"
                    placeholder={`${t("lastname")}*`}
                    required
                  />
                  {errors.lastname?.type === "required" && (
                    <DisplayInputError message="errors.input_required" />
                  )}
                </label>

                <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
                  <input
                    {...register("document_id", { required: true })}
                    className="mr-6 w-full px-3 focus:outline-none"
                    placeholder={`${t("document_id")}*`}
                  />
                  {errors.document_id?.type === "required" && (
                    <DisplayInputError message="errors.input_required" />
                  )}
                </label>

                <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
                  <input
                    {...register("phone", { required: true })}
                    type="tel"
                    className="mr-6 w-full border-none px-3 focus:outline-none"
                    placeholder={`${t("loc_phone")}*`}
                  />
                  {errors.phone?.type === "required" && (
                    <DisplayInputError message="errors.input_required" />
                  )}
                </label>
              </div>

              {/* Shipping Address */}
              <div className="mt-6 w-full">
                <h2 className="my-2 text-lg font-semibold tracking-wide text-gray-700">
                  {t("shipping_address")}
                </h2>

                <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
                  <input
                    {...register("address", { required: true })}
                    className="mr-6 w-full px-3 focus:outline-none"
                    placeholder={`${t("address")}*`}
                  />
                  {errors.address?.type === "required" && (
                    <DisplayInputError message="errors.input_required" />
                  )}
                </label>

                <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
                  <input
                    {...register("address_extra", { required: false })}
                    className="mr-6 w-full px-3 focus:outline-none"
                    placeholder={`${t("address")} 2*`}
                  />
                  {errors.address_extra?.type === "required" && (
                    <DisplayInputError message="errors.input_required" />
                  )}
                </label>

                <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
                  <input
                    {...register("address_observations", { required: false })}
                    className="mr-6 w-full px-3 focus:outline-none"
                    placeholder={`${t("address_observations")}*`}
                  />
                  {errors.address_observations?.type === "required" && (
                    <DisplayInputError message="errors.input_required" />
                  )}
                </label>

                <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
                  <input
                    {...register("country", { required: true })}
                    className="mr-6 w-full px-3 focus:outline-none"
                    placeholder={`${t("country")}*`}
                  />
                  {errors.country?.type === "required" && (
                    <DisplayInputError message="errors.input_required" />
                  )}
                </label>

                <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
                  <input
                    {...register("zipcode", { required: true })}
                    className="mr-6 w-full px-3 focus:outline-none"
                    placeholder={`${t("loc_pc")}*`}
                  />
                  {errors.zipcode?.type === "required" && (
                    <DisplayInputError message="errors.input_required" />
                  )}
                </label>

                <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
                  <input
                    {...register("city", { required: true })}
                    className="mr-6 w-full px-3 focus:outline-none"
                    placeholder={`${t("loc_town")}*`}
                  />
                  {errors.city?.type === "required" && (
                    <DisplayInputError message="errors.input_required" />
                  )}
                </label>

                <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
                  <input
                    {...register("state", { required: true })}
                    className="mr-6 w-full px-3 focus:outline-none"
                    placeholder={`${t("loc_province")}*`}
                  />
                  {errors.state?.type === "required" && (
                    <DisplayInputError message="errors.input_required" />
                  )}
                </label>
              </div>

              <div className="flex items-center">
                <input
                  {...register("shipping_checked", { required: false })}
                  id="shipping-checked-checkbox"
                  type="checkbox"
                  value=""
                  className="h-4 w-4 rounded border-bear-light bg-beer-softBlonde text-beer-blonde focus:ring-2 focus:ring-bear-alvine dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-beer-softBlonde"
                />
                <label
                  htmlFor="shipping-checked-checkbox"
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {t("shipping_checkbox")}
                </label>
              </div>
            </fieldset>
          </section>
        </>
      </form>
    </Modal>
  );
}
